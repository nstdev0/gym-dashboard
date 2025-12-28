import PageHeader from "@/components/ui/PageHeader";

import { useParams } from "react-router-dom";
import EditMemberForm from "../../components/edit-member-form";

export default function NewMemberPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-3xl mx-auto pb-6">
      <PageHeader
        title="Editando"
        description="Editar detalles del miembro"
        buttonProps={[
          {
            to: "/admin/dashboard/miembros",
            text: "Regresar",
          },
        ]}
      />
      <EditMemberForm id={id} />
    </div>
  );
}
