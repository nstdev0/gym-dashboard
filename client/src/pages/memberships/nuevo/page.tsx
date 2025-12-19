import PageHeader from "@/components/ui/PageHeader";
import NewMembershipForm from "../components/new-membership-form";

export default function NewMembershipPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        title="Agregar una membresía"
        description="Ingresa los datos de la nueva membresía"
        buttonProps={[
          {
            to: "/admin/dashboard/membresias",
            text: "Regresar",
          },
        ]}
      />
      <NewMembershipForm />
    </div>
  );
}
