import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/FormError";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useUpdatePlan } from "@/features/plans/mutations";
import { getPlan } from "@/features/plans/requests";
import {
  planUpdateSchema,
  type PlanUpdateInput,
} from "../../../../../server/src/domain/entities/plan";

import {
  ClipboardList,
  Save,
  Undo2,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

export default function EditPlanForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: () => getPlan(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planUpdateSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
      price: undefined,
      durationInDays: undefined,
      isActive: undefined,
    },
  });

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name || undefined,
        description: plan.description || undefined,
        price: Number(plan.price) || undefined,
        durationInDays: plan.durationInDays || undefined,
        isActive: plan.isActive || undefined,
      });
    }
  }, [plan, reset]);

  const { mutate, isPending } = useUpdatePlan();

  const onSubmit = (data: PlanUpdateInput) => {
    if (!id) return;
    mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate("/admin/dashboard/planes");
        },
      }
    );
  };

  if (isLoading) return <EditPlanSkeleton />;
  if (isError)
    return <div className="text-destructive">Error al cargar el plan</div>;

  return (
    <Card className="mx-auto w-full max-w-2xl border-border/60 shadow-md">
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Editar Plan</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Modifica los detalles del plan de suscripción.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs">
                Nombre del Plan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 pl-9 text-sm"
                  {...register("name")}
                  placeholder="Ej: Plan Mensual"
                />
              </div>
              <ErrorMessage message={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs">
                Precio (PEN) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 pl-9 text-sm"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
              <ErrorMessage message={errors.price?.message} />
            </div>
          </div>

          {/* Duración y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="durationInDays" className="text-xs">
                Duración (Días) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 pl-9 text-sm"
                  type="number"
                  {...register("durationInDays", { valueAsNumber: true })}
                  placeholder="30"
                />
              </div>
              <ErrorMessage message={errors.durationInDays?.message} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/5">
              <div className="space-y-0.5">
                <Label className="text-sm">Plan Activo</Label>
                <p className="text-[10px] text-muted-foreground">
                  Visible para nuevas suscripciones.
                </p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-90"
                  />
                )}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs">
              Descripción{" "}
              <span className="text-muted-foreground">(Opcional)</span>
            </Label>
            <Textarea
              className="resize-none text-sm"
              rows={3}
              {...register("description", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              placeholder="Detalles adicionales del plan..."
            />
            <ErrorMessage message={errors.description?.message} />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              disabled={isPending}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="min-w-32"
            >
              {isPending ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Actualizar Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EditPlanSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-2xl border-border/60 shadow-md">
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
