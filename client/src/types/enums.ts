import z from "zod";

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type GenderEnum = z.infer<typeof GenderEnum>;

export const DocTypeEnum = z.enum(["DNI", "CE", "PASSPORT"]);
export type DocTypeEnum = z.infer<typeof DocTypeEnum>;

export const RoleEnum = z.enum(["OWNER", "ADMIN", "STAFF"]);
export type RoleEnum = z.infer<typeof RoleEnum>;

export const MembershipStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "EXPIRED",
  "PAUSED",
]);
export type MembershipStatusEnum = z.infer<typeof MembershipStatusEnum>;
