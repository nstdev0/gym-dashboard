import z from "zod";
import { baseSchema, membershipStatus, uuidSchema } from "./base.schema";

export const membershipSchema = baseSchema.merge(
  z.object({
    memberId: uuidSchema,
    planId: uuidSchema,
    startDate: z.date("La fecha de inicio debe ser una fecha válida"),
    endDate: z.date("La fecha de fin debe ser una fecha válida"),
    status: membershipStatus,
  })
);

export const createMembershipSchema = membershipSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMembershipSchema = createMembershipSchema.partial();

export type CreateMembershipSchema = z.infer<typeof createMembershipSchema>;
export type UpdateMembershipSchema = z.infer<typeof updateMembershipSchema>;
export type MembershipSchema = z.infer<typeof membershipSchema>;
