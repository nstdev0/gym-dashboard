import PageHeader from "@/components/ui/PageHeader";
import UsersListingPage from "./components/users.listing";

export default function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios y permisos del sistema"
        buttonProps={[
          {
            to: "/admin/dashboard/usuarios/nuevo",
            text: "Nuevo usuario",
          },
        ]}
      />
      <UsersListingPage />
    </div>
  );
}
