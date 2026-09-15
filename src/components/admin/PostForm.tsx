"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type PostFormValues = {
  type: "ARTICLE" | "CASE_STUDY";
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
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

export default function PostForm({
  mode,
  postId,
  initial,
  hasCover,
}: {
  mode: "create" | "edit";
  postId?: string;
  initial?: Partial<PostFormValues>;
  hasCover?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PostFormValues>({
    type: initial?.type || "ARTICLE",
    title: initial?.title || "",
    slug: initial?.slug || "",
    excerpt: initial?.excerpt || "",
    body: initial?.body || "",
    metaTitle: initial?.metaTitle || "",
    metaDescription: initial?.metaDescription || "",
    status: initial?.status || "DRAFT",
  });
  const [cover, setCover] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof PostFormValues>(key: K, val: PostFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData();
    Object.entries(values).forEach(([k, v]) => form.set(k, v));
    if (cover) form.set("cover", cover);

    const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`;
    const res = await fetch(url, { method: mode === "create" ? "POST" : "PATCH", body: form });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={labelStyle}>
        Type
        <select value={values.type} onChange={(e) => set("type", e.target.value as PostFormValues["type"])} style={inputStyle}>
          <option value="ARTICLE">Article</option>
          <option value="CASE_STUDY">Case Study</option>
        </select>
      </label>
      <label style={labelStyle}>
        Title
        <input required value={values.title} onChange={(e) => set("title", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        URL slug (leave blank to auto-generate from title)
        <input value={values.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. ketero-guide-2026" style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Excerpt (shown in listing cards)
        <textarea
          required
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>
      <label style={labelStyle}>
        Body
        <textarea
          required
          rows={12}
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Write in plain paragraphs. Leave a blank line between paragraphs."
          style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace" }}
        />
      </label>
      <label style={labelStyle}>
        Cover image {hasCover && "(uploading replaces the current one)"}
        {hasCover && postId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/admin/posts/${postId}/cover`}
            alt="Current cover"
            style={{ display: "block", width: 220, aspectRatio: "16/9", objectFit: "cover", borderRadius: 2, marginTop: 8, marginBottom: 8, border: "1px solid #e2e6ea" }}
          />
        )}
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: "8px 0" }} />
      </label>

      <div style={{ borderTop: "1px solid #e2e6ea", paddingTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>SEO</div>
        <label style={labelStyle}>
          Meta title (optional — falls back to the title)
          <input value={values.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Meta description (optional — falls back to the excerpt)
          <textarea rows={2} value={values.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
        </label>
      </div>

      <label style={labelStyle}>
        Status
        <select value={values.status} onChange={(e) => set("status", e.target.value as PostFormValues["status"])} style={inputStyle}>
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
          onClick={() => router.push("/admin/posts")}
          style={{ padding: "11px 18px", background: "transparent", color: "#5b6472", border: "1px solid #cbd2da", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
