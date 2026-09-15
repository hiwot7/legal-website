import SiteImageUploader from "@/components/admin/SiteImageUploader";

const SLOTS = [
  { key: "hero-1", label: "Homepage hero — slide 1" },
  { key: "hero-2", label: "Homepage hero — slide 2" },
  { key: "hero-3", label: "Homepage hero — slide 3" },
];

export default function SiteImagesPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Site Images</h1>
      <p style={{ fontSize: 13.5, color: "#8a93a3", marginBottom: 20 }}>Replace the images used in fixed slots across the public site.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560 }}>
        {SLOTS.map((s) => (
          <SiteImageUploader key={s.key} imageKey={s.key} label={s.label} />
        ))}
      </div>
    </div>
  );
}
