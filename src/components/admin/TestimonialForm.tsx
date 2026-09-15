"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type TestimonialFormValues = {
  clientName: string;
  clientRole: string;
  quote: string;
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

export default function TestimonialForm({
  mode,
  testimonialId,
  initial,
  onSaved,
}: {
  mode: "create" | "edit";
  testimonialId?: string;
  initial?: Partial<TestimonialFormValues>;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<TestimonialFormValues>({
    clientName: initial?.clientName || "",
    clientRole: initial?.clientRole || "",
    quote: initial?.quote || "",
    status: initial?.status || "DRAFT",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof TestimonialFormValues>(key: K, val: TestimonialFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = mode === "create" ? "/api/admin/testimonials" : `/api/admin/testimonials/${testimonialId}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    setSaving(false);
    if (onSaved) {
      onSaved();
    } else {
      router.push("/admin/testimonials");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 14 }}>
      <label style={labelStyle}>
        Client name
        <input required value={values.clientName} onChange={(e) => set("clientName", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Client role / company (optional)
        <input value={values.clientRole} onChange={(e) => set("clientRole", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Quote
        <textarea required rows={3} value={values.quote} onChange={(e) => set("quote", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
      </label>
      <label style={labelStyle}>
        Status
        <select value={values.status} onChange={(e) => set("status", e.target.value as TestimonialFormValues["status"])} style={inputStyle}>
          <option value="DRAFT">Draft</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </label>

      {error && <p style={{ fontSize: 13, color: "#480823" }}>{error}</p>}

      <div>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: "10px 16px", background: "#480823", color: "#fff", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}
        >
          {saving ? "Saving…" : mode === "create" ? "Add Testimonial" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
