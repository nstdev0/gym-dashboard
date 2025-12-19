import PageHeader from "@/components/ui/PageHeader";
import NewUserForm from "../components/new-user-form";

export default function NewUserPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        title="Agregar un usuario"
        description="Ingresa los datos del nuevo usuario"
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
