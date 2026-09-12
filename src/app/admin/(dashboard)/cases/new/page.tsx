import CaseForm from "@/components/admin/CaseForm";

export default function NewCasePage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>New Case</h1>
      <CaseForm mode="create" />
    </div>
  );
}
