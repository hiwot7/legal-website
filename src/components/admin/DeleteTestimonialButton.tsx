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
    <button onClick={handleDelete} disabled={busy} className="admin-action admin-action-danger">
      Delete
    </button>
  );
}
