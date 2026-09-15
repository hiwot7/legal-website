import { prisma } from "@/lib/prisma";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Subscribers</h1>

      {subscribers.length === 0 ? (
        <p style={{ color: "#8a93a3", fontSize: 14 }}>No one has signed up yet.</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e6ea", borderRadius: 2, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f1f2f4" }}>
                {["Name", "Email", "Signed up"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#5b6472", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid #e2e6ea" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: "10px 14px" }}>{s.email}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "#8a93a3" }}>
                    {s.createdAt.toLocaleDateString()}
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
