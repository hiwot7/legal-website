import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { title: true, description: true, kind: true, externalUrl: true, status: true, fileName: true },
  });

  if (!resource) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>Edit Resource</h1>
      <ResourceForm
        mode="edit"
        resourceId={id}
        currentFileName={resource.fileName}
        initial={{
          title: resource.title,
          description: resource.description || "",
          kind: resource.kind,
          externalUrl: resource.externalUrl || "",
          status: resource.status,
        }}
      />
    </div>
  );
}
