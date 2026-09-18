import Link from "next/link";
import { T } from "@/lib/i18n";
import ResourcesList from "@/components/site/ResourcesList";

const t = T.en;

export const metadata = {
  title: "Resources — Beka Law Firm",
  description: "Guides, forms, and downloadable resources from Beka Law Firm.",
};

export default function ResourcesPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="container" style={{ padding: "56px 24px 96px", maxWidth: 800 }}>
        <Link href="/" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
          ← Back to home
        </Link>

        <div className="eyebrow" style={{ marginTop: 24 }}>
          {t.resourcesEyebrow}
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, marginTop: 10, marginBottom: 32 }}>
          {t.resourcesTitle}
        </h1>

        <ResourcesList t={t} />
      </div>
    </div>
  );
}
