import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getMembership } from "@/features/memberships/requests";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  User,
  DollarSign,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const formatDate = (date?: Date | string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function MembershipDetail({ id }: { id: string }) {
  const {
    data: membership,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getMembership({ id }),
    queryKey: ["membership", id],
  });

  if (isLoading) return <MembershipDetailSkeleton />;

  if (isError || !membership) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center p-6 text-destructive">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>No se pudo cargar la información de la membresía.</p>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(membership.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {membership.plan?.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1.5 font-mono text-sm tracking-wide">
                  <span className="font-semibold text-foreground/80">
                    ID: {membership.id}
                  </span>
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  membership.status === "ACTIVE" ? "default" : "secondary"
                }
                className={
                  membership.status === "ACTIVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                {membership.status === "ACTIVE" ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVA
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" /> INACTIVA
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 grid gap-8">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Miembro Asociado
            </h4>
            <div className="flex items-center gap-4 bg-muted/5 border rounded-lg p-4">
              <div className="p-2 bg-secondary rounded-full">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                {membership.member ? (
                  <Link
                    to={`/admin/dashboard/miembros/${membership.memberId}`}
                    className="text-lg font-medium hover:underline text-primary"
                  >
                    {membership.member.firstName} {membership.member.lastName}
                  </Link>
                ) : (
                  <span className="text-lg font-medium">
                    Miembro Desconocido
                  </span>
                )}
                <p className="text-sm text-muted-foreground">
                  {membership.member?.docType}: {membership.member?.docNumber}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Fecha Inicio"
              value={formatDate(membership.startDate)}
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Fecha Fin"
              value={formatDate(membership.endDate)}
            />
            <InfoItem
              icon={<Clock className="h-4 w-4" />}
              label="Días Restantes"
              value={
                <span
                  className={
                    daysRemaining < 0
                      ? "text-destructive"
                      : daysRemaining < 7
                      ? "text-orange-500"
                      : "text-green-600"
                  }
                >
                  {daysRemaining} días
                </span>
              }
            />
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Precio Pagado"
              value={`S/ ${Number(membership.price).toFixed(2)}`}
            />
          </div>
        </CardContent>

        <CardFooter className="bg-muted/10 border-t py-4 text-xs text-muted-foreground flex justify-between items-center">
          <span>Registrada el: {formatDate(membership.createdAt)}</span>
        </CardFooter>
      </Card>
    </div>
  );
}

type InfoItemProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string | React.ReactNode;
  className?: string;
};
function InfoItem({ icon, label, value, className = "" }: InfoItemProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <p className="text-base font-medium text-foreground">
        {value || (
          <span className="text-muted-foreground/50 italic">No registrado</span>
        )}
      </p>
    </div>
  );
}

function MembershipDetailSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-8">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
