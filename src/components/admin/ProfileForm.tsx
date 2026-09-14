"use client";

import { useState, type FormEvent } from "react";

const inputStyle: React.CSSProperties = { marginTop: 6, width: "100%", padding: "10px 12px", border: "1px solid #cbd2da", borderRadius: 2, fontSize: 14 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#5b6472" };

type Existing = { title: string; bio: string; visible: boolean; hasPhoto: boolean; id: string } | null;

export default function ProfileForm({ existing }: { existing: Existing }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [bio, setBio] = useState(existing?.bio || "");
  const [visible, setVisible] = useState(existing?.visible ?? true);
  const [preview, setPreview] = useState<string | null>(existing?.hasPhoto ? `/api/team/${existing.id}/photo` : null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function handleFile(f: File | null) {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const form = new FormData();
    form.set("title", title);
    form.set("bio", bio);
    form.set("visible", String(visible));
    if (file) form.set("photo", file);

    const res = await fetch("/api/admin/profile", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#f1f2f4",
            border: "1px solid #e2e6ea",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Profile preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 12, color: "#8a93a3" }}>No photo</span>
          )}
        </div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#480823", cursor: "pointer" }}>
          {preview ? "Change photo" : "Upload photo"}
          <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
        </label>
      </div>

      <label style={labelStyle}>
        Title / role
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Associate, Litigation" style={inputStyle} />
      </label>

      <label style={labelStyle}>
        What you represent
        <textarea
          required
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short bio: your focus areas, experience, what clients can expect working with you."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
        Show on public site
      </label>

      {status === "error" && <p style={{ fontSize: 13, color: "#480823" }}>{error}</p>}
      {status === "saved" && <p style={{ fontSize: 13, color: "#166a3f" }}>Saved.</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        style={{ alignSelf: "flex-start", padding: "11px 18px", background: "#480823", color: "#fff", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
      >
        {status === "saving" ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
