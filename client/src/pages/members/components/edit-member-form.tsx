import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/FormError";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { useUpdateMember } from "@/features/members/mutations";

import {
  User as UserIcon,
  CreditCard,
  Activity,
  Phone,
  Mail,
  Save,
  Undo2,
  AlertCircle,
} from "lucide-react";

import {
  memberUpdateSchema,
  type Member,
  type MemberUpdateInput,
} from "@server/entities/member";

export default function EditMemberForm({
  member,
  isError,
}: {
  member: Member | undefined | null;
  isError: boolean;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberUpdateSchema),
    defaultValues: {
      firstName: member?.firstName || undefined,
      lastName: member?.lastName || undefined,
      gender: member?.gender || undefined,
      docType: member?.docType || undefined,
      docNumber: member?.docNumber || undefined,
      birthDate: member?.birthDate
        ? new Date(member.birthDate).toISOString().split("T")[0]
        : undefined,
      email: member?.email || undefined,
      height: member?.height || undefined,
      weight: member?.weight || undefined,
      phoneNumber: member?.phoneNumber || undefined,
      isActive: member?.isActive || undefined,
    },
  });

  const { mutate: updateMember, isPending } = useUpdateMember();

  const onSubmit: SubmitHandler<MemberUpdateInput> = (data) => {
    if (!id) return;
    updateMember(
      { id, data },
      { onSuccess: () => navigate("/admin/dashboard/miembros") }
    );
  };

  // --- ESTADO DE ERROR ---
  if (isError || !member)
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <AlertCircle className="h-10 w-10 mb-2 text-destructive" />
        <p>Error al cargar la información del miembro.</p>
        <Button variant="link" onClick={() => navigate(-1)}>
          Volver atrás
        </Button>
      </div>
    );

  return (
    <Card className="mx-auto w-full max-w-6xl border-border/60 shadow-md">
      {/* HEADER COMPACTO */}
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Editar Miembro</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Actualiza los datos de {member.firstName}.
              </CardDescription>
            </div>
          </div>
          {/* Badge de ID opcional */}
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
            ID: {id}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* LAYOUT PRINCIPAL: 2 COLUMNAS (Igual que NewMemberForm) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- COLUMNA IZQUIERDA --- */}
            <div className="space-y-5">
              {/* SECCIÓN 1: IDENTIFICACIÓN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <CreditCard className="h-3.5 w-3.5" />
                  <h3>Identificación</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1.5">
                    <Label htmlFor="docType" className="text-xs">
                      Tipo
                    </Label>
                    <Controller
                      control={control}
                      name="docType"
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            trigger("docNumber");
                          }}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                            <SelectItem value="CE">C.E.</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <ErrorMessage message={errors.docType?.message} />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="docNumber" className="text-xs">
                      Número Doc. <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      className="h-9 text-sm"
                      {...register("docNumber")}
                      placeholder="Número de documento"
                    />
                    <ErrorMessage message={errors.docNumber?.message} />
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* SECCIÓN 2: DATOS PERSONALES */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <UserIcon className="h-3.5 w-3.5" />
                  <h3>Datos Personales</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">
                      Nombres <span className="text-destructive">*</span>
                    </Label>
                    <Input className="h-9 text-sm" {...register("firstName")} />
                    <ErrorMessage message={errors.firstName?.message} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">
                      Apellidos <span className="text-destructive">*</span>
                    </Label>
                    <Input className="h-9 text-sm" {...register("lastName")} />
                    <ErrorMessage message={errors.lastName?.message} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-xs">
                      Género
                    </Label>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            trigger("gender");
                          }}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Masculino</SelectItem>
                            <SelectItem value="FEMALE">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <ErrorMessage message={errors.gender?.message} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="birthDate" className="text-xs">
                      F. Nacimiento
                    </Label>
                    <Input
                      className="h-9 text-sm"
                      type="date"
                      {...register("birthDate", {
                        setValueAs: (v) => (v === "" ? null : v),
                      })}
                    />
                    <ErrorMessage message={errors.birthDate?.message} />
                  </div>
                </div>
              </div>
            </div>

            {/* --- COLUMNA DERECHA --- */}
            <div className="space-y-5">
              {/* SECCIÓN 3: DATOS FÍSICOS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <Activity className="h-3.5 w-3.5" />
                  <h3>Datos Físicos</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="height" className="text-xs">
                      Altura
                    </Label>
                    <div className="relative">
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        step="0.01"
                        {...register("height", { valueAsNumber: true })}
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        cm
                      </span>
                    </div>
                    <ErrorMessage message={errors.height?.message} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="weight" className="text-xs">
                      Peso
                    </Label>
                    <div className="relative">
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        step="0.01"
                        {...register("weight", { valueAsNumber: true })}
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        kg
                      </span>
                    </div>
                    <ErrorMessage message={errors.weight?.message} />
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* SECCIÓN 4: CONTACTO */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <Phone className="h-3.5 w-3.5" />
                  <h3>Contacto</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber" className="text-xs">
                      Teléfono
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9 h-9 text-sm"
                        type="tel"
                        {...register("phoneNumber", {
                          setValueAs: (v) => (v === "" ? null : v),
                        })}
                      />
                    </div>
                    <ErrorMessage message={errors.phoneNumber?.message} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">
                      Correo
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9 h-9 text-sm"
                        type="email"
                        {...register("email", {
                          setValueAs: (v) => (v === "" ? null : v),
                        })}
                      />
                    </div>
                    <ErrorMessage message={errors.email?.message} />
                  </div>
                </div>
              </div>

              {/* ESTADO COMPACTO */}
              <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/5 mt-4">
                <div className="space-y-0.5">
                  <Label className="text-sm">Miembro Activo</Label>
                  <p className="text-[10px] text-muted-foreground">
                    El usuario tiene acceso al gimnasio.
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
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="w-full sm:w-auto min-w-32"
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
