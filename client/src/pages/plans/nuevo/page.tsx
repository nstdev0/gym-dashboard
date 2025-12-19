import PageHeader from "@/components/ui/PageHeader";
import NewPlanForm from "../components/new-plan-form";

export default function NewPlanPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        title="Agregar un plan"
        description="Ingresa los datos del nuevo plan"
        buttonProps={[
          {
            to: "/admin/dashboard/planes",
            text: "Regresar",
          },
        ]}
      />
      <NewPlanForm />
    </div>
  );
}
