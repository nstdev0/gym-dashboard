import PageHeader from "@/components/ui/PageHeader";

import { useParams } from "react-router-dom";
import EditMemberForm from "../../components/edit-member-form";

import { getMember } from "@/features/members/requests";
import { useQuery } from "@tanstack/react-query";
import { EditMemberSkeleton } from "../../components/edit-member-skeleton";

export default function NewMemberPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getMember({ id: id! }),
    queryKey: ["member", id],
    enabled: !!id,
  });

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-3xl mx-auto pb-6">
      <PageHeader
        title="Editando"
        description="Editar detalles del miembro"
        buttonProps={[
          {
            to: "/admin/dashboard/miembros",
            text: "Regresar",
          },
        ]}
      />
      {isLoading ? (
        <EditMemberSkeleton />
      ) : (
        <EditMemberForm member={data} isError={isError} />
      )}
    </div>
  );
}
