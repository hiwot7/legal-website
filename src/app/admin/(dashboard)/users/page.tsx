import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UserRow from "@/components/admin/UserRow";

export default async function UsersPage() {
  const session = await auth();
  if (session?.user.role !== "SUPERADMIN") {
    redirect("/admin/leads");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Admin Users</h1>
        <Link
          href="/admin/users/new"
          style={{ fontSize: 13.5, fontWeight: 600, background: "#480823", color: "#fff", padding: "9px 16px", borderRadius: 2, textDecoration: "none" }}
        >
          + New Admin
        </Link>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f1f2f4" }}>
              {["Name", "Email", "Role", "Created", ""].map((h) => (
                <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#5b6472", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u.id}
                id={u.id}
                name={u.name || "—"}
                email={u.email}
                role={u.role}
                createdAt={u.createdAt.toLocaleDateString()}
                isSelf={u.id === session.user.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
