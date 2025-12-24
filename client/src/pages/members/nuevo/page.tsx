import PageHeader from "@/components/ui/PageHeader";
import NewMemberForm from "../components/new-member-form";

export default function NewMemberPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        title="Agregar un miembro"
        description="Ingresa los datos del nuevo miembro"
        buttonProps={[
          {
            to: "/admin/dashboard/miembros",
            text: "Regresar",
          },
        ]}
      />
      <NewMemberForm />
    </div>
  );
}
