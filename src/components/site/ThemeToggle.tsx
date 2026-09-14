"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark" | "sepia";

const OPTIONS: { value: Theme; label: string; glyph: string }[] = [
  { value: "system", label: "System", glyph: "◐" },
  { value: "light", label: "Light", glyph: "☀" },
  { value: "dark", label: "Dark", glyph: "☽" },
  { value: "sepia", label: "Sepia", glyph: "☷" },
];

export default function ThemeToggle({ dark = false }: { dark?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) setTheme(stored);
    } catch {
      // localStorage unavailable — fall back to system default
    }
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    setOpen(false);
    try {
      if (next === "system") {
        localStorage.removeItem("theme");
        document.documentElement.removeAttribute("data-theme");
      } else {
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
      }
    } catch {
      // localStorage unavailable — theme just won't persist across reloads
    }
  }

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];
  const ink = dark ? "#ffffff" : "var(--ink-soft)";
  const border = dark ? "rgba(255,255,255,.4)" : "var(--border-strong)";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change color theme"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          borderRadius: 100,
          border: `1px solid ${border}`,
          background: "transparent",
          color: ink,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span aria-hidden="true">{current.glyph}</span>
        {current.label}
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 59 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              zIndex: 60,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              boxShadow: "0 8px 24px rgba(15,23,42,.15)",
              overflow: "hidden",
              minWidth: 140,
            }}
          >
            {OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => choose(o.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 14px",
                  background: o.value === theme ? "var(--surface-2)" : "transparent",
                  color: "var(--ink)",
                  fontSize: 13.5,
                  fontWeight: o.value === theme ? 700 : 500,
                  textAlign: "left",
                  border: "none",
                }}
              >
                <span aria-hidden="true">{o.glyph}</span>
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
