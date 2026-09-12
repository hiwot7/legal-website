import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CaseForm from "@/components/admin/CaseForm";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.caseRecord.findUnique({ where: { id } });
  if (!record) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Edit Case</h1>
      <CaseForm
        mode="edit"
        caseId={record.id}
        initial={{
          caseId: record.caseId,
          client: record.client,
          phone: record.phone || "",
          attorney: record.attorney,
          court: record.court,
          status: record.status,
          ketero: record.ketero ? record.ketero.toISOString().slice(0, 10) : "",
        }}
      />
    </div>
  );
}
