"use client";

import { useEffect, useState } from "react";

type ContentItem = { key: string; valueEn: string; valueAm: string; valueOm: string };

const LABELS: Record<string, string> = {
  heroKicker: "Hero — kicker line",
  heroTitle: "Hero — headline",
  heroSub: "Hero — subheading",
  ctaPrimary: "Hero — primary button",
  ctaSecondary: "Hero — secondary button",
  insightsEyebrow: "Insights section — eyebrow",
  insightsTitle: "Insights section — title",
  footerNote: "Footer — note",
};

const inputStyle: React.CSSProperties = {
  marginTop: 4,
  width: "100%",
  padding: "9px 11px",
  border: "1px solid #cbd2da",
  borderRadius: 2,
  fontSize: 13.5,
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#8a93a3" };

export default function SiteTextPage() {
  const [items, setItems] = useState<ContentItem[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  function update(key: string, field: "valueEn" | "valueAm" | "valueOm", val: string) {
    setItems((prev) => prev && prev.map((it) => (it.key === key ? { ...it, [field]: val } : it)));
    setSaved(false);
  }

  async function handleSave() {
    if (!items) return;
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!items) return <p style={{ color: "#8a93a3", fontSize: 14 }}>Loading…</p>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Site Text</h1>
      <p style={{ fontSize: 13.5, color: "#8a93a3", marginBottom: 20 }}>Edit key homepage copy in all three languages. Changes apply immediately.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 640 }}>
        {items.map((it) => (
          <div key={it.key} style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{LABELS[it.key] || it.key}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={labelStyle}>
                English
                <textarea rows={2} value={it.valueEn} onChange={(e) => update(it.key, "valueEn", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
              </label>
              <label style={labelStyle}>
                Amharic
                <textarea rows={2} value={it.valueAm} onChange={(e) => update(it.key, "valueAm", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
              </label>
              <label style={labelStyle}>
                Oromo
                <textarea rows={2} value={it.valueOm} onChange={(e) => update(it.key, "valueOm", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "11px 18px", background: "#480823", color: "#fff", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span style={{ fontSize: 13, color: "#1a7f4b", fontWeight: 600 }}>Saved.</span>}
      </div>
    </div>
  );
}
