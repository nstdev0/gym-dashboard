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
import { getUser } from "@/features/users/requests";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Hash,
} from "lucide-react";

const formatDate = (date?: Date | string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function UserDetail({ id }: { id: string }) {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getUser(id),
    queryKey: ["user", id],
  });

  const user = response?.data;

  if (isLoading) return <UserDetailSkeleton />;

  if (isError || !user) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center p-6 text-destructive">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>No se pudo cargar la información del usuario.</p>
        </CardContent>
      </Card>
    );
  }

  const initials = `${user.firstName.charAt(0)}${
    user.lastName ? user.lastName.charAt(0) : ""
  }`.toUpperCase();

  return (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full text-xl font-bold">
                {initials}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1.5 font-mono text-sm tracking-wide">
                  <span className="font-semibold text-foreground/80">
                    @{user.username || "sin_usuario"}
                  </span>
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={user.isActive ? "default" : "secondary"}
                className={
                  user.isActive ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {user.isActive ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVO
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" /> INACTIVO
                  </>
                )}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/50 text-primary bg-primary/5 uppercase"
              >
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={user.email}
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Fecha Registro"
              value={formatDate(user.createdAt)}
            />
            <InfoItem
              icon={<Hash className="h-4 w-4" />}
              label="ID Sistema"
              value={<span className="font-mono text-xs">{user.id}</span>}
            />
          </div>
        </CardContent>

        <CardFooter className="bg-muted/10 border-t py-4 text-xs text-muted-foreground flex justify-between items-center">
          <span>Última actualización: {formatDate(user.updatedAt)}</span>
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

function UserDetailSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-8">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
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
      </CardContent>
    </Card>
  );
}
