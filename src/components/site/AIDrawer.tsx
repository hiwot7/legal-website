"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang, Translation } from "@/lib/i18n";
import { IconAlert, IconBot, IconSend, IconX } from "./Icons";

type Message = { role: "user" | "model"; text: string };

export default function AIDrawer({ open, onClose, t, lang }: { open: boolean; onClose: () => void; t: Translation; lang: Lang }) {
  const [messages, setMessages] = useState<Message[]>([{ role: "model", text: t.aiGreeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seededLang = useRef(lang);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (lang !== seededLang.current && messages.length <= 1) {
      seededLang.current = lang;
      setMessages([{ role: "model", text: t.aiGreeting }]);
    }
  }, [lang, t.aiGreeting, messages.length]);

  async function send() {
    const text = input.trim();
    if (!text || typing) return;

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: nextMessages, lang }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.aiUnavailable);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      }
    } catch {
      setError(t.aiUnavailable);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(15,23,42,.45)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity .2s",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(420px,94vw)",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .25s ease",
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--ink)",
            color: "var(--bg)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconBot size={20} />
            <span className="serif" style={{ fontWeight: 700, fontSize: 17 }}>
              {t.aiTitle}
            </span>
          </div>
          <button aria-label="Close AI assistant" onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--bg)" }}>
            <IconX size={20} />
          </button>
        </div>

        <div
          style={{
            margin: 16,
            marginBottom: 0,
            background: "var(--accent-tint)",
            border: "1px solid var(--accent)",
            borderRadius: 2,
            padding: "12px 14px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <IconAlert size={17} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: "var(--accent)", lineHeight: 1.5, fontWeight: 600 }}>{t.aiDisclaimer}</span>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "85%",
                  padding: "11px 14px",
                  borderRadius: 2,
                  fontSize: 14,
                  lineHeight: 1.55,
                  background: m.role === "user" ? "var(--accent)" : "var(--surface-2)",
                  color: m.role === "user" ? "var(--accent-ink)" : "var(--ink)",
                  border: m.role === "user" ? "none" : "1px solid var(--border)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "11px 14px", borderRadius: 2, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--ink-faint)",
                      animation: `blink 1.2s ${i * 0.15}s infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {error && (
            <div style={{ borderRadius: 2, background: "var(--accent-tint)", border: "1px solid var(--accent)", padding: "10px 12px", fontSize: 13, color: "var(--accent)" }}>
              {error}
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t.aiPlaceholder}
            style={{
              flex: 1,
              border: "1px solid var(--border-strong)",
              borderRadius: 2,
              padding: "12px 14px",
              fontSize: 14,
              outline: "none",
              background: "var(--bg)",
              color: "var(--ink)",
              fontFamily: "inherit",
            }}
          />
          <button className="btn btn-primary" onClick={send} aria-label="Send" disabled={typing} style={{ padding: "0 16px" }}>
            <IconSend size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
