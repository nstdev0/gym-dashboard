import PageHeader from "@/components/ui/PageHeader";
import MemberDetail from "../components/member.detail";

import { useParams } from "react-router-dom";

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <PageHeader
        title="Miembro"
        description="Detalles del miembro"
        buttonProps={[
          {
            to: `/admin/dashboard/miembros/${id}/editar`,
            text: "Editar",
          },
          {
            to: "/admin/dashboard/miembros",
            text: "Regresar",
          },
        ]}
      />
      <MemberDetail id={id} />
    </div>
  );
}
