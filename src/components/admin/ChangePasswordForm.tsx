"use client";

import { useState, type FormEvent } from "react";

const inputStyle: React.CSSProperties = { marginTop: 6, width: "100%", padding: "10px 12px", border: "1px solid #cbd2da", borderRadius: 2, fontSize: 14 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#5b6472" };

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setStatus("error");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={labelStyle}>
        Current password
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        New password
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Confirm new password
        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
      </label>

      {status === "error" && <p style={{ fontSize: 13, color: "#480823" }}>{error}</p>}
      {status === "saved" && <p style={{ fontSize: 13, color: "#166a3f" }}>Password changed.</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        style={{
          alignSelf: "flex-start",
          padding: "11px 18px",
          background: "#480823",
          color: "#fff",
          border: "none",
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        {status === "saving" ? "Saving…" : "Change Password"}
      </button>
    </form>
  );
}
