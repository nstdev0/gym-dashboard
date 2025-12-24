import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";
import type { User } from "../../../../../server/src/domain/entities/user";

export default function UsersListingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<User[]>([]);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontro token");
        }
        const data: User[] = await apiFetch("/users");
        setData(data);
        setAuth(true);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar este usuario?");
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        alert("No tienes permiso para eliminar usuarios");
        return;
      }
      await apiFetch(`/users/${id}`, {
        method: "DELETE",
      });
      const newData = data.filter((user) => user.id !== id);
      setData(newData);
    } catch (error) {
      let errorMessage = "Error al eliminar usuario";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error eliminando usuario:", error);
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="p-4 text-center text-muted-foreground">
          Cargando usuarios...
        </div>
      )}
      {!auth && (
        <div className="p-4 text-center text-destructive">No autorizado!</div>
      )}

      {!isLoading && auth && (
        <Card>
          <CardContent className="p-0">
            {data.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay usuarios registrados.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead></TableHead>
                    <TableHead className="pl-6">Nombre</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((user) => {
                    return (
                      <TableRow key={user.id} className="hover:bg-muted/5">
                        <TableCell>{data.indexOf(user) + 1}</TableCell>
                        <TableCell className="pl-6 font-medium">
                          {user.firstName} {user.lastName || ""}
                        </TableCell>
                        <TableCell>{user.username || "-"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <CircleCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <CircleX className="w-4 h-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/dashboard/usuarios/${user.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                            {/* Placeholder for Edit - if page exists or just to match look & feel */}
                            <Link
                              to={`/admin/dashboard/usuarios/${user.id}/editar`}
                            >
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDelete(user.id!)}
                              variant="destructive"
                              size="sm"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
