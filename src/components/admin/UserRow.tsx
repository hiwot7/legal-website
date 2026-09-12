"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserRow({
  id,
  name,
  email,
  role,
  createdAt,
  isSelf,
}: {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleRole() {
    const nextRole = role === "SUPERADMIN" ? "ADMIN" : "SUPERADMIN";
    if (!confirm(`Change ${email} to ${nextRole}?`)) return;
    setBusy(true);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Remove ${email}'s admin access? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <tr style={{ borderTop: "1px solid #e2e6ea" }}>
      <td style={{ padding: "10px 14px", fontWeight: 600 }}>{name}</td>
      <td style={{ padding: "10px 14px" }}>{email}</td>
      <td style={{ padding: "10px 14px" }}>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".04em",
            color: role === "SUPERADMIN" ? "#7a0f14" : "#5b6472",
          }}
        >
          {role}
        </span>
      </td>
      <td style={{ padding: "10px 14px", color: "#8a93a3", whiteSpace: "nowrap" }}>{createdAt}</td>
      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
        {!isSelf && (
          <>
            <button
              onClick={toggleRole}
              disabled={busy}
              style={{ fontSize: 12.5, fontWeight: 600, color: "#5b6472", background: "none", border: "none", cursor: "pointer", marginRight: 14 }}
            >
              Make {role === "SUPERADMIN" ? "Admin" : "Superadmin"}
            </button>
            <button
              onClick={remove}
              disabled={busy}
              style={{ fontSize: 12.5, fontWeight: 600, color: "#7a0f14", background: "none", border: "none", cursor: "pointer" }}
            >
              Remove
            </button>
          </>
        )}
        {isSelf && <span style={{ fontSize: 12, color: "#8a93a3" }}>(you)</span>}
      </td>
    </tr>
  );
}
