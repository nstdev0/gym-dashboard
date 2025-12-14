import PageHeader from "@/components/ui/PageHeader";
import MembersListingPage from "./components/members.listing";

export default function MembersPage() {
  return (
    <div>
      <PageHeader
        title="Miembros"
        description="Lista de los miembros de tu gimnasio"
        buttonProps={{
          to: "/admin/dashboard/miembros/nuevo",
          text: "Nuevo miembro",
        }}
      />
      <MembersListingPage />
    </div>
  );
}
