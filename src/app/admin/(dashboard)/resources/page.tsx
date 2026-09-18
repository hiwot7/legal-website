import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteResourceButton from "@/components/admin/DeleteResourceButton";

const STATUS_COLOR: Record<string, string> = { DRAFT: "#8a93a3", IN_REVIEW: "#c9a227", PUBLISHED: "#1a7f4b" };
const STATUS_LABEL: Record<string, string> = { DRAFT: "Draft", IN_REVIEW: "In Review", PUBLISHED: "Published" };

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Resources</h1>
        <Link
          href="/admin/resources/new"
          style={{ fontSize: 13.5, fontWeight: 600, background: "#480823", color: "#fff", padding: "9px 16px", borderRadius: 2, textDecoration: "none" }}
        >
          + New Resource
        </Link>
      </div>
      <p style={{ fontSize: 13.5, color: "#8a93a3", marginBottom: 20 }}>
        Upload PDFs, images, or Word documents, or link to an external page. Published resources appear on the public Resources page.
      </p>

      {resources.length === 0 ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>No resources yet.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f1f2f4" }}>
                {["Title", "Type", "Status", "Added", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#5b6472", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #e2e6ea" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{r.title}</td>
                  <td style={{ padding: "10px 14px" }}>{r.kind === "LINK" ? "Link" : r.fileName || "File"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: STATUS_COLOR[r.status], fontWeight: 700 }}>{STATUS_LABEL[r.status]}</span>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "#8a93a3" }}>{r.createdAt.toLocaleDateString()}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <Link href={`/admin/resources/${r.id}`} style={{ fontSize: 12.5, fontWeight: 600, color: "#5b6472", marginRight: 14 }}>
                      Edit
                    </Link>
                    <DeleteResourceButton id={r.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
