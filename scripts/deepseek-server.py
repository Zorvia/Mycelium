# Project: Mycelium
# Owned by Zorvia
# All credits to the Zorvia Community
# Licensed under ZPL v2.0 — see LICENSE.md

"""
DeepSeek R1 inference server for Mycelium.

Loads the local DeepSeek-R1-Distill-Qwen-7B model and exposes a
JSON API on http://127.0.0.1:8787/api/generate for the Next.js frontend.

Usage:
    pip install torch transformers fastapi uvicorn
    python scripts/deepseek-server.py
"""

import os
import json
import logging
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from http.server import HTTPServer, BaseHTTPRequestHandler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deepseek-server")

MODEL_DIR = str(Path(__file__).resolve().parent.parent / "DeepSeek-R1-Distill-Qwen-7B")
HOST = os.environ.get("DEEPSEEK_HOST", "127.0.0.1")
PORT = int(os.environ.get("DEEPSEEK_PORT", "8787"))
MAX_NEW_TOKENS = int(os.environ.get("DEEPSEEK_MAX_TOKENS", "512"))

logger.info("Loading tokenizer from %s …", MODEL_DIR)
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, trust_remote_code=True)

logger.info("Loading model from %s …", MODEL_DIR)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_DIR,
    torch_dtype=torch.bfloat16,
    device_map="auto",
    trust_remote_code=True,
)
model.eval()
logger.info("Model loaded successfully.")


def generate(prompt: str, max_tokens: int = MAX_NEW_TOKENS) -> str:
    """Run inference on the loaded model and return generated text."""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=0.6,
            top_p=0.95,
            do_sample=True,
        )
    # Decode only the newly generated tokens
    generated = output_ids[0][inputs["input_ids"].shape[1]:]
    return tokenizer.decode(generated, skip_special_tokens=True)


class Handler(BaseHTTPRequestHandler):
    """Minimal HTTP handler for the inference endpoint."""

    def _send_json(self, status: int, data: dict):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json(204, {})

    def do_POST(self):
        if self.path != "/api/generate":
            self._send_json(404, {"error": "Not found"})
            return

        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            self._send_json(400, {"error": "Empty request body"})
            return

        try:
            body = json.loads(self.rfile.read(length))
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON"})
            return

        prompt = body.get("prompt", "").strip()
        if not prompt:
            self._send_json(400, {"error": "Missing 'prompt' field"})
            return

        max_tokens = min(int(body.get("maxTokens", MAX_NEW_TOKENS)), 1024)

        try:
            result = generate(prompt, max_tokens)
            self._send_json(200, {"text": result})
        except Exception as e:
            logger.exception("Generation error")
            self._send_json(500, {"error": str(e)})

    def log_message(self, fmt, *args):
        logger.info(fmt, *args)


if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    logger.info("DeepSeek R1 server listening on http://%s:%d", HOST, PORT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info("Shutting down.")
        server.server_close()
