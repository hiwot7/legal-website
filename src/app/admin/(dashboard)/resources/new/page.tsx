import ResourceForm from "@/components/admin/ResourceForm";

export default function NewResourcePage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>New Resource</h1>
      <ResourceForm mode="create" />
    </div>
  );
}
