"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconDownload, IconExternalLink } from "./Icons";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  kind: "FILE" | "LINK";
  fileName: string | null;
  externalUrl: string | null;
};

export default function ResourcesList({ t }: { t: Translation }) {
  const [items, setItems] = useState<Resource[] | null>(null);

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
      {items === null ? (
        <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>…</p>
      ) : items.length === 0 ? (
        <p style={{ color: "var(--ink-faint)", fontSize: 14 }}>{t.resourcesEmpty}</p>
      ) : (
        items.map((r) => (
          <a
            key={r.id}
            href={r.kind === "LINK" ? r.externalUrl! : `/api/resource-files/${r.id}`}
            target={r.kind === "LINK" ? "_blank" : undefined}
            rel={r.kind === "LINK" ? "noopener noreferrer" : undefined}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 20px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--accent-tint)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {r.kind === "LINK" ? <IconExternalLink size={18} /> : <IconDownload size={18} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{r.title}</div>
              {r.description && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>{r.description}</p>}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap" }}>
              {r.kind === "LINK" ? t.resourcesOpenLink : t.resourcesDownload}
            </span>
          </a>
        ))
      )}
    </div>
  );
}
