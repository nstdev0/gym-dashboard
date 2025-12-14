import { apiFetch } from "@/api/apiFetch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// (Opcional) Define la interfaz para tener autocompletado y evitar errores de TS
interface Member {
  id: string | number;
  firstName: string;
  lastName: string;
  docType: string;
  docNumber: string;
  phoneNumber: string;
}

export default function MembersListingPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Member[]>([]);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontro token");
        }
        const data: Member[] = await apiFetch("/members", "GET", null, {Authorization: `Bearer ${token}`});
        setData(data);
        setAuth(true);
      } catch (error) {
        console.error("Error cargando miembros:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [])

  return (
    <div>
      {isLoading && <p>Cargando miembros...</p>}
      {!auth && <p>No autorizado!</p>}
      {!isLoading && auth && data.length === 0 && <p>No hay miembros.</p>}
      {!isLoading && auth && data.length > 0 && (
        <div>
          <Table>
            <TableCaption>Miembros.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Ahora data es un array, así que .map funciona */}
              {data.map((member) => {
                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.id}</TableCell>
                    <TableCell className="font-medium">
                      {member.firstName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {/* CORRECCIÓN 5: Typo arreglado (asumiendo que es lastName) */}
                      {member.lastName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.docType + " " + member.docNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.phoneNumber}
                    </TableCell>
                    {/* Tenías firstName repetido aquí, asumo que querías otra cosa o botones */}
                    <TableCell className="font-medium">
                      <Link to={`/admin/dashboard/miembros/${member.id}`}>Ver</Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
