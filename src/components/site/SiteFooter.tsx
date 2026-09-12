import type { Translation } from "@/lib/i18n";

export default function SiteFooter({ t }: { t: Translation }) {
  return (
    <footer style={{ background: "var(--accent)", color: "#ffffff" }}>
      <div
        className="container"
        style={{ padding: "40px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 20, alignItems: "center" }}
      >
        <div>
          <div className="serif" style={{ fontWeight: 700, fontSize: 16 }}>
            {t.firm}
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{t.footerNote}</div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          © 2026 {t.firm}. {t.footerRights}
        </div>
      </div>
    </footer>
  );
}
