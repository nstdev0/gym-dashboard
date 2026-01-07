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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUpdateMembership } from "@/features/memberships/mutations";
import { getPlans } from "@/features/plans/requests";

import { CreditCard, Save, Undo2, Calendar, DollarSign } from "lucide-react";
import type { Plan } from "@server/entities/plan";

import {
  membershipUpdateSchema,
  type Membership,
  type MembershipUpdateInput,
} from "@server/entities/membership";

export default function EditMembershipForm({
  membership,
  isError,
}: {
  membership: Membership | undefined | null;
  isError: boolean;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Use props instead of query

  const member = membership?.member;

  const { data: plansResponse } = useQuery({
    queryKey: ["plans", "all"],
    queryFn: () => getPlans({ page: 1, pageSize: 100 }),
  });
  const plans: Plan[] = plansResponse?.records ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(membershipUpdateSchema),
    defaultValues: {
      memberId: membership?.memberId || "",
      planId: membership?.planId || "",
      startDate: membership?.startDate
        ? new Date(membership.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: membership?.endDate
        ? new Date(membership.endDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      price: membership?.price ? Number(membership.price) : 0,
      status: membership?.status || "ACTIVE",
    },
  });

  const { mutate, isPending } = useUpdateMembership();

  const onSubmit = (data: MembershipUpdateInput) => {
    if (!id) return;
    mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate("/admin/dashboard/membresias");
        },
      }
    );
  };

  if (isError)
    return <div className="text-destructive">Error al cargar la membresía</div>;

  return (
    <Card className="mx-auto w-full max-w-3xl border-border/60 shadow-md">
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Editar Membresía</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Modifica los detalles de la suscripción.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Selección de Miembro y Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs">
                Miembro <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="memberId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={member?.firstName + " " + member?.lastName}
                    disabled={true}
                  >
                    {/* Disable member switching on edit usually safer */}
                    <SelectTrigger className="h-9 text-sm opacity-80 cursor-not-allowed">
                      <SelectValue placeholder="Seleccionar miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        key={member?.id}
                        value={member?.firstName + " " + member?.lastName}
                      >
                        {member?.firstName} {member?.lastName}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[10px] text-muted-foreground">
                No se puede cambiar el miembro en edición.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">
                Plan <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="planId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Seleccionar plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - S/ {Number(plan.price).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage message={errors.planId?.message} />
            </div>
          </div>

          <div className="my-2 border-t border-dashed" />

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-xs">
                Fecha Inicio <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 pl-9 text-sm"
                  type="date"
                  {...register("startDate")}
                />
              </div>
              <ErrorMessage message={errors.startDate?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-xs">
                Fecha Fin <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 pl-9 text-sm"
                  type="date"
                  {...register("endDate")}
                />
              </div>
              <ErrorMessage message={errors.endDate?.message} />
            </div>
          </div>

          {/* Precio y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs">
                Precio Final (PEN) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 pl-9 text-sm"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              <ErrorMessage message={errors.price?.message} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/5">
              <div className="space-y-0.5">
                <Label className="text-sm">Estado</Label>
                <p className="text-[10px] text-muted-foreground">
                  Define si la membresía está activa.
                </p>
              </div>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-normal">Inactivo</Label>
                    <Switch
                      checked={field.value === "ACTIVE"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "ACTIVE" : "INACTIVE")
                      }
                      className="scale-90"
                    />
                    <Label className="text-xs font-normal">Activo</Label>
                  </div>
                )}
              />
            </div>
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
                  Actualizar
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
