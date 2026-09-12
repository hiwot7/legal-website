"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type CaseFormValues = {
  caseId: string;
  client: string;
  phone: string;
  attorney: string;
  court: string;
  status: string;
  ketero: string;
};

const inputStyle: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd2da",
  borderRadius: 2,
  fontSize: 14,
};
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#5b6472" };

export default function CaseForm({
  mode,
  caseId,
  initial,
}: {
  mode: "create" | "edit";
  caseId?: string;
  initial?: Partial<CaseFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CaseFormValues>({
    caseId: initial?.caseId || "",
    client: initial?.client || "",
    phone: initial?.phone || "",
    attorney: initial?.attorney || "",
    court: initial?.court || "",
    status: initial?.status || "",
    ketero: initial?.ketero || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CaseFormValues>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = mode === "create" ? "/api/admin/cases" : `/api/admin/cases/${caseId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/cases");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={labelStyle}>
        Case ID
        <input required value={values.caseId} onChange={(e) => set("caseId", e.target.value)} placeholder="CASE-2026-89" style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Client name
        <input required value={values.client} onChange={(e) => set("client", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Client phone (used for lookup, optional)
        <input value={values.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Assigned attorney
        <input required value={values.attorney} onChange={(e) => set("attorney", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Court
        <input required value={values.court} onChange={(e) => set("court", e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Status
        <input required value={values.status} onChange={(e) => set("status", e.target.value)} placeholder="e.g. Under Review — Regional High Court" style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Next hearing (Ketero) date
        <input type="date" value={values.ketero} onChange={(e) => set("ketero", e.target.value)} style={inputStyle} />
      </label>

      {error && <p style={{ fontSize: 13, color: "#7a0f14" }}>{error}</p>}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          style={{ padding: "11px 18px", background: "#7a0f14", color: "#fff", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          {saving ? "Saving…" : mode === "create" ? "Create Case" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/cases")}
          style={{ padding: "11px 18px", background: "transparent", color: "#5b6472", border: "1px solid #cbd2da", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
