import PageHeader from "@/components/ui/PageHeader";
import EditUserForm from "../../components/edit-user-form";
import { useParams } from "react-router-dom";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Editar Usuario"
        description="Actualiza la información del usuario"
        buttonProps={[
          {
            to: "/admin/dashboard/usuarios",
            text: "Regresar",
          },
        ]}
      />
      <EditUserForm />
    </div>
  );
}
