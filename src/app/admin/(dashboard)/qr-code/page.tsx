"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type Target = "home" | "tracker";

const LABELS: Record<Target, string> = {
  home: "Main website",
  tracker: "Case tracker",
};

export default function QrCodePage() {
  const [target, setTarget] = useState<Target>("home");
  const [origin, setOrigin] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? (target === "tracker" ? `${origin}/#lookup` : origin) : "";

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { width: 280, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } }, () => {
      setDataUrl(canvasRef.current?.toDataURL("image/png") || null);
    });
  }, [url]);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>QR Code</h1>
      <p style={{ fontSize: 13.5, color: "#8a93a3", marginBottom: 20 }}>
        Generate a QR code to print on business cards, flyers, or signage. It always points to the site&apos;s current address.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {(Object.keys(LABELS) as Target[]).map((key) => (
          <button
            key={key}
            onClick={() => setTarget(key)}
            style={{
              padding: "9px 16px",
              borderRadius: 2,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              border: target === key ? "1px solid #480823" : "1px solid #cbd2da",
              background: target === key ? "#480823" : "#fff",
              color: target === key ? "#fff" : "#5b6472",
            }}
          >
            {LABELS[key]}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, padding: 24, maxWidth: 360 }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
        <p style={{ fontSize: 12.5, color: "#8a93a3", marginTop: 12, wordBreak: "break-all" }}>{url}</p>
        {dataUrl && (
          <a
            href={dataUrl}
            download={`beka-law-firm-qr-${target}.png`}
            style={{
              display: "inline-block",
              marginTop: 14,
              padding: "10px 16px",
              background: "#480823",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 13.5,
              textDecoration: "none",
            }}
          >
            Download PNG
          </a>
        )}
      </div>

      {target === "tracker" && (
        <p style={{ fontSize: 12.5, color: "#8a93a3", marginTop: 14, maxWidth: 480 }}>
          This links to the &ldquo;Track My Case&rdquo; section on the homepage. Case records must be added under Cases before clients can look anything up.
        </p>
      )}
    </div>
  );
}
