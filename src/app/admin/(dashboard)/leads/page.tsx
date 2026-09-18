import { prisma } from "@/lib/prisma";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";
import LeadResponseForm from "@/components/admin/LeadResponseForm";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Leads</h1>

      {leads.length === 0 ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>No contact form submissions yet.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f1f2f4" }}>
                {["Name", "Email", "Phone", "Practice Area", "Message", "Status", "Response", "Received"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#5b6472", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderTop: "1px solid #e2e6ea" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{lead.name}</td>
                  <td style={{ padding: "10px 14px" }}>{lead.email}</td>
                  <td style={{ padding: "10px 14px" }}>{lead.phone || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{lead.practiceArea || "—"}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 280 }}>{lead.message}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                  </td>
                  <td style={{ padding: "10px 14px", maxWidth: 260 }}>
                    <LeadResponseForm id={lead.id} response={lead.response} />
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "#8a93a3" }}>
                    {lead.createdAt.toLocaleDateString()}
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
