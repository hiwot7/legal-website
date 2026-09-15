"use client";

import { useState } from "react";

export default function DeleteTestimonialButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setBusy(false);
    onDeleted();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      style={{ fontSize: 12.5, fontWeight: 600, color: "#480823", background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      Delete
    </button>
  );
}
