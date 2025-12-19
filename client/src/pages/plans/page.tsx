import PageHeader from "@/components/ui/PageHeader";
import PlansListingPage from "./components/plans.listing";

export default function PlansPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Planes"
        description="Gestiona los planes de suscripción disponibles"
        buttonProps={[
          {
            to: "/admin/dashboard/planes/nuevo", // Assuming route existence or future implementation
            text: "Nuevo plan",
          },
        ]}
      />
      <PlansListingPage />
    </div>
  );
}
