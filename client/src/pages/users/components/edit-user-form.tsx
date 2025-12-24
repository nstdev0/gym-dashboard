import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  userUpdateSchema,
  type User,
  type UserUpdate,
} from "../../../../../server/src/domain/entities/user";

export default function EditUserForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserUpdate>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "OWNER") {
      alert("No tienes permiso para editar usuarios");
      navigate("/admin/dashboard/usuarios");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userDetail: User = await apiFetch(`/users/${id}`);
        userDetail.password = "";
        reset(userDetail);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, [id, reset, navigate]);

  const onSubmit: SubmitHandler<UserUpdate> = async (data) => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para editar usuarios");
      }
      await apiFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      navigate("/admin/dashboard/usuarios");
    } catch (error) {
      console.error("Error updating user", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const confirm = window.confirm("Estas seguro de eliminar este usuario?");
      if (!confirm) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontro token");
      }
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para eliminar usuarios");
      }
      await apiFetch(`/users/${id}`, {
        method: "DELETE",
      });
      navigate("/admin/dashboard/usuarios");
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando datos del usuario...</div>;
  }

  return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Editar Usuario</CardTitle>
        <CardDescription>
          Actualiza la información del usuario. Dejar contraseña en blanco para
          mantener la actual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="firstName">
                  Nombres <span className="text-destructive">*</span>
                </FieldLabel>
                <Input {...register("firstName")} placeholder="Nombres" />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Apellidos</FieldLabel>
                <Input {...register("lastName")} placeholder="Apellidos" />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Usuario</FieldLabel>
                <Input {...register("username")} placeholder="Usuario" />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Nueva contraseña (opcional)"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="role">Rol</FieldLabel>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OWNER">Owner</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <span className="text-red-500 text-sm">
                    {errors.role.message}
                  </span>
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
                        className={
                          field.value
                            ? "data-[state=checked]:bg-green-600"
                            : "data-[state=unchecked]:bg-slate-300"
                        }
                      />
                      <span
                        className={`text-sm font-medium ${
                          field.value ? "text-green-600" : "text-slate-500"
                        }`}
                      >
                        {field.value ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </div>
                  )}
                />
              </Field>
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4 gap-2">
            <Button
              variant="destructive"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDelete(id)}
            >
              Eliminar usuario
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
