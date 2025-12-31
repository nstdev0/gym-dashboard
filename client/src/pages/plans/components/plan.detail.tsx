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
import { getPlan } from "@/features/plans/requests";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  DollarSign,
  Clock,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const formatDate = (date?: Date | string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PlanDetail({ id }: { id: string }) {
  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getPlan(id),
    queryKey: ["plan", id],
  });

  if (isLoading) return <PlanDetailSkeleton />;

  if (isError || !plan) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center p-6 text-destructive">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>No se pudo cargar la información del plan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1.5 font-mono text-sm tracking-wide">
                  <span className="font-semibold text-foreground/80">
                    ID: {plan.id}
                  </span>
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={plan.isActive ? "default" : "secondary"}
                className={
                  plan.isActive ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {plan.isActive ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVO
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" /> INACTIVO
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Precio"
              value={`S/ ${Number(plan.price).toFixed(2)}`}
            />
            <InfoItem
              icon={<Clock className="h-4 w-4" />}
              label="Duración"
              value={`${plan.durationInDays} días`}
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Fecha Creación"
              value={formatDate(plan.createdAt)}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Descripción
            </h4>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
              {plan.description || "Sin descripción."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/10 border-t py-4 text-xs text-muted-foreground flex justify-between items-center">
          <span>Última actualización: {formatDate(plan.updatedAt)}</span>
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

function PlanDetailSkeleton() {
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
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
