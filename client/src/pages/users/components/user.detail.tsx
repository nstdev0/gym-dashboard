import { apiFetch } from "@/api/apiFetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/entities/user";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserDetail({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response: User = await apiFetch(`/users/${id}`);
        if (!response) {
          throw new Error("No se encontro el usuario");
        }
        setUser(response);
      } catch (error) {
        console.error("Error cargando detalles del usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      )}
      {!isLoading && user && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {user?.firstName} {user?.lastName}
                  </CardTitle>
                  <CardDescription className="uppercase mt-1 font-mono tracking-wider text-lg">
                    {user?.role}
                  </CardDescription>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.isActive ? "ACTIVO" : "INACTIVO"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h4>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Username
                  </h4>
                  <p className="text-lg">{user.username || "-"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 text-xs text-muted-foreground border-t border-border/40 py-3 flex justify-between">
              <span>
                ID: <span className="font-mono">{user?.id}</span>
              </span>
              <span>
                Registro:{" "}
                {new Date(user?.createdAt).toLocaleDateString("es-PE")}
              </span>
            </CardFooter>
          </Card>
        </div>
      )}
      {!isLoading && !user && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No se encontró información del usuario.</p>
        </div>
      )}
    </div>
  );
}
