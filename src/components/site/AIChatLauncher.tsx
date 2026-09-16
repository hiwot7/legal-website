"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconX } from "./Icons";

const SESSION_KEY = "aiTeaserShown";
const SHOW_DELAY_MS = 5000;
const AUTO_HIDE_MS = 9000;

export default function AIChatLauncher({ t, onOpen }: { t: Translation; onOpen: () => void }) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // ignore storage failures
    }
    if (alreadyShown) return;

    const showTimer = setTimeout(() => {
      setShowBubble(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore storage failures
      }
      setTimeout(() => setShowBubble(false), AUTO_HIDE_MS);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, []);

  function open() {
    setShowBubble(false);
    onOpen();
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {showBubble && (
        <div
          role="status"
          style={{
            maxWidth: 240,
            background: "var(--surface)",
            color: "var(--ink)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            borderBottomRightRadius: 4,
            padding: "12px 14px",
            fontSize: 13.5,
            lineHeight: 1.5,
            boxShadow: "0 10px 30px rgba(0,0,0,.16)",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            animation: "aiBubbleIn .35s ease",
          }}
        >
          <button
            onClick={open}
            style={{ background: "none", border: "none", padding: 0, color: "inherit", textAlign: "left", fontSize: 13.5, lineHeight: 1.5, cursor: "pointer", flex: 1 }}
          >
            {t.aiTeaser}
          </button>
          <button
            aria-label="Dismiss"
            onClick={() => setShowBubble(false)}
            style={{ background: "none", border: "none", padding: 2, color: "var(--ink-faint)", cursor: "pointer", flexShrink: 0 }}
          >
            <IconX size={13} />
          </button>
        </div>
      )}

      <div style={{ position: "relative", width: 58, height: 58 }}>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "var(--accent)",
            animation: "aiPulseRing 2.6s ease-out infinite",
          }}
        />
        <button
          onClick={open}
          aria-label={t.aiOpenLabel}
          style={{
            position: "relative",
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "var(--accent-ink)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(150,19,26,.35)",
            fontSize: 26,
            lineHeight: 1,
          }}
        >
          <span style={{ display: "inline-block", animation: "aiWave 4.5s ease-in-out infinite", transformOrigin: "70% 70%" }}>👋</span>
        </button>
      </div>
    </div>
  );
}
