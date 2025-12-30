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
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "@/features/users/mutations";
import {
  userCreateSchema,
  type UserCreateInput,
} from "../../../../../server/src/domain/entities/user";

import { UserPlus, Save, Undo2, Mail, Lock, User, Shield } from "lucide-react";

export default function NewUserForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      role: "STAFF" as const,
      isActive: true,
    },
  });

  const { mutate, isPending } = useCreateUser();

  const onSubmit = (data: UserCreateInput) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/admin/dashboard/usuarios");
      },
    });
  };

  return (
    <Card className="mx-auto w-full max-w-4xl border-border/60 shadow-md">
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Crear Nuevo Usuario</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Registra un nuevo administrador o miembro del staff.
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
                  <User className="h-3.5 w-3.5" />
                  <h3>Datos Personales</h3>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs">Nombres <span className="text-destructive">*</span></Label>
                    <Input className="h-9 text-sm" {...register("firstName")} placeholder="Ej: Juan" />
                    <ErrorMessage message={errors.firstName?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs">Apellidos</Label>
                    <Input 
                      className="h-9 text-sm" 
                      {...register("lastName", {
                        setValueAs: (v) => (v === "" ? null : v),
                      })} 
                      placeholder="Ej: Pérez" 
                    />
                    <ErrorMessage message={errors.lastName?.message} />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs">Nombre de Usuario</Label>
                  <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="h-9 pl-9 text-sm" 
                        {...register("username", {
                          setValueAs: (v) => (v === "" ? null : v),
                        })} 
                        placeholder="ej: juanperez" 
                      />
                  </div>
                  <ErrorMessage message={errors.username?.message} />
               </div>
            </div>

            {/* Columna Derecha: Acceso y Rol */}
            <div className="space-y-5">
               <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <Shield className="h-3.5 w-3.5" />
                  <h3>Credenciales y Acceso</h3>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">Correo Electrónico <span className="text-destructive">*</span></Label>
                  <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="h-9 pl-9 text-sm" type="email" {...register("email")} placeholder="correo@ejemplo.com" />
                  </div>
                  <ErrorMessage message={errors.email?.message} />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs">Contraseña <span className="text-destructive">*</span></Label>
                  <div className="relative">
                      <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="h-9 pl-9 text-sm" type="password" {...register("password")} placeholder="******" />
                  </div>
                  <ErrorMessage message={errors.password?.message} />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                     <Label className="text-xs">Rol</Label>
                     <Controller
                        control={control}
                        name="role"
                        render={({ field }) => (
                           <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-9 text-sm">
                                 <SelectValue placeholder="Seleccionar rol" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="ADMIN">Administrador</SelectItem>
                                 <SelectItem value="STAFF">Staff</SelectItem>
                                 {/* <SelectItem value="OWNER">Owner</SelectItem> Generally protected */}
                              </SelectContent>
                           </Select>
                        )}
                     />
                     <ErrorMessage message={errors.role?.message} />
                  </div>

                  <div className="flex flex-col justify-end pb-1.5">
                      <div className="flex items-center justify-between rounded-lg border p-2 bg-muted/5 h-9">
                        <Label className="text-xs cursor-pointer" htmlFor="isActive-switch">Activo</Label> 
                        <Controller
                          control={control}
                          name="isActive"
                          render={({ field }) => (
                            <Switch
                              id="isActive-switch"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="scale-75"
                            />
                          )}
                        />
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t mt-2">
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
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
