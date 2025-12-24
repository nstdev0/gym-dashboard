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
import { useEffect, useState } from "react";
import type { Plan } from "../../../../../server/src/domain/entities/plan";
import type { Member } from "../../../../../server/src/domain/entities/member";
import {
  membershipInsertSchema,
  type MembershipInsert,
} from "../../../../../server/src/domain/entities/membership";

export default function NewMembershipForm() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersData: Member[] = await apiFetch("/members", {
          method: "GET",
        });
        const plansData: Plan[] = await apiFetch("/plans", {
          method: "GET",
        });
        setMembers(membersData);
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(membershipInsertSchema),
    defaultValues: {
      memberId: "",
      planId: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "ACTIVE",
    },
  });

  const onSubmit: SubmitHandler<MembershipInsert> = async (data) => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "OWNER") {
        throw new Error("No tienes permiso para crear membresias");
      }
      await apiFetch("/memberships", {
        method: "POST",
        body: JSON.stringify(data),
      });
      navigate("/admin/dashboard/membresias");
    } catch (error) {
      console.error("Error al crear membresia", error);
      alert("Error al crear membresia");
    }
  };

  return (
    <Card className="m-auto w-full max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle>Registrar Nueva Membresía</CardTitle>
        <CardDescription>
          Selecciona el miembro y el plan para crear una nueva suscripción.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel htmlFor="memberId">
                  Miembro <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="memberId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar miembro" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id.toString()}
                          >
                            {member.firstName} {member.lastName} (
                            {member.docNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.memberId && (
                  <span className="text-red-500 text-sm">
                    {errors.memberId.message}
                  </span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="planId">
                  Plan <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="planId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id.toString()}>
                            {plan.name} - S/{plan.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.planId && (
                  <span className="text-red-500 text-sm">
                    {errors.planId.message}
                  </span>
                )}
              </Field>
            </div>
          </FieldSet>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar membresía"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
