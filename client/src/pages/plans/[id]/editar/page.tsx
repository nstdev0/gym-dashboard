import PageHeader from "@/components/ui/PageHeader";
import { useParams } from "react-router-dom";
import EditPlanForm from "../../components/edit-plan-form";

export default function EditPlanPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <PageHeader
        title="Editando Plan"
        description="Editar detalles del plan"
        buttonProps={[
          {
            to: "/admin/dashboard/planes",
            text: "Regresar",
          },
        ]}
      />
      <div className="mt-8">
        <EditPlanForm id={id} />
      </div>
    </div>
  );
}
