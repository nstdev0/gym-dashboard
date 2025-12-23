import z from "zod";

export const MembershipStatusEnum = z.enum(
  ["ACTIVE", "INACTIVE", "EXPIRED", "PAUSED"],
  {
    error: () => {
      return "El estado de la membresía debe ser ACTIVE, INACTIVE, EXPIRED o PAUSED";
    },
  }
);

export type MembershipStatus = z.infer<typeof MembershipStatusEnum>;
