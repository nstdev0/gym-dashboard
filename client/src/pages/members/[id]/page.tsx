import PageHeader from "@/components/ui/PageHeader";
import MemberDetail from "../components/member.detail";

import { useParams } from "react-router-dom";

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div>
      <PageHeader
        title="Miembro"
        description="Detalles del miembro"
        buttonProps={{
          to: "/admin/dashboard/miembros",
          text: "Regresar",
        }}
      />
      <MemberDetail id={id} />
    </div>
  );
}
