"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconX, IconCheck } from "./Icons";

const STORAGE_KEY = "subscribePopupState";
const SHOW_DELAY_MS = 9000;
const RE_ASK_DAYS = 14;

export default function SubscribePopup({ t }: { t: Translation }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let stored: { dismissedAt?: number; subscribed?: boolean } = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      // ignore malformed/unavailable storage
    }
    if (stored.subscribed) return;
    if (stored.dismissedAt && Date.now() - stored.dismissedAt < RE_ASK_DAYS * 24 * 60 * 60 * 1000) return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }));
    } catch {
      // ignore storage failures — the popup will just reappear next visit
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ subscribed: true }));
      } catch {
        // ignore storage failures
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(15,23,42,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: "min(420px, 100%)",
          background: "var(--surface)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ height: 5, background: "var(--gold-surface)" }} />
        <button
          aria-label="Close"
          onClick={dismiss}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "transparent",
            border: "none",
            color: "var(--ink-faint)",
            padding: 4,
          }}
        >
          <IconX size={18} />
        </button>

        <div style={{ padding: "32px 28px 28px" }}>
          {status === "success" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "var(--good-tint, var(--accent-tint))",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={20} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: 0 }}>{t.popupSuccess}</p>
            </div>
          ) : (
            <>
              <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, paddingRight: 20 }}>
                {t.popupHeadline}
              </h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 20 }}>{t.popupBody}</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.popupNamePlaceholder}
                  style={{
                    padding: "12px 14px",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 2,
                    fontSize: 14,
                    background: "var(--bg)",
                    color: "var(--ink)",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.popupEmailPlaceholder}
                  style={{
                    padding: "12px 14px",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 2,
                    fontSize: 14,
                    background: "var(--bg)",
                    color: "var(--ink)",
                    fontFamily: "inherit",
                  }}
                />

                {status === "error" && <p style={{ fontSize: 13, color: "var(--accent)", margin: 0 }}>{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={status === "submitting"} style={{ marginTop: 4 }}>
                  {status === "submitting" ? t.popupSubmitting : t.popupSubmit}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  style={{ background: "none", border: "none", color: "var(--ink-faint)", fontSize: 13, cursor: "pointer", padding: 4 }}
                >
                  {t.popupDismiss}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
