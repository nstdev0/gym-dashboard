import PageHeader from "@/components/ui/PageHeader";
import NewMembershipForm from "../components/new-membership-form";

export default function NewMembershipPage() {
  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Nueva Membresía"
        description="Registra una nueva suscripción para un miembro"
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
