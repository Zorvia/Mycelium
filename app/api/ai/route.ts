/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_URL = process.env.DEEPSEEK_URL ?? "http://127.0.0.1:8787/api/generate";
const MAX_PROMPT_LENGTH = 2000;

/**
 * POST /api/ai
 * Body: { prompt: string, storyTitle?: string, storyContent?: string, maxTokens?: number }
 *
 * Proxies to the local DeepSeek R1 inference server and returns the generated text.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userPrompt = String(body.prompt ?? "").trim();
  if (!userPrompt) {
    return NextResponse.json({ error: "Missing 'prompt' field" }, { status: 400 });
  }
  if (userPrompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json({ error: "Prompt too long" }, { status: 400 });
  }

  const storyTitle = String(body.storyTitle ?? "").trim();
  const storyContent = String(body.storyContent ?? "").trim();
  const maxTokens = Math.min(Number(body.maxTokens) || 512, 1024);

  // Build the full prompt with story context
  let fullPrompt = "";
  if (storyTitle && storyContent) {
    // Truncate story content to keep prompt manageable
    const truncatedContent = storyContent.slice(0, 3000);
    fullPrompt =
      `You are a literary assistant for the Mycelium digital library. ` +
      `The reader is currently reading "${storyTitle}". ` +
      `Here is the story text:\n\n${truncatedContent}\n\n` +
      `The reader asks: ${userPrompt}\n\n` +
      `Provide a thoughtful, concise response:`;
  } else {
    fullPrompt =
      `You are a literary assistant for the Mycelium digital library. ` +
      `A reader asks: ${userPrompt}\n\n` +
      `Provide a thoughtful, concise response:`;
  }

  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: fullPrompt, maxTokens }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Inference server error" }));
      return NextResponse.json(
        { error: err.error ?? "Inference server error" },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text ?? "" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("abort") || message.includes("timeout")) {
      return NextResponse.json({ error: "AI server timed out" }, { status: 504 });
    }
    return NextResponse.json(
      { error: "Could not reach AI server. Make sure deepseek-server.py is running." },
      { status: 503 },
    );
  }
}
