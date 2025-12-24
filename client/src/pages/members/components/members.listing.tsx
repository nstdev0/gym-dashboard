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
import { Link } from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";
import { type Member as BaseMember } from "../../../../../server/src/domain/entities/member";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Member = BaseMember & {
  memberships?: (NonNullable<BaseMember["memberships"]>[number] & {
    plan?: {
      name: string;
    };
  })[];
};

export default function MembersListingPage() {
  const queryClient = useQueryClient();
  const request = {
    filters: {},
    page: 1,
    pageSize: 10,
  };

  const { data, isLoading, isError, error } = useQuery<Member[]>({
    queryKey: ["members", request],
    queryFn: async () => {
       const res = await apiFetch("/members");
       return res as Member[];
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para eliminar miembros");
      }
      await apiFetch(`/members/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      console.error("Error eliminando miembro:", error);
      let errorMessage = "Error desconocido al eliminar miembro";
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    },
  });

  const handleDelete = async (id: string | number) => {
    const confirm = window.confirm("Estas seguro de eliminar este miembro?");
    if (!confirm) {
      return;
    }
    deleteMutation.mutate(id);
  };

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive">
        Error al cargar miembros: {error instanceof Error ? error.message : "Error desconocido"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="p-4 text-center text-muted-foreground">
          Cargando miembros...
        </div>
      )}

      {!isLoading && data && (
        <Card>
          <CardContent className="p-0">
            {data.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay miembros registrados.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead></TableHead>
                    <TableHead className="pl-6">Nombres</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Plan activo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((member) => {
                    const activePlan = member.memberships?.[0]?.plan?.name;

                    return (
                      <TableRow key={member.id} className="hover:bg-muted/5">
                        <TableCell>{data.indexOf(member) + 1}</TableCell>
                        <TableCell className="pl-6 font-medium">
                          {member.firstName}
                        </TableCell>
                        <TableCell>{member.lastName || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.docType} {member.docNumber}
                        </TableCell>
                        <TableCell>{member.phoneNumber || "-"}</TableCell>
                        <TableCell>
                          {activePlan ? (
                            <span className="font-medium text-primary">
                              {activePlan}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Sin plan
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {member.isActive ? (
                            <CircleCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <CircleX className="w-4 h-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/dashboard/miembros/${member.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                            <Link
                              to={`/admin/dashboard/miembros/${member.id}/editar`}
                            >
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDelete(member.id)}
                              variant="destructive"
                              size="sm"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "..." : "Eliminar"}
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
