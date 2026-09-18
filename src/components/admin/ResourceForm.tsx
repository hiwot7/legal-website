"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type ResourceFormValues = {
  title: string;
  description: string;
  kind: "FILE" | "LINK";
  externalUrl: string;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED";
};

const inputStyle: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd2da",
  borderRadius: 2,
  fontSize: 14,
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#5b6472" };

export default function ResourceForm({
  mode,
  resourceId,
  initial,
  currentFileName,
}: {
  mode: "create" | "edit";
  resourceId?: string;
  initial?: Partial<ResourceFormValues>;
  currentFileName?: string | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ResourceFormValues>({
    title: initial?.title || "",
    description: initial?.description || "",
    kind: initial?.kind || "FILE",
    externalUrl: initial?.externalUrl || "",
    status: initial?.status || "DRAFT",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ResourceFormValues>(key: K, val: ResourceFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData();
    Object.entries(values).forEach(([k, v]) => form.set(k, v));
    if (file) form.set("file", file);

    const url = mode === "create" ? "/api/admin/resources" : `/api/admin/resources/${resourceId}`;
    const res = await fetch(url, { method: mode === "create" ? "POST" : "PATCH", body: form });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/resources");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={labelStyle}>
        Title
        <input required value={values.title} onChange={(e) => set("title", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Description (optional)
        <textarea rows={2} value={values.description} onChange={(e) => set("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
      </label>

      <label style={labelStyle}>
        Type
        <select value={values.kind} onChange={(e) => set("kind", e.target.value as ResourceFormValues["kind"])} style={inputStyle}>
          <option value="FILE">Uploaded file (PDF, image, Word document)</option>
          <option value="LINK">External link</option>
        </select>
      </label>

      {values.kind === "LINK" ? (
        <label style={labelStyle}>
          URL
          <input
            required
            type="url"
            value={values.externalUrl}
            onChange={(e) => set("externalUrl", e.target.value)}
            placeholder="https://…"
            style={inputStyle}
          />
        </label>
      ) : (
        <label style={labelStyle}>
          File {currentFileName && `(current: ${currentFileName} — uploading replaces it)`}
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ ...inputStyle, padding: "8px 0" }}
          />
        </label>
      )}

      <label style={labelStyle}>
        Status
        <select value={values.status} onChange={(e) => set("status", e.target.value as ResourceFormValues["status"])} style={inputStyle}>
          <option value="DRAFT">Draft</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </label>

      {error && <p style={{ fontSize: 13, color: "#480823" }}>{error}</p>}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: "11px 18px", background: "#480823", color: "#fff", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          {saving ? "Saving…" : mode === "create" ? "Create" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/resources")}
          style={{ padding: "11px 18px", background: "transparent", color: "#5b6472", border: "1px solid #cbd2da", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
