"use client";

import { useState } from "react";

export default function SiteImageUploader({ imageKey, label }: { imageKey: string; label: string }) {
  const [preview, setPreview] = useState(`/api/site-images/${imageKey}?t=${Date.now()}`);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setSaving(true);
    setError(null);

    const form = new FormData();
    form.set("image", file);
    const res = await fetch(`/api/admin/site-images/${imageKey}`, { method: "POST", body: form });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Upload failed.");
      setSaving(false);
      return;
    }

    setPreview(`/api/site-images/${imageKey}?t=${Date.now()}`);
    setSaving(false);
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 140, height: 90, overflow: "hidden", borderRadius: 2, background: "#f1f2f4", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{label}</div>
        <input type="file" accept="image/*" disabled={saving} onChange={(e) => handleFile(e.target.files?.[0] || null)} style={{ fontSize: 13 }} />
        {saving && <p style={{ fontSize: 12.5, color: "#8a93a3", marginTop: 6 }}>Uploading…</p>}
        {error && <p style={{ fontSize: 12.5, color: "#480823", marginTop: 6 }}>{error}</p>}
        <p style={{ fontSize: 12, color: "#8a93a3", marginTop: 6 }}>May take a few minutes to update on the live site due to caching.</p>
      </div>
    </div>
  );
}
