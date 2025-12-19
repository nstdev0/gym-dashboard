import PageHeader from "@/components/ui/PageHeader";
import MembershipsListingPage from "./components/memberships.listing";

export default function MembershipsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Membresías"
        description="Gestiona las membresías de los suscriptores"
        buttonProps={[
          {
            to: "/admin/dashboard/membresias/nuevo", // Assuming route existence or future implementation
            text: "Nueva membresía",
          },
        ]}
      />
      <MembershipsListingPage />
    </div>
  );
}
