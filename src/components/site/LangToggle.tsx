import type { Lang } from "@/lib/i18n";

const OPTIONS: Lang[] = ["en", "am", "om"];

export default function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div style={{ display: "flex", border: "1px solid var(--border-strong)", borderRadius: 2, overflow: "hidden" }}>
      {OPTIONS.map((o) => (
        <button
          key={o}
          onClick={() => setLang(o)}
          style={{
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".04em",
            background: lang === o ? "var(--accent)" : "transparent",
            color: lang === o ? "var(--accent-ink)" : "var(--ink-soft)",
            border: "none",
            textTransform: "uppercase",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
