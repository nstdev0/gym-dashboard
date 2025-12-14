import { CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/api/apiFetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SignUpInputs = {
  role: "OWNER" | "ADMIN" | "USER";
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const navigate = useNavigate();

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<SignUpInputs>();

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para registrar usuarios");
      }
      await apiFetch("/auth/sign-up", "POST", data, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      })
    } catch (error) {
      throw new Error("Error al registrar usuario", error as Error);
    }

    navigate("/admin/dashboard/users#");
  };

  return (
    <div className="m-auto w-full h-dvh flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <CardTitle>Registrar usuario</CardTitle>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="jon_doe"
                {...register("username", { required: true, minLength: 3 })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
              <Input
                id="firstName"
                type="text"
                placeholder="Jon"
                {...register("firstName", { required: true, minLength: 3 })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName", { required: true, minLength: 3 })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Correo</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="jon_doe@example.com"
                {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true, minLength: 8 })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Rol</FieldLabel>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-col items-center justify-between gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
