import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
  updateMemberSchema,
  type MemberSchema,
  type UpdateMemberSchema,
} from "../../../../../server/src/lib/lib/validators/member.schema";
import { Switch } from "@/components/ui/switch";

export default function EditMemberForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdateMemberSchema>({
    resolver: zodResolver(updateMemberSchema),
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "OWNER") {
      throw new Error("No tienes permiso para editar miembros"); // Ideally handle ui feedback
    }

    const fetchMemberDetails = async () => {
      try {
        const memberDetail: MemberSchema = await apiFetch(
          `/members/${id}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        );

        // Prepara los datos para el form
        // birthDate viene como string ISO o Date, el input date necesita YYYY-MM-DD
        let formattedDate: string | undefined = undefined;
        if (memberDetail.birthDate) {
           formattedDate = new Date(memberDetail.birthDate).toISOString().split("T")[0];
        }

        reset({
          ...memberDetail,
          birthDate: formattedDate, 
        });
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemberDetails();
  }, [id, reset]);

  const onSubmit: SubmitHandler<UpdateMemberSchema> = async (data) => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para editar miembros");
      }
      
      const updatedMemberData = {
        ...data,
      };

      await apiFetch(`/members/${id}`, "PUT", updatedMemberData, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });
      navigate("/admin/dashboard/miembros");
    } catch (error) {
      console.error("Error updating member", error);
      alert("Error al actualizar miembro")
    }
  };

  
  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar este miembro?")
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para eliminar miembros");
      }
      await apiFetch(`/members/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      const newData = data.filter((member) => member.id !== id);
      setData(newData);
    } catch (error) {
      console.error("Error eliminando miembro:", error);
    }
    navigate("/admin/dashboard/miembros");
  }
  
  if (isLoading) {
    return <div className="p-4 text-center">Cargando datos del miembro...</div>;
  }
  
  return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Editar Miembro</CardTitle>
        <CardDescription>
          Actualiza la información del miembro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="firstName">Nombres</FieldLabel>
                <Input
                  {...register("firstName")}
                  placeholder="Nombres"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Apellidos</FieldLabel>
                <Input
                  {...register("lastName")}
                  placeholder="Apellidos"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="gender">Genero</FieldLabel>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Genero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Masculino</SelectItem>
                        <SelectItem value="FEMALE">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <span className="text-red-500 text-sm">{errors.gender.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="birthDate">Fecha de nacimiento</FieldLabel>
                <Input
                  type="date"
                  {...register("birthDate")}
                />
                {errors.birthDate && (
                  <span className="text-red-500 text-sm">{errors.birthDate.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="height">Altura</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("height", { valueAsNumber: true })}
                />
                {errors.height && (
                  <span className="text-red-500 text-sm">{errors.height.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="weight">Peso</FieldLabel>
                <Input
                  type="number"
                  step="0.1"
                  {...register("weight", { valueAsNumber: true })}
                />
                {errors.weight && (
                  <span className="text-red-500 text-sm">{errors.weight.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="docType">Tipo de documento</FieldLabel>
                <Controller
                  control={control}
                  name="docType"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                        <SelectItem value="CE">Cédula de extranjería</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.docType && (
                  <span className="text-red-500 text-sm">{errors.docType.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="docNumber">Numero de documento</FieldLabel>
                <Input
                  type="text"
                  {...register("docNumber")}
                />
                {errors.docNumber && (
                  <span className="text-red-500 text-sm">{errors.docNumber.message}</span>
                )}
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="phoneNumber">Numero de telefono</FieldLabel>
                <Input
                  type="tel"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>
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
              Eliminar miembro
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
