import PageHeader from "@/components/ui/PageHeader";
import MembershipDetail from "../components/membership.detail";
import { useParams } from "react-router-dom";

export default function MembershipDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid ID</div>;

  return (
    <div className="max-w-5xl mx-auto pb-6">
      <PageHeader
        title="Detalle de Membresía"
        description="Información completa de la suscripción"
        buttonProps={[
          {
            to: `/admin/dashboard/membresias/${id}/editar`,
            text: "Editar",
          },
          {
            to: "/admin/dashboard/membresias",
            text: "Regresar",
          },
        ]}
      />
      <MembershipDetail id={id} />
    </div>
  );
}
