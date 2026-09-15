"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const LINKS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/profile", label: "My Profile" },
  { href: "/admin/change-password", label: "Change Password" },
];

export default function AdminNav({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();

  return (
    <header style={{ borderBottom: "1px solid #380619", background: "#480823" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#241c07",
              background: "#c9a227",
              padding: "4px 10px",
              borderRadius: 3,
              letterSpacing: ".02em",
            }}
          >
            Admin
          </span>
          <nav style={{ display: "flex", gap: 20 }}>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: pathname?.startsWith(l.href) ? "#c9a227" : "#ffffff",
                  opacity: pathname?.startsWith(l.href) ? 1 : 0.8,
                }}
              >
                {l.label}
              </Link>
            ))}
            {role === "SUPERADMIN" && (
              <Link
                href="/admin/users"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: pathname?.startsWith("/admin/users") ? "#c9a227" : "#ffffff",
                  opacity: pathname?.startsWith("/admin/users") ? 1 : 0.8,
                }}
              >
                Users
              </Link>
            )}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, color: "#ffffff", opacity: 0.8 }}>
            {name} · {role === "SUPERADMIN" ? "Superadmin" : "Admin"}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{ fontSize: 13, fontWeight: 600, color: "#c9a227", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
