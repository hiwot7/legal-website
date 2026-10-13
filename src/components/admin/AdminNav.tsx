"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { IconMenu, IconX } from "@/components/site/Icons";

const LINKS = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/site-text", label: "Site Text" },
  { href: "/admin/site-images", label: "Site Images" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/cases", label: "Cases" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/qr-code", label: "QR Code" },
  { href: "/admin/profile", label: "My Profile" },
  { href: "/admin/change-password", label: "Change Password" },
];

export default function AdminNav({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allLinks = role === "SUPERADMIN" ? [...LINKS, { href: "/admin/users", label: "Users" }] : LINKS;

  return (
    <header style={{ borderBottom: "1px solid #380619", background: "#480823" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span className="admin-name-role" style={{ fontSize: 13, color: "#ffffff", opacity: 0.8, marginRight: 8, whiteSpace: "nowrap" }}>
              {name} · {role === "SUPERADMIN" ? "Superadmin" : "Admin"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#c9a227",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "9px 10px",
                minHeight: 36,
              }}
            >
              Sign out
            </button>
            <button
              className="admin-hamburger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "1px solid rgba(255,255,255,.3)",
                borderRadius: 4,
                color: "#ffffff",
                width: 36,
                height: 36,
                cursor: "pointer",
              }}
            >
              {open ? <IconX size={18} /> : <IconMenu size={18} />}
            </button>
          </div>
        </div>
        <nav className={`admin-nav-links${open ? " open" : ""}`} style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {allLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                color: pathname?.startsWith(l.href) ? "#c9a227" : "#ffffff",
                opacity: pathname?.startsWith(l.href) ? 1 : 0.8,
                whiteSpace: "nowrap",
                padding: "8px 2px",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
