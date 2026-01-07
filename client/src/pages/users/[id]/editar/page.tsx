import PageHeader from "@/components/ui/PageHeader";
import EditUserForm from "../../components/edit-user-form";
import { EditUserSkeleton } from "../../components/edit-user-skeleton";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/features/users/requests";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getUser(id!),
    queryKey: ["user", id],
    enabled: !!id,
  });

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-4xl mx-auto pb-6">
      <PageHeader
        title="Editar Usuario"
        description="Actualiza la información del usuario"
        buttonProps={[
          {
            to: "/admin/dashboard/usuarios",
            text: "Regresar",
          },
        ]}
      />
      {isLoading ? (
        <EditUserSkeleton />
      ) : (
        <EditUserForm user={data} isError={isError} />
      )}
    </div>
  );
}
