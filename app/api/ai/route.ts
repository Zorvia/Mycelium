/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY ?? "";
const DEEPSEEK_URL = process.env.DEEPSEEK_URL ?? "http://127.0.0.1:8787/api/generate";
const MAX_PROMPT_LENGTH = 2000;

function buildSystemPrompt(storyTitle: string, storyContent: string): string {
  let sys = "You are a literary assistant for the Mycelium digital library. ";
  if (storyTitle && storyContent) {
    const truncated = storyContent.slice(0, 3000);
    sys += `The reader is currently reading "${storyTitle}". Here is the story text:\n\n${truncated}\n\n`;
  }
  sys += "Provide thoughtful, concise responses about the story.";
  return sys;
}

async function callCloudAPI(systemPrompt: string, userPrompt: string, maxTokens: number) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: "DeepSeek API error" } }));
    throw new Error(err.error?.message ?? `DeepSeek API returned ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callLocalServer(systemPrompt: string, userPrompt: string, maxTokens: number) {
  const fullPrompt = `${systemPrompt}\n\nThe reader asks: ${userPrompt}\n\nProvide a thoughtful, concise response:`;
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt, maxTokens }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Inference server error" }));
    throw new Error(err.error ?? "Inference server error");
  }

  const data = await res.json();
  return data.text ?? "";
}

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
  const systemPrompt = buildSystemPrompt(storyTitle, storyContent);

  try {
    const text = DEEPSEEK_API_KEY
      ? await callCloudAPI(systemPrompt, userPrompt, maxTokens)
      : await callLocalServer(systemPrompt, userPrompt, maxTokens);
    return NextResponse.json({ text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("abort") || message.includes("timeout")) {
      return NextResponse.json({ error: "AI server timed out" }, { status: 504 });
    }
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "AI not configured. Set DEEPSEEK_API_KEY for cloud or run deepseek-server.py locally." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
