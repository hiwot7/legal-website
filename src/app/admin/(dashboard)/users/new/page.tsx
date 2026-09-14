"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputStyle: React.CSSProperties = { marginTop: 6, width: "100%", padding: "10px 12px", border: "1px solid #cbd2da", borderRadius: 2, fontSize: 14 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#5b6472" };

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setSaving(false);
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>New Admin User</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={labelStyle}>
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Temporary password
          <input required type="text" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="ADMIN">Admin</option>
            <option value="SUPERADMIN">Superadmin</option>
          </select>
        </label>

        {error && <p style={{ fontSize: 13, color: "#480823" }}>{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "11px 18px", background: "#480823", color: "#fff", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            {saving ? "Creating…" : "Create User"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            style={{ padding: "11px 18px", background: "transparent", color: "#5b6472", border: "1px solid #cbd2da", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#8a93a3" }}>
          Share this temporary password with the new admin directly and ask them to change it after their first sign-in.
        </p>
      </form>
    </div>
  );
}
