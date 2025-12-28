import PageHeader from "@/components/ui/PageHeader";
import EditMembershipForm from "../../components/edit-membership-form";
import { useParams } from "react-router-dom";

export default function EditMembershipPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Editar Membresía"
        description="Actualiza la información de la suscripción seleccionada"
        buttonProps={[
          {
            to: "/admin/dashboard/membresias",
            text: "Regresar",
          },
        ]}
      />
      <EditMembershipForm id={id} />
    </div>
  );
}
