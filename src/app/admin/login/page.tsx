"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { firm } from "@/lib/firm";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg, #f8f9fa)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          maxWidth: "90vw",
          background: "#fff",
          border: "1px solid #e2e6ea",
          borderRadius: 4,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#0f172a" }}>{firm.name}</h1>
          <p style={{ fontSize: 13, color: "#5b6472", marginTop: 4 }}>Admin sign in</p>
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#5b6472" }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: 6, width: "100%", padding: "10px 12px", border: "1px solid #cbd2da", borderRadius: 2, fontSize: 14 }}
          />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#5b6472" }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: 6, width: "100%", padding: "10px 12px", border: "1px solid #cbd2da", borderRadius: 2, fontSize: 14 }}
          />
        </label>

        {error && <p style={{ fontSize: 13, color: "#7a0f14" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            padding: "12px 16px",
            background: "#7a0f14",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
