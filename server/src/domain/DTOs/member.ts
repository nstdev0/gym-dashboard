import { Member } from "../entities/member";

export type CreateMemberDTO = Omit<Member, "id" | "createdAt" | "updatedAt">;

export type UpdateMemberDTO = Partial<CreateMemberDTO>;
