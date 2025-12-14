import PageHeader from "@/components/ui/PageHeader";
import NewMemberForm from "../components/new-member-form";

export default function NewMemberPage() {
  return (
    <div>
      <PageHeader
        title="Agregar un miembro"
        description="Ingresa los datos del nuevo miembro"
        buttonProps={{
          to: "/admin/dashboard/miembros",
          text: "Regresar",
        }}
      />
      <NewMemberForm />
    </div>
  );
}
