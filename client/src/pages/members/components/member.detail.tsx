import { apiFetch } from "@/api/apiFetch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { MemberSchema } from "../../../../../server/src/lib/lib/validators/member.schema";

export default function MemberDetail({id}: {id: string}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [member, setMember] = useState<MemberSchema | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("role");
        if (!role) {
          throw new Error("No se encontro el rol");
        }
        const response: MemberSchema = await apiFetch(`/members/${id}`, "GET", null, {Authorization: `Bearer ${localStorage.getItem("token")}`});
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
        <div className="w-full">
            {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}
            {!isLoading && member && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{member?.firstName} {member?.lastName}</CardTitle>
                                    <CardDescription className="uppercase mt-1 font-mono tracking-wider text-lg">
                                        {member?.docType} • {member?.docNumber}
                                    </CardDescription>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${member.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600"}`}>
                                    {member.isActive ? "ACTIVO" : "INACTIVO"}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Información de Contacto</h4>
                                    <p className="text-lg font-medium">{member?.phoneNumber || <span className="text-muted-foreground italic">No registrado</span>}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</h4>
                                    <p className="text-lg">{member?.birthDate ? new Date(member.birthDate).toLocaleDateString("es-PE", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</p>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Genero</h4>
                                    <p className="text-lg">{member?.gender === "MALE" ? "Masculino" : "Femenino"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Altura</h4>
                                        <p className="text-lg">{member?.height ? `${member.height} cm` : "-"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Peso</h4>
                                        <p className="text-lg">{member?.weight ? `${member.weight} kg` : "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 text-xs text-muted-foreground border-t border-border/40 py-3 flex justify-between">
                            <span>ID: <span className="font-mono">{member?.id}</span></span>
                            <span>Registro: {new Date(member?.createdAt).toLocaleDateString("es-PE")}</span>
                        </CardFooter>
                    </Card>
                </div>
            )}
            {!isLoading && !member && (
                 <div className="text-center py-12 text-muted-foreground">
                    <p>No se encontró información del miembro.</p>
                </div>
            )}
        </div>
    )}