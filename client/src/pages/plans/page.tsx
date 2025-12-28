import PageHeader from "@/components/ui/PageHeader";
import PlansListingPage from "./components/plans.listing";

export default function PlansPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <PageHeader
        title="Planes"
        description="Gestiona los planes de suscripción de tu gimnasio"
        buttonProps={[
          {
            to: "/admin/dashboard/planes/nuevo",
            text: "Nuevo plan",
          },
        ]}
      />
      <PlansListingPage />
    </div>
  );
}
