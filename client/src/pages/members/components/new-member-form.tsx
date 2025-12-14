import { apiFetch } from "@/api/apiFetch"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"

interface NewMemberForm {
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
    birthDate: Date;
    height: number;
    weight: number;
    docType: "DNI" | "PASSPORT" | "CE";
    docNumber: string;
    phoneNumber: string;
}

export default function NewMemberForm() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
      } = useForm<NewMemberForm>();
    
      const onSubmit: SubmitHandler<NewMemberForm> = async (data) => {
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
    <div className="m-auto w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
              <Input {...register("firstName", { required: true, minLength: 2, maxLength: 50 })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
              <Input {...register("lastName", { required: true, minLength: 2, maxLength: 50 })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="gender">Genero</FieldLabel>
              <Controller
                control={control}
                name="gender"
                defaultValue="MALE"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </Field>
            <Field>
              <FieldLabel htmlFor="birthDate">Fecha de nacimiento</FieldLabel>
              <Input type="date" {...register("birthDate", { required: true, valueAsDate: true })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="height">Altura</FieldLabel>
              <Input type="number" step="0.01" {...register("height", { required: true, valueAsNumber: true })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="weight">Peso</FieldLabel>
              <Input type="number" step="0.1" {...register("weight", { required: true, valueAsNumber: true })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="docType">Tipo de documento</FieldLabel>
              <Controller
                control={control}
                name="docType"
                defaultValue="DNI"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </Field>
            <Field>
              <FieldLabel htmlFor="docNumber">Numero de documento</FieldLabel>
              <Input type="text" {...register("docNumber", { required: true })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phoneNumber">Numero de telefono</FieldLabel>
              <Input type="tel" {...register("phoneNumber", { required: true })}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registrando miembro..." : "Registrar miembro"}
        </Button>
      </form>
    </div>
  )
}   