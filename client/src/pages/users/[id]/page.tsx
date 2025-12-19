import PageHeader from "@/components/ui/PageHeader";
import UserDetail from "../components/user.detail";

import { useParams } from "react-router-dom";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <PageHeader
        title="Usuario"
        description="Detalles del usuario"
        buttonProps={[
        //   {
        //     to: `/admin/dashboard/usuarios/${id}/editar`,
        //     text: "Editar",
        //   },
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
