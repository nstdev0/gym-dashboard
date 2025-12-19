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
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  createMemberSchema,
  type CreateMemberSchema,
} from "../../../../../server/src/lib/lib/validators/member.schema";

export default function NewMemberForm() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting, errors },
      } = useForm<CreateMemberSchema>({
        resolver: zodResolver(createMemberSchema),
      });
    
      const onSubmit: SubmitHandler<CreateMemberSchema> = async (data) => {
        try {
          const role = localStorage.getItem("role")
          if (role !== "OWNER") {
            throw new Error("No tienes permiso para crear miembros")
          }
          await apiFetch(
            "/members",
            "POST",
            data,
            {Authorization: `Bearer ${localStorage.getItem("token")}`}
          );
          navigate("/admin/dashboard/miembros");
        } catch (error) {
          throw new Error("Error al crear miembro", error as Error);
        }
      };

    return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Registrar Nuevo Miembro</CardTitle>
        <CardDescription>
          Ingresa los datos personales para registrar un nuevo miembro en el gimnasio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="firstName">Nombres <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...register("firstName")}
                  placeholder="Nombre"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
                <Input
                  {...register("lastName")}
                  placeholder="Apellido"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="gender">Genero <span className="text-destructive">*</span></FieldLabel>
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
                <FieldLabel htmlFor="height">Altura (cm)</FieldLabel>
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
                <FieldLabel htmlFor="weight">Peso (kg)</FieldLabel>
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
                <FieldLabel htmlFor="docType">Tipo de documento <span className="text-destructive">*</span></FieldLabel>
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
                <FieldLabel htmlFor="docNumber">Numero de documento <span className="text-destructive">*</span></FieldLabel>
                <Input
                  type="text"
                  {...register("docNumber")}
                />
                {errors.docNumber && (
                  <span className="text-red-500 text-sm">{errors.docNumber?.message}</span>
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
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar miembro"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}