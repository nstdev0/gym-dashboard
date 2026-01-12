import type { Member } from "./members.dto";
import { MembershipStatusEnum } from "../types/enums";
import type { Plan } from "./plans.dto";

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: MembershipStatusEnum;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  member?: Member;
  plan?: Plan;
}

export interface CreateMembershipDto {
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status?: MembershipStatusEnum;
  price: number;
}

export type UpdateMembershipDto = Partial<CreateMembershipDto>;
