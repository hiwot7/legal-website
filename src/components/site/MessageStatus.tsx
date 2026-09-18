"use client";

import { useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconSearch, IconCheck } from "./Icons";
import Reveal from "./Reveal";

type Message = {
  id: string;
  message: string;
  status: string;
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
};

export default function MessageStatus({ t }: { t: Translation }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setMessages(null);
    setError(null);

    try {
      const res = await fetch("/api/leads/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessages(data.messages);
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="message-status" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.msgEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14 }}>{t.msgTitle}</h2>
          <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 520, fontSize: 15 }}>{t.msgSub}</p>
        </Reveal>

        <Reveal>
          <div className="card" style={{ marginTop: 22, padding: 22, maxWidth: 640 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div
                style={{
                  flex: "1 1 240px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid var(--border-strong)",
                  borderRadius: 2,
                  padding: "0 14px",
                }}
              >
                <IconSearch size={17} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  placeholder={t.msgPlaceholder}
                  className="mono"
                  style={{ border: "none", outline: "none", padding: "14px 0", fontSize: 14.5, width: "100%", background: "transparent", color: "var(--ink)" }}
                />
              </div>
              <button className="btn btn-primary" onClick={doSearch} disabled={loading} style={{ minWidth: 120 }}>
                {loading ? t.msgSearching : t.msgSearch}
              </button>
            </div>

            {error && <p style={{ fontSize: 13, color: "var(--accent)", marginTop: 14 }}>{error}</p>}
            {messages !== null && messages.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--accent)", marginTop: 14 }}>{t.msgNotFound}</p>
            )}

            {messages !== null && messages.length > 0 && (
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 18, animation: "resultIn .4s ease" }}>
                {messages.map((m) => (
                  <div key={m.id} style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>
                      {t.msgYourMessage} · {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                    <p style={{ fontSize: 14, marginTop: 6, color: "var(--ink-soft)" }}>{m.message}</p>

                    {m.response ? (
                      <div
                        style={{
                          marginTop: 14,
                          background: "var(--accent-tint)",
                          border: "1px solid var(--accent)",
                          borderRadius: 2,
                          padding: "14px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: ".08em",
                            color: "var(--accent)",
                            fontWeight: 700,
                          }}
                        >
                          <span style={{ display: "inline-flex", animation: "checkPop .4s ease .1s both" }}>
                            <IconCheck size={13} />
                          </span>
                          {t.msgRespondedOn} {m.respondedAt && `· ${new Date(m.respondedAt).toLocaleDateString()}`}
                        </div>
                        <p style={{ fontSize: 14.5, fontWeight: 600, marginTop: 6 }}>{m.response}</p>
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 10 }}>{t.msgNoResponseYet}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
