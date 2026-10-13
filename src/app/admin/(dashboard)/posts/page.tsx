import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "@/components/admin/DeletePostButton";

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "#8a93a3",
  IN_REVIEW: "#c9a227",
  PUBLISHED: "#1a7f4b",
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In Review",
  PUBLISHED: "Published",
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Articles &amp; Case Studies</h1>
        <Link
          href="/admin/posts/new"
          style={{ fontSize: 13.5, fontWeight: 600, background: "#480823", color: "#fff", padding: "9px 16px", borderRadius: 2, textDecoration: "none" }}
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>No posts yet. Create one — it will appear on the public site once published.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, overflow: "auto" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f1f2f4" }}>
                {["Title", "Type", "Status", "Author", "Updated", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#5b6472", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #e2e6ea" }}>
                  <td data-label="Title" style={{ padding: "10px 14px", fontWeight: 600 }}>{p.title}</td>
                  <td data-label="Type" style={{ padding: "10px 14px" }}>{p.type === "CASE_STUDY" ? "Case Study" : "Article"}</td>
                  <td data-label="Status" style={{ padding: "10px 14px" }}>
                    <span style={{ color: STATUS_COLOR[p.status], fontWeight: 700 }}>{STATUS_LABEL[p.status]}</span>
                  </td>
                  <td data-label="Author" style={{ padding: "10px 14px" }}>{p.author?.name || p.author?.email || "—"}</td>
                  <td data-label="Updated" style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "#8a93a3" }}>
                    {p.createdAt.toLocaleDateString()}
                  </td>
                  <td className="admin-cell-actions" style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <Link href={`/admin/posts/${p.id}`} className="admin-action">
                      Edit
                    </Link>
                    <DeletePostButton id={p.id} />
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
