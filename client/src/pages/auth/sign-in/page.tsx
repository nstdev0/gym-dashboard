import { apiFetch } from "@/api/apiFetch";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { CardTitle } from "@/components/ui/card";

type Inputs = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response: { token: string; role: string } = await apiFetch<{
        token: string;
        role: string;
      }>("/auth/sign-in", "POST", data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      navigate("/admin/dashboard/miembros");
    } catch (error) {
      throw new Error("Error al iniciar sesión", error as Error);
    }
  };

  return (
    <div className="m-auto w-full h-dvh flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <CardTitle>Iniciar sesión</CardTitle>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Correo</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="correo@ejemplo.com"
                {...register("email", { required: true })}
              />
              <FieldDescription>
                El correo electrónico asociado a tu cuenta.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <FieldDescription>
                Debe tener al menos 6 caracteres.
              </FieldDescription>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true, minLength: 6 })}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-col items-center justify-between gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <Link to="/auth/sign-up" className="w-full text-center text-sm">
              {isSubmitting
                ? "Registrarse..."
                : "¿No tienes una cuenta? Registrate aqui"}
            </Link>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
