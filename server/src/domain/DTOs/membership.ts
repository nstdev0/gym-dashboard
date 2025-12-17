import { Membership } from "../entities/membership";

export type CreateMembershipDTO = Omit<
  Membership,
  "id" | "createdAt" | "updatedAt" | "startDate" | "endDate"
>;

export type UpdateMembershipDTO = Partial<
  Omit<CreateMembershipDTO, "id" | "memberId" | "createdAt" | "updatedAt">
>;
