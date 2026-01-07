import PageHeader from "@/components/ui/PageHeader";
import EditPlanForm from "../../components/edit-plan-form";
import { EditPlanSkeleton } from "../../components/edit-plan-skeleton";
import { useParams } from "react-router-dom";

import { getPlan } from "@/features/plans/requests";
import { useQuery } from "@tanstack/react-query";

export default function EditPlanPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getPlan(id!),
    queryKey: ["plan", id],
    enabled: !!id,
  });

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Editar Plan"
        description="Modifica la información del plan seleccionado"
        buttonProps={[
          {
            to: "/admin/dashboard/planes",
            text: "Regresar",
          },
        ]}
      />
      {isLoading ? (
        <EditPlanSkeleton />
      ) : (
        <EditPlanForm plan={data} isError={isError} />
      )}
    </div>
  );
}
