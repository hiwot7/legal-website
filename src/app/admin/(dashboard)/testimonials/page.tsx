"use client";

import { useEffect, useState } from "react";
import TestimonialForm, { type TestimonialFormValues } from "@/components/admin/TestimonialForm";
import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";

type Testimonial = { id: string; clientName: string; clientRole: string | null; quote: string; status: string };

const STATUS_COLOR: Record<string, string> = { DRAFT: "#8a93a3", IN_REVIEW: "#c9a227", PUBLISHED: "#1a7f4b" };
const STATUS_LABEL: Record<string, string> = { DRAFT: "Draft", IN_REVIEW: "In Review", PUBLISHED: "Published" };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  function load() {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then(setItems);
  }

  useEffect(load, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Testimonials</h1>
        <button
          onClick={() => setShowNew((s) => !s)}
          style={{ fontSize: 13.5, fontWeight: 600, background: "#480823", color: "#fff", padding: "9px 16px", border: "none", borderRadius: 2, cursor: "pointer" }}
        >
          {showNew ? "Cancel" : "+ New Testimonial"}
        </button>
      </div>

      {showNew && (
        <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, padding: 20, marginBottom: 24 }}>
          <TestimonialForm
            mode="create"
            onSaved={() => {
              setShowNew(false);
              load();
            }}
          />
        </div>
      )}

      {items === null ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>No testimonials yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((it) =>
            editingId === it.id ? (
              <div key={it.id} style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, padding: 20 }}>
                <TestimonialForm
                  mode="edit"
                  testimonialId={it.id}
                  initial={{ clientName: it.clientName, clientRole: it.clientRole || "", quote: it.quote, status: it.status as TestimonialFormValues["status"] }}
                  onSaved={() => {
                    setEditingId(null);
                    load();
                  }}
                />
              </div>
            ) : (
              <div key={it.id} style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {it.clientName} {it.clientRole && <span style={{ fontWeight: 400, color: "#8a93a3" }}>— {it.clientRole}</span>}
                    </div>
                    <p style={{ fontSize: 13.5, color: "#5b6472", marginTop: 6, lineHeight: 1.5 }}>&ldquo;{it.quote}&rdquo;</p>
                  </div>
                  <span style={{ color: STATUS_COLOR[it.status], fontWeight: 700, fontSize: 12.5, whiteSpace: "nowrap" }}>{STATUS_LABEL[it.status]}</span>
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 14 }}>
                  <button
                    onClick={() => setEditingId(it.id)}
                    style={{ fontSize: 12.5, fontWeight: 600, color: "#5b6472", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Edit
                  </button>
                  <DeleteTestimonialButton id={it.id} onDeleted={load} />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
