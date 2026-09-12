import type { ReactNode } from "react";

export default function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 100,
        fontSize: 12.5,
        fontWeight: 600,
        border: "1px solid var(--border-strong)",
        color: "var(--ink-soft)",
        background: "var(--surface-2)",
      }}
    >
      {children}
    </span>
  );
}
