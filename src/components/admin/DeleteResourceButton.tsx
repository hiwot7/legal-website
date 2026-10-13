"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteResourceButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    setBusy(true);
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={busy} className="admin-action admin-action-danger">
      Delete
    </button>
  );
}
