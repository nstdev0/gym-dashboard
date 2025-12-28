import PageHeader from "@/components/ui/PageHeader";
import PlanDetail from "../components/plan.detail";
import { useParams } from "react-router-dom";

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-5xl mx-auto pb-6">
      <PageHeader
        title="Detalles del Plan"
        description="Información completa del plan de suscripción"
        buttonProps={[
          {
            to: `/admin/dashboard/planes/${id}/editar`,
            text: "Editar",
          },
          {
            to: "/admin/dashboard/planes",
            text: "Regresar",
          },
        ]}
      />
      <PlanDetail id={id} />
    </div>
  );
}
