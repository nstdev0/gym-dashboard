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
  createUserSchema,
  type CreateUserSchema,
} from "../../../../../server/src/lib/validators/user.schema";

export default function NewUserForm() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting, errors },
      } = useForm<CreateUserSchema>({
        resolver: zodResolver(createUserSchema) as any,
        defaultValues: {
            isActive: true,
            role: "STAFF"
        }
      });
    
      const onSubmit: SubmitHandler<CreateUserSchema> = async (data) => {
        try {
          const role = localStorage.getItem("role")
          if (role !== "OWNER") {
            throw new Error("No tienes permiso para crear usuarios")
          }
          await apiFetch(
            "/users",
            "POST",
            JSON.stringify(data),
            {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            }
          );
          navigate("/admin/dashboard/usuarios");
        } catch (error) {
           console.error("Error al crear usuario", error);
           alert("Error al crear usuario. Verifica los datos o permisos.");
        }
      };

    return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Registrar Nuevo Usuario</CardTitle>
        <CardDescription>
          Ingresa los datos para registrar un nuevo usuario en el sistema.
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
                <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
                <Input
                  {...register("username")}
                  placeholder="Username"
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">{errors.username.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email <span className="text-destructive">*</span></FieldLabel>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </Field>
               <Field>
                <FieldLabel htmlFor="password">Contraseña <span className="text-destructive">*</span></FieldLabel>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="*******"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="role">Rol</FieldLabel>
                <Controller
                  control={control}
                  name="role"
                  defaultValue="STAFF"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STAFF">Staff</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                         {/* Owner usually shouldn't be valid to create by UI easily but keeping it safe */}
                        <SelectItem value="OWNER">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <span className="text-red-500 text-sm">{errors.role.message}</span>
                )}
              </Field>
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
