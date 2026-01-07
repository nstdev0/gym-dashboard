import PageHeader from "@/components/ui/PageHeader";
import MemberDetail from "../components/member.detail";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/features/members/requests";

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getMember({ id }),
    queryKey: ["member", id],
  });

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-5xl mx-auto pb-6">
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
      <MemberDetail member={data} isError={isError} isLoading={isLoading} />
    </div>
  );
}
