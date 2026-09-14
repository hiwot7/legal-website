"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCaseButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this case record? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/admin/cases/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
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
