import { apiFetch } from "@/api/apiFetch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { MembershipSchema } from "../../../../../server/src/lib/lib/validators/membership.schema";

export default function MembershipDetail({id}: {id: string}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [membership, setMembership] = useState<MembershipSchema | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        
        const response: MembershipSchema = await apiFetch(`/memberships/${id}`, "GET", null, {Authorization: `Bearer ${token}`});
        if (!response) {
          throw new Error("No se encontro la membresia");
        }
        setMembership(response);
      } catch (error) {
        console.error("Error cargando detalles de la membresia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id])

    return (
        <div className="w-full">
            {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}
            {!isLoading && membership && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">Membresía</CardTitle>
                                    <CardDescription className="mt-1 text-lg font-mono">
                                        Plan: {membership.planId}
                                    </CardDescription>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${membership.status === 'ACTIVE' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600"}`}>
                                    {membership.status}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Miembro ID</h4>
                                    <p className="text-lg font-mono">{membership.memberId}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Vigencia</h4>
                                    <p className="text-lg">{new Date(membership.startDate).toLocaleDateString()} - {new Date(membership.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 text-xs text-muted-foreground border-t border-border/40 py-3 flex justify-between">
                            <span>ID: <span className="font-mono">{membership.id}</span></span>
                            <span>Registro: {new Date(membership.createdAt).toLocaleDateString("es-PE")}</span>
                        </CardFooter>
                    </Card>
                </div>
            )}
            {!isLoading && !membership && (
                 <div className="text-center py-12 text-muted-foreground">
                    <p>No se encontró información de la membresía.</p>
                </div>
            )}
        </div>
    )}
