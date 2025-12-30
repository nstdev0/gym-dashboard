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
import { Skeleton } from "@/components/ui/skeleton";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  memberUpdateSchema,
  type MemberUpdateInput,
} from "../../../../../server/src/domain/entities/member";
import { useDeleteMember, useUpdateMember } from "@/features/members/mutations";
import { getMember } from "@/features/members/requests";

import {
  User,
  CreditCard,
  Activity,
  Phone,
  Mail,
  Save,
  Undo2,
  Trash2,
  AlertCircle,
} from "lucide-react";

export default function EditMemberForm({ id }: { id: string }) {
  const navigate = useNavigate();

  // 1. Carga de datos
  const {
    data: member,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getMember({ id }),
    queryKey: ["member", id],
  });

  // 2. Definición del Formulario
  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(memberUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      docType: "DNI",
      docNumber: "",
      gender: "MALE",
      birthDate: "",
      height: null,
      weight: null,
      phoneNumber: "",
      email: null,
      isActive: true,
    },
  });

  // 3. Efecto para rellenar el formulario cuando llegan los datos
  useEffect(() => {
    if (member) {
      reset({
        ...member,
        // Formatear fecha para input type="date" (YYYY-MM-DD)
        gender: member.gender,
        birthDate: member.birthDate
          ? new Date(member.birthDate).toISOString().split("T")[0]
          : "",
        // Asegurar que nulos sean null para inputs controlados
        email: member.email || "",
        phoneNumber: member.phoneNumber || "",
        height: member.height || null,
        weight: member.weight || null,
      });
    }
  }, [member, reset]);

  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();

  const onSubmit: SubmitHandler<MemberUpdateInput> = (data) => {
    // Limpiamos strings vacíos a null antes de enviar si es necesario,
    // aunque Zod coerce debería encargarse.
    updateMember(
      { id, data },
      { onSuccess: () => navigate("/admin/dashboard/miembros") }
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este miembro? Esta acción no se puede deshacer."
      )
    ) {
      deleteMember(
        { id },
        { onSuccess: () => navigate("/admin/dashboard/miembros") }
      );
    }
  };

  // --- ESTADO DE CARGA (SKELETON) ---
  if (isLoading) return <EditMemberSkeleton />;

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
              <User className="h-5 w-5" />
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
                          value={field.value}
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
                  <User className="h-3.5 w-3.5" />
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
                          onValueChange={field.onChange}
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

          {/* BARRA DE ACCIONES INFERIOR */}
          <div className="flex justify-between items-center pt-6 border-t mt-6">
            {/* Botón Eliminar a la izquierda (Seguridad) */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "..." : "Eliminar"}
            </Button>

            {/* Acciones principales a la derecha */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                disabled={isUpdating || isSubmitting}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating || isSubmitting}
                className="min-w-35"
              >
                {isUpdating || isSubmitting ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EditMemberSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-6xl border-border/60">
      <CardHeader className="border-b py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-60" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-9 col-span-1" />
              <Skeleton className="h-9 col-span-2" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
