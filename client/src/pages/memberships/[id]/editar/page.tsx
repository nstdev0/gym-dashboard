import PageHeader from "@/components/ui/PageHeader";
import EditMembershipForm from "../../components/edit-membership-form";
import { useParams } from "react-router-dom";

import { getMembership } from "@/features/memberships/requests";
import { useQuery } from "@tanstack/react-query";
import { EditMembershipSkeleton } from "../../components/edit-membership-skeleton";

export default function EditMembershipPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getMembership({ id: id! }),
    queryKey: ["membership", id],
    enabled: !!id,
  });

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
      {isLoading ? (
        <EditMembershipSkeleton />
      ) : (
        <EditMembershipForm membership={data} isError={isError} />
      )}
    </div>
  );
}
