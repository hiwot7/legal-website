"use client";

import { useState, type FormEvent } from "react";
import type { Translation } from "@/lib/i18n";
import { firm } from "@/lib/firm";
import { IconCheck, IconMapPin } from "./Icons";
import Reveal from "./Reveal";

const inputStyle: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  border: "1px solid var(--border-strong)",
  borderRadius: 2,
  padding: "12px 14px",
  fontSize: 14,
  background: "var(--bg)",
  color: "var(--ink)",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" };

export default function Contact({ t }: { t: Translation }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Couldn't send your message. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.contactEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14 }}>{t.contactTitle}</h2>
          <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 520, fontSize: 15 }}>{t.contactSub}</p>
        </Reveal>

        <Reveal>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, marginTop: 34 }}>
          <div className="card" style={{ padding: 28 }}>
            {status === "success" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", color: "var(--accent)" }}>
                <IconCheck size={28} />
                <p style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{t.formSuccessTitle}</p>
                <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{t.formSuccessBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <label style={labelStyle}>
                    {t.formName}
                    <input name="name" required style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    {t.formEmail}
                    <input name="email" type="email" required style={inputStyle} />
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <label style={labelStyle}>
                    {t.formPhone}
                    <input name="phone" type="tel" style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    {t.formArea}
                    <select name="practiceArea" style={inputStyle}>
                      <option value="">{t.formAreaSelect}</option>
                      {t.areas.map((a) => (
                        <option key={a.t} value={a.t}>
                          {a.t}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label style={labelStyle}>
                  {t.formMessage}
                  <textarea name="message" required rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                </label>

                {status === "error" && <p style={{ fontSize: 13, color: "var(--accent)" }}>{errorMsg}</p>}

                <button type="submit" className="btn btn-primary" disabled={status === "submitting"} style={{ alignSelf: "flex-start" }}>
                  {status === "submitting" ? t.formSubmitting : t.formSubmit}
                </button>
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{t.formDisclaimer}</p>
              </form>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <IconMapPin size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
              <span style={{ color: "var(--ink-soft)" }}>{firm.address}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>Phone</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{firm.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>Email</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{firm.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>Hours</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{firm.hours}</div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
