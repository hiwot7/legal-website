import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCaseButton from "@/components/admin/DeleteCaseButton";

export default async function CasesPage() {
  const cases = await prisma.caseRecord.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Cases</h1>
        <Link
          href="/admin/cases/new"
          style={{ fontSize: 13.5, fontWeight: 600, background: "#7a0f14", color: "#fff", padding: "9px 16px", borderRadius: 2, textDecoration: "none" }}
        >
          + New Case
        </Link>
      </div>

      {cases.length === 0 ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>No case records yet. Add one so the public Case Lookup tool can find it.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f1f2f4" }}>
                {["Case ID", "Client", "Phone", "Attorney", "Court", "Status", "Next Hearing", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#5b6472", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #e2e6ea" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "#7a0f14", fontFamily: "monospace" }}>{c.caseId}</td>
                  <td style={{ padding: "10px 14px" }}>{c.client}</td>
                  <td style={{ padding: "10px 14px" }}>{c.phone || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{c.attorney}</td>
                  <td style={{ padding: "10px 14px" }}>{c.court}</td>
                  <td style={{ padding: "10px 14px" }}>{c.status}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    {c.ketero ? c.ketero.toLocaleDateString("en-US", { timeZone: "UTC" }) : "—"}
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <Link href={`/admin/cases/${c.id}`} style={{ fontSize: 12.5, fontWeight: 600, color: "#5b6472", marginRight: 14 }}>
                      Edit
                    </Link>
                    <DeleteCaseButton id={c.id} />
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
