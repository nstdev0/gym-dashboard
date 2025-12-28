import PageHeader from "@/components/ui/PageHeader";
import UserDetail from "../components/user.detail";
import { useParams } from "react-router-dom";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-5xl mx-auto pb-6">
      <PageHeader
        title="Detalles del Usuario"
        description="Información de la cuenta de usuario"
        buttonProps={[
          {
            to: `/admin/dashboard/usuarios/${id}/editar`,
            text: "Editar",
          },
          {
            to: "/admin/dashboard/usuarios",
            text: "Regresar",
          },
        ]}
      />
      <UserDetail id={id} />
    </div>
  );
}
