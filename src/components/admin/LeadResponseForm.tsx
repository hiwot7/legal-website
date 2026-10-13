"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LeadResponseForm({ id, response }: { id: string; response: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(response || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: value }),
    });
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <div>
        {response && <p style={{ fontSize: 12.5, color: "#5b6472", marginBottom: 6, maxWidth: 260 }}>{response}</p>}
        <button onClick={() => setOpen(true)} className="admin-action">
          {response ? "Edit response" : "Respond"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minWidth: 220 }}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="Write a response the client will see…"
        style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd2da", borderRadius: 2, fontSize: 12.5, fontFamily: "inherit", resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button
          onClick={save}
          disabled={saving}
          className="admin-action"
          style={{ background: "#480823", color: "#fff", borderColor: "#480823" }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setValue(response || "");
          }}
          className="admin-action"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
