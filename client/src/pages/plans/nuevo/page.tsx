import PageHeader from "@/components/ui/PageHeader";
import NewPlanForm from "../components/new-plan-form";

export default function NewPlanPage() {
  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Crear Plan"
        description="Agrega un nuevo plan de suscripción al sistema"
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
