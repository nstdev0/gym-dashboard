import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { MemberSchema } from "../../../../../server/src/lib/lib/validators/member.schema";
import { CircleCheck, CircleX } from "lucide-react";

export default function MembersListingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<MemberSchema[]>([]);
  const [auth, setAuth] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontro token");
        }
        const data: MemberSchema[] = await apiFetch("/members", "GET", null, {
          Authorization: `Bearer ${token}`,
        });
        setData(data);
        setAuth(true);
      } catch (error) {
        console.error("Error cargando miembros:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar este miembro?")
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para eliminar miembros");
      }
      await apiFetch(`/members/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      const newData = data.filter((member) => member.id !== id);
      setData(newData);
    } catch (error) {
      console.error("Error eliminando miembro:", error);
    }
    navigate("/admin/dashboard/miembros");
  }

  return (
    <div className="space-y-4">
      {isLoading && <div className="p-4 text-center text-muted-foreground">Cargando miembros...</div>}
      {!auth && <div className="p-4 text-center text-destructive">No autorizado!</div>}
      
      {!isLoading && auth && (
        <Card>
          <CardContent className="p-0">
            {data.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No hay miembros registrados.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead></TableHead>
                    <TableHead className="pl-6">Nombres</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((member) => {
                    return (
                      <TableRow key={member.id} className="hover:bg-muted/5">
                        <TableCell>{data.indexOf(member) + 1}</TableCell>
                        <TableCell className="pl-6 font-medium">
                          {member.firstName}
                        </TableCell>
                        <TableCell>
                          {member.lastName || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.docType} {member.docNumber}
                        </TableCell>
                        <TableCell>
                          {member.phoneNumber || "-"}
                        </TableCell>
                        <TableCell>
                          {member.isActive ? <CircleCheck className="w-4 h-4 text-green-500" /> : <CircleX className="w-4 h-4 text-red-500" />}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <div className="flex justify-end gap-2">
                            <Link to={`/admin/dashboard/miembros/${member.id}`}>
                              <Button variant="ghost" size="sm">Ver</Button>
                            </Link>
                            <Link
                              to={`/admin/dashboard/miembros/${member.id}/editar`}
                            >
                              <Button variant="outline" size="sm">Editar</Button>
                            </Link>
                              <Button onClick={() => handleDelete(member.id)} variant="destructive" size="sm">Eliminar</Button>
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
