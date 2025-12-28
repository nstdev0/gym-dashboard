import PageHeader from "@/components/ui/PageHeader";
import EditPlanForm from "../../components/edit-plan-form";
import { useParams } from "react-router-dom";

export default function EditPlanPage() {
  const { id } = useParams<{ id: string }>();
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
      <EditPlanForm />
    </div>
  );
}
