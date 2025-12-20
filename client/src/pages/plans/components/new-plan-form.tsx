import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  createPlanSchema,
  type CreatePlanSchema,
} from "../../../../../server/src/lib/validators/plan.schema";

export default function NewPlanForm() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
      } = useForm<CreatePlanSchema>({
        resolver: zodResolver(createPlanSchema) as any,
        defaultValues: {
            isActive: true,
            description: ""
        }
      });
    
      const onSubmit: SubmitHandler<CreatePlanSchema> = async (data) => {
        try {
          const role = localStorage.getItem("role")
          if (role !== "OWNER") {
            throw new Error("No tienes permiso para crear planes")
          }
          await apiFetch(
            "/plans",
            "POST",
            JSON.stringify(data),
            {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            }
          );
          navigate("/admin/dashboard/planes");
        } catch (error) {
           console.error("Error al crear plan", error);
           alert("Error al crear plan");
        }
      };

    return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Registrar Nuevo Plan</CardTitle>
        <CardDescription>
          Ingresa los datos para registrar un nuevo plan de suscripción.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 gap-6">
              <Field>
                <FieldLabel htmlFor="name">Nombre <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="Ej. Plan Mensual"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </Field>
               <Field>
                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                <Input
                  {...register("description")}
                  placeholder="Descripción breve del plan"
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">{errors.description.message}</span>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="price">Precio (S/) <span className="text-destructive">*</span></FieldLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("price", {valueAsNumber: true})}
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
                      {...register("durationInDays", {valueAsNumber: true})}
                      placeholder="30"
                    />
                    {errors.durationInDays && (
                      <span className="text-red-500 text-sm">{errors.durationInDays.message}</span>
                    )}
                  </Field>
              </div>
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar plan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
