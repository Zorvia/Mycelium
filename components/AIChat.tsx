/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";

type Message = { role: "user" | "ai"; text: string };

type Props = {
  storyTitle: string;
  /** Plain-text version of the story (HTML stripped). */
  storyText: string;
};

export function AIChat({ storyTitle, storyText }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("prompt") as HTMLInputElement;
    const prompt = input.value.trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    input.value = "";
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          storyTitle,
          storyContent: storyText,
          maxTokens: 512,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: data.text }]);
      }
    } catch {
      setError("Failed to reach the AI server.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="button button-primary ai-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
      >
        🤖 Ask DeepSeek R1
      </button>
    );
  }

  return (
    <section className="ai-chat" aria-label="AI assistant">
      <div className="ai-header">
        <strong>DeepSeek R1 — Story Assistant</strong>
        <button className="button" onClick={() => setOpen(false)} aria-label="Close AI assistant">
          ✕
        </button>
      </div>

      <div className="ai-messages">
        {messages.length === 0 && (
          <p className="notice">
            Ask anything about &ldquo;{storyTitle}&rdquo; — themes, characters, writing style, or
            get a summary.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg ai-msg-${msg.role}`}>
            <span className="ai-msg-label">{msg.role === "user" ? "You" : "DeepSeek R1"}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="ai-msg ai-msg-ai">
            <span className="ai-msg-label">DeepSeek R1</span>
            <p className="ai-typing">Thinking…</p>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <form className="ai-form" onSubmit={handleSubmit}>
        <input
          className="input"
          name="prompt"
          placeholder="Ask about this story…"
          maxLength={2000}
          autoComplete="off"
          required
        />
        <button className="button button-primary" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </section>
  );
}
