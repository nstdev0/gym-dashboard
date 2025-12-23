import z from "zod";
import { baseZ } from "./_base";
import { MembershipStatusEnum } from "../enums/membership-status.enum";

export const membershipSchema = z
  .object({
    memberId: z.number("El ID del miembro es inválido"),
    planId: z.number("El ID del plan es inválido"),
    startDate: z.date("La fecha de inicio es inválida"),
    endDate: z.date("La fecha de fin es inválida"),
    status: MembershipStatusEnum,
  })
  .extend(baseZ.shape);

export type Membership = z.infer<typeof membershipSchema>;

export const membershipInsertSchema = membershipSchema.pick({
  memberId: true,
  planId: true,
  startDate: true,
  endDate: true,
  status: true,
});

export type MembershipInsert = z.infer<typeof membershipInsertSchema>;

export const membershipUpdateSchema = membershipInsertSchema.partial();

export type MembershipUpdate = z.infer<typeof membershipUpdateSchema>;
