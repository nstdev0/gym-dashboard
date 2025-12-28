import PageHeader from "@/components/ui/PageHeader";
import NewUserForm from "../components/new-user-form";

export default function NewUserPage() {
  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Crear Usuario"
        description="Agrega un nuevo usuario con acceso al dashboard"
        buttonProps={[
          {
            to: "/admin/dashboard/usuarios",
            text: "Regresar",
          },
        ]}
      />
      <NewUserForm />
    </div>
  );
}
