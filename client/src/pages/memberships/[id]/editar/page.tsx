import PageHeader from "@/components/ui/PageHeader";
import { useParams } from "react-router-dom";
import EditMembershipForm from "../../components/edit-membership-form";

export default function EditMembershipPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <PageHeader
        title="Editando Membresia"
        description="Editar detalles de la membresia"
        buttonProps={[
          {
            to: "/admin/dashboard/membresias",
            text: "Regresar",
          },
        ]}
      />
      <div className="mt-8">
        <EditMembershipForm id={id} />
      </div>
    </div>
  );
}
