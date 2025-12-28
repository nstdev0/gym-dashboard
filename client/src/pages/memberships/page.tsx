import PageHeader from "@/components/ui/PageHeader";
import MembershipsListingPage from "./components/memberships.listing";

export default function MembershipsPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <PageHeader
        title="Membresías"
        description="Visualiza y gestiona las membresías de los usuarios"
        buttonProps={[
          {
            to: "/admin/dashboard/membresias/nuevo",
            text: "Nueva membresía",
          },
        ]}
      />
      <MembershipsListingPage />
    </div>
  );
}
