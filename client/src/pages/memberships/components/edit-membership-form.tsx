import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  updateMembershipSchema,
  type MembershipSchema,
  type UpdateMembershipSchema,
} from "../../../../../server/src/lib/validators/membership.schema";

export default function EditMembershipForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdateMembershipSchema>({
    resolver: zodResolver(updateMembershipSchema) as any,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "OWNER") {
      alert("No tienes permiso para editar membresias");
      navigate("/admin/dashboard/membresias");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [membersData, plansData, membershipDetail] = await Promise.all([
             apiFetch("/members", "GET", null, { Authorization: `Bearer ${token}` }),
             apiFetch("/plans", "GET", null, { Authorization: `Bearer ${token}` }),
             apiFetch(`/memberships/${id}`, "GET", null, { Authorization: `Bearer ${token}` })
        ]);

        setMembers(membersData as any[]);
        setPlans(plansData as any[]);
        
        const membership = membershipDetail as MembershipSchema;
        // Dates need formatting for some inputs if we were using date inputs, but we removed them.
        reset(membership);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, reset, navigate]);

  const onSubmit: SubmitHandler<UpdateMembershipSchema> = async (data) => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para editar membresias");
      }
      
      // Filter out startDate/endDate if they are in data to avoid overwriting unless intended (but users can't edit them in this form anyway)
      // Actually backend ignores them usually if not passed, but let's just pass what we have
      
      const updatedMembershipData = {
        ...data,
      };

      await apiFetch(`/memberships/${id}`, "PUT", JSON.stringify(updatedMembershipData), {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      });
      navigate("/admin/dashboard/membresias");
    } catch (error) {
      console.error("Error updating membership", error);
      alert("Error al actualizar membresia");
    }
  };

   const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar esta membresia?")
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para eliminar membresias");
      }
      await apiFetch(`/memberships/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      navigate("/admin/dashboard/membresias");
    } catch (error) {
      console.error("Error eliminando membresia:", error);
    }
  }


  if (isLoading) {
    return <div className="p-4 text-center">Cargando datos de la membresia...</div>;
  }

  return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Editar Membresia</CardTitle>
        <CardDescription>
          Actualiza la información de la membresia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="memberId">Miembro <span className="text-destructive">*</span></FieldLabel>
                 <Controller
                  control={control}
                  name="memberId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar miembro" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName} ({member.docNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.memberId && (
                  <span className="text-red-500 text-sm">{errors.memberId.message}</span>
                )}
              </Field>
               <Field>
                <FieldLabel htmlFor="planId">Plan <span className="text-destructive">*</span></FieldLabel>
                <Controller
                  control={control}
                  name="planId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - S/{plan.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.planId && (
                  <span className="text-red-500 text-sm">{errors.planId.message}</span>
                )}
              </Field>
               <Field>
                <FieldLabel htmlFor="status">Estado <span className="text-destructive">*</span></FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVO</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVO</SelectItem>
                        <SelectItem value="EXPIRED">EXPIRADO</SelectItem>
                        <SelectItem value="PAUSED">PAUSADO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <span className="text-red-500 text-sm">{errors.status.message}</span>
                )}
              </Field>
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4 gap-2">
            <Button variant="destructive" type="button" disabled={isSubmitting} onClick={() => handleDelete(id)}>
              Eliminar membresia
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando cambios..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
