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
import { getMember } from "@/features/members/requests";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Ruler,
  Weight,
  Phone,
  Mail,
  User as UserIcon,
  CreditCard,
  AlertCircle,
} from "lucide-react";

// Helper para formatear fechas
const formatDate = (date?: Date | string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function MemberDetail({ id }: { id: string }) {
  const {
    data: member,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getMember({ id }),
    queryKey: ["member", id],
  });

  if (isLoading) return <MemberDetailSkeleton />;

  if (isError || !member) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center p-6 text-destructive">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>No se pudo cargar la información del miembro.</p>
        </CardContent>
      </Card>
    );
  }

  // Lógica para encontrar la membresía relevante (La activa o la última registrada)
  // Asumimos que el backend devuelve las membresías ordenadas, o buscamos la activa.
  const activeMembership = member.memberships?.find(
    (m) => m.status === "ACTIVE"
  );
  const latestMembership = member.memberships?.[0];
  const displayMembership = activeMembership || latestMembership;

  return (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden">
        {/* ENCABEZADO CON ESTADO Y PLAN */}
        <CardHeader className="border-b bg-muted/30 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {member.firstName} {member.lastName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1.5 font-mono text-sm tracking-wide">
                  <span className="font-semibold text-foreground/80">
                    {member.docType}
                  </span>
                  <span>•</span>
                  <span>{member.docNumber}</span>
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={member.isActive ? "default" : "secondary"}
                className={
                  member.isActive ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {member.isActive ? "USUARIO ACTIVO" : "INACTIVO"}
              </Badge>

              {displayMembership ? (
                <Badge
                  variant="outline"
                  className="border-primary/50 text-primary bg-primary/5"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  {displayMembership.plan?.name}
                  {displayMembership.status !== "ACTIVE" &&
                    ` (${displayMembership.status})`}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground border-dashed"
                >
                  Sin Membresía
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 grid gap-8">
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Teléfono"
              value={member.phoneNumber}
            />
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={member.email}
              className="truncate"
            />
            <InfoItem
              icon={<UserIcon className="h-4 w-4" />}
              label="Género"
              value={
                member.gender === "MALE"
                  ? "Masculino"
                  : member.gender === "FEMALE"
                  ? "Femenino"
                  : "-"
              }
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Nacimiento"
              value={formatDate(member.birthDate)}
            />
          </div>

          <Separator />

          {/* SECCIÓN 2: DATOS FÍSICOS */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Datos Físicos
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-card shadow-sm">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600">
                  <Ruler className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Altura</p>
                  <p className="text-lg font-medium">
                    {member.height ? `${member.height} cm` : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-card shadow-sm">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full text-orange-600">
                  <Weight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peso</p>
                  <p className="text-lg font-medium">
                    {member.weight ? `${member.weight} kg` : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* OPCIONAL: MOSTRAR DETALLES DE LA MEMBRESÍA ACTUAL SI EXISTE */}
          {displayMembership && displayMembership.status === "ACTIVE" && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                  Membresía Actual
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoItem
                    label="Inicio"
                    value={formatDate(displayMembership.startDate)}
                  />
                  <InfoItem
                    label="Fin"
                    value={formatDate(displayMembership.endDate)}
                  />
                  <InfoItem
                    label="Días Restantes"
                    value={Math.ceil(
                      (new Date(displayMembership.endDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="bg-muted/10 border-t py-4 text-xs text-muted-foreground flex justify-between items-center">
          <span className="font-mono bg-muted px-2 py-0.5 rounded">
            ID: {member.id}
          </span>
          <span>Registrado el {formatDate(member.createdAt)}</span>
        </CardFooter>
      </Card>
    </div>
  );
}

// Sub-componente para limpiar el código principal
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

// Skeleton para mejorar la UX de carga
function MemberDetailSkeleton() {
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
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-4 gap-6">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
