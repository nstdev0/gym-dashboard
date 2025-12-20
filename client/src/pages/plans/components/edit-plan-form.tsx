import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  updatePlanSchema,
  type PlanSchema,
  type UpdatePlanSchema,
} from "../../../../../server/src/lib/validators/plan.schema";
import { Switch } from "@/components/ui/switch";

export default function EditPlanForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdatePlanSchema>({
    resolver: zodResolver(updatePlanSchema) as any,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "OWNER") {
      alert("No tienes permiso para editar planes");
      navigate("/admin/dashboard/planes");
      return;
    }

    const fetchPlanDetails = async () => {
      try {
        const planDetail: PlanSchema = await apiFetch(
          `/plans/${id}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        );

        reset(planDetail);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanDetails();
  }, [id, reset, navigate]);

  const onSubmit: SubmitHandler<UpdatePlanSchema> = async (data) => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para editar planes");
      }
      
      const updatedPlanData = {
        ...data,
      };

      await apiFetch(`/plans/${id}`, "PUT", JSON.stringify(updatedPlanData), {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      });
      navigate("/admin/dashboard/planes");
    } catch (error) {
      console.error("Error updating plan", error);
      alert("Error al actualizar plan");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar este plan?")
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para eliminar planes");
      }
      await apiFetch(`/plans/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      navigate("/admin/dashboard/planes");
    } catch (error) {
      console.error("Error eliminando plan:", error);
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Cargando datos del plan...</div>;
  }

  return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Editar Plan</CardTitle>
        <CardDescription>
          Actualiza la información del plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="name">Nombre <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="Nombre del plan"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="price">Precio (S/) <span className="text-destructive">*</span></FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">{errors.price.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="durationInDays">Duración (Días) <span className="text-destructive">*</span></FieldLabel>
                <Input
                  type="number"
                  {...register("durationInDays", { valueAsNumber: true })}
                  placeholder="e.j. 30"
                />
                {errors.durationInDays && (
                  <span className="text-red-500 text-sm">{errors.durationInDays.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                <Input
                  {...register("description")}
                  placeholder="Descripción opcional"
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">{errors.description.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="isActive">Activo</FieldLabel>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={field.value ? "data-[state=checked]:bg-green-600" : "data-[state=unchecked]:bg-slate-300"}
                      />
                      <span className={`text-sm font-medium ${field.value ? "text-green-600" : "text-slate-500"}`}>
                        {field.value ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </div>
                  )}
                />
              </Field>
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4 gap-2">
             <Button variant="destructive" type="button" disabled={isSubmitting} onClick={() => handleDelete(id)}>
              Eliminar plan
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
