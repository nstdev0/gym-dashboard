import PageHeader from "@/components/ui/PageHeader";
import UsersListingPage from "./components/users.listing";

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <PageHeader
        title="Usuarios"
        description="Gestiona el acceso de los administradores y staff del sistema"
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
