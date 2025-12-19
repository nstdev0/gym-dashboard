import PageHeader from "@/components/ui/PageHeader";
import { useParams } from "react-router-dom";
import EditUserForm from "../../components/edit-user-form";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <PageHeader
        title="Editando Usuario"
        description="Editar detalles del usuario"
        buttonProps={[
          {
            to: "/admin/dashboard/usuarios",
            text: "Regresar",
          },
        ]}
      />
      <div className="mt-8">
        <EditUserForm id={id} />
      </div>
    </div>
  );
}
