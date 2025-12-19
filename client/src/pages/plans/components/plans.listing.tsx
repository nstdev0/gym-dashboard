import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import type { PlanSchema } from "../../../../../server/src/lib/lib/validators/plan.schema";
import { CircleCheck, CircleX } from "lucide-react";

export default function PlansListingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<PlanSchema[]>([]);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontro token");
        }
        const data: PlanSchema[] = await apiFetch("/plans", "GET", null, {
          Authorization: `Bearer ${token}`,
        });
        setData(data);
        setAuth(true);
      } catch (error) {
        console.error("Error cargando planes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar este plan?");
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
         alert("No tienes permiso para eliminar planes");
         return;
      }
      await apiFetch(`/plans/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      const newData = data.filter((plan) => plan.id !== id);
      setData(newData);
    } catch (error: any) {
      console.error("Error eliminando plan:", error);
      alert(error.message || "Error al eliminar plan");
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="p-4 text-center text-muted-foreground">
          Cargando planes...
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
                No hay planes registrados.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead></TableHead>
                    <TableHead className="pl-6">Nombre</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Duracion (Dias)</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((plan) => {
                    return (
                      <TableRow key={plan.id} className="hover:bg-muted/5">
                        <TableCell>{data.indexOf(plan) + 1}</TableCell>
                        <TableCell className="pl-6 font-medium">
                          {plan.name}
                        </TableCell>
                        <TableCell>{plan.description || "-"}</TableCell>
                        <TableCell>{plan.price}</TableCell>
                        <TableCell>{plan.durationInDays}</TableCell>
                         <TableCell>
                          {plan.isActive ? (
                            <CircleCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <CircleX className="w-4 h-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              <Link to={`/admin/dashboard/planes/${plan.id}`}>
                                <Button variant="ghost" size="sm">
                                    Ver
                                </Button>
                              </Link>
                                <Link to={`/admin/dashboard/planes/${plan.id}/editar`}>
                                <Button variant="outline" size="sm">
                                    Editar
                                </Button>
                                </Link>
                              <Button
                                onClick={() => handleDelete(plan.id!)}
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
