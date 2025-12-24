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
import type { Membership } from "../../../../../server/src/domain/entities/membership";

export default function MembershipsListingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Membership[]>([]);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontro token");
        }
        const data: Membership[] = await apiFetch("/memberships");
        setData(data);
        setAuth(true);
      } catch (error) {
        console.error("Error cargando membresias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm(
        "Estas seguro de eliminar esta membresia?"
      );
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        alert("No tienes permiso para eliminar membresias");
        return;
      }
      await apiFetch(`/memberships/${id}`, {
        method: "DELETE",
      });
      const newData = data.filter((membership) => membership.id !== id);
      setData(newData);
    } catch (error) {
      let errorMessage = "Error al eliminar membresia";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error eliminando membresia:", error);
      alert(errorMessage || "Error al eliminar membresia");
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="p-4 text-center text-muted-foreground">
          Cargando membresias...
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
                No hay membresias registradas.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead></TableHead>
                    <TableHead className="pl-6">Miembro</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((membership) => {
                    return (
                      <TableRow
                        key={membership.id}
                        className="hover:bg-muted/5"
                      >
                        <TableCell>{data.indexOf(membership) + 1}</TableCell>
                        <TableCell className="pl-6 font-medium">
                          {membership.member ? (
                            <>
                              {membership.member.firstName}{" "}
                              {membership.member.lastName}
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              {membership.memberId}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {membership.plan ? (
                            <>{membership.plan.name}</>
                          ) : (
                            <span className="text-muted-foreground">
                              {membership.planId}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(membership.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(membership.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {membership.status === "ACTIVE" ? (
                            <CircleCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <CircleX className="w-4 h-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/dashboard/membresias/${membership.id}`}
                            >
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                            <Link
                              to={`/admin/dashboard/membresias/${membership.id}/editar`}
                            >
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDelete(membership.id!)}
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
