import z from "zod";
import { baseZ } from "./_base";
import { MembershipStatusEnum } from "../enums/membership-status.enum";
import { type Plan } from "./plan";
import { type Member } from "./member";

export const membershipSchema = z
  .object({
    memberId: z.cuid2("El ID del miembro es inválido"),
    planId: z.cuid2("El ID del plan es inválido"),
    startDate: z
      .preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date())
      .default(new Date()),
    endDate: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date()
    ),
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

export type membershipDetailSchema = Membership & {
  member: Member;
  plan: Plan;
};
