import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/FormError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "@/features/users/mutations";
import {
  userUpdateSchema,
  type UserUpdateInput,
} from "../../../../../server/src/domain/entities/user";
import {
  Save,
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { useAuth, type User } from "@/context/AuthContext";

export default function ProfileForm({ user }: { user: User }) {
  const { checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      username: user.username || undefined,
      email: user.email || undefined,
      password: "",
      role: user.role || undefined,
      isActive: true, // Always active for self-edit
    },
  });

  const { mutate, isPending } = useUpdateUser();

  const onSubmit = (data: UserUpdateInput) => {
    if (!user?.id) return;

    // Filter out empty password if not changed
    if (!data.password) {
      delete data.password;
    }

    // Prevent changing role or status manually in profile
    // Although the backend should enforce this, we also sanitize here
    const cleanData = {
      ...data,
      role: user.role, // Keep original role
      isActive: true, // Keep active
    };

    mutate(
      { id: user.id, data: cleanData },
      {
        onSuccess: async () => {
          toast.success("Perfil actualizado correctamente");
          await checkAuth(); // Refresh user context
          reset({ ...cleanData, password: "" }); // Reset form state
        },
        onError: () => {
          toast.error("Error al actualizar el perfil");
        },
      }
    );
  };

  if (!user)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Card className="mx-auto w-full max-w-4xl border-border/60 shadow-md">
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Mi Perfil</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Administra tu información personal y de acceso.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda: Datos Personales */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <UserIcon className="h-3.5 w-3.5" />
                <h3>Datos Personales</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs">
                    Nombres <span className="text-destructive">*</span>
                  </Label>
                  <Input className="h-9 text-sm" {...register("firstName")} />
                  <ErrorMessage message={errors.firstName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs">
                    Apellidos
                  </Label>
                  <Input
                    className="h-9 text-sm"
                    {...register("lastName", {
                      setValueAs: (v) => (v === "" ? null : v),
                    })}
                  />
                  <ErrorMessage message={errors.lastName?.message} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs">
                  Nombre de Usuario
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-9 pl-9 text-sm"
                    {...register("username", {
                      setValueAs: (v) => (v === "" ? null : v),
                    })}
                  />
                </div>
                <ErrorMessage message={errors.username?.message} />
              </div>
            </div>

            {/* Columna Derecha: Acceso y Rol */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                <h3>Credenciales</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">
                  Correo Electrónico <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-9 pl-9 text-sm"
                    type="email"
                    {...register("email")}
                    disabled // Email usually shouldn't be changed easily in profile without verification? Let's allow edit but user should know implications. Wait, let's keep it editable for now as per other form.
                  />
                </div>
                <ErrorMessage message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs">
                  Nueva Contraseña (Opcional)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-9 pl-9 text-sm"
                    type="password"
                    {...register("password")}
                    placeholder="Dejar en blanco para no cambiar"
                  />
                </div>
                <ErrorMessage message={errors.password?.message} />
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Tu Rol: {user.role}</p>
                <p>
                  Los permisos y roles son gestionados por el administrador.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-2">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !isDirty}
              className="w-full sm:w-auto min-w-32"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
