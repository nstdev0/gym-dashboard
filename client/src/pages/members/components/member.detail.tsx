import { apiFetch } from "@/api/apiFetch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Member = {
  id: string | number;
  firstName: string;
  lastName: string;
  gender: string
  birthDate: string
  height: string
  weight: string
  docType: string;
  docNumber: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
} | null;

export default function MemberDetail({id}: {id: string}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [member, setMember] = useState<Member>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("role");
        if (!role) {
          throw new Error("No se encontro el rol");
        }
        const response: Member = await apiFetch(`/members/${id}`, "GET", null, {Authorization: `Bearer ${localStorage.getItem("token")}`});
        if (!response) {
          throw new Error("No se encontro el miembro");
        }
        setMember(response);
      } catch (error) {
        console.error("Error cargando detalles del miembro:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id])

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            {isLoading && <Loader2 className="animate-spin" />}
            {!isLoading && member && (
                <Card>
                    <CardHeader>
                        <CardTitle>{member?.firstName + " " + member?.lastName}</CardTitle>
                        <CardDescription>{member?.docType + " " + member?.docNumber}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Telefono: {member?.phoneNumber}</p>
                        <p>Fecha de nacimiento: {new Date(member?.birthDate).toLocaleDateString("es-PE")}</p>
                        <p>Altura: {member?.height} cm</p>
                        <p>Peso: {member?.weight} kg</p>
                        <p>Genero: {member?.gender === "MALE" ? "Masculino" : "Femenino"}</p>
                        <p>Fecha de creacion: {new Date(member?.createdAt).toLocaleDateString("es-PE")}</p>
                        <p>Fecha de actualizacion: {new Date(member?.updatedAt).toLocaleDateString("es-PE")}</p>
                    </CardContent>
                    <CardFooter>
                        <p>ID de miembro: {member?.id}</p>
                    </CardFooter>
                </Card>)
            }
            {!isLoading && !member && <p>No se encontro el miembro</p>}
        </div>
    )}