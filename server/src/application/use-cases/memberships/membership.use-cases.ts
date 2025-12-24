import {
  MembershipInsert,
  MembershipUpdate,
} from "../../../domain/entities/membership";
import { MemberRepository } from "../../../infrastructure/repositories/members/member.repository";
import { MembershipRepository } from "../../../infrastructure/repositories/memberships/membership.repository";
import { PlanRepository } from "../../../infrastructure/repositories/plans/plan.repository";

export class MembershipService {
  constructor(
    private membershipRepository: MembershipRepository,
    private memberRepository: MemberRepository,
    private planRepository: PlanRepository
  ) {}

  findAll = async () => {
    return await this.membershipRepository.findAll();
  };

  create = async (data: MembershipInsert) => {
    const existingMembership =
      await this.membershipRepository.findActiveByMemberId(data.memberId);
    if (existingMembership.length > 0) {
      throw new Error("El miembro ya tiene una membresía activa.");
    }
    const isMemberActive = await this.memberRepository.isActive(data.memberId);
    if (!isMemberActive) {
      throw new Error("El miembro no está activo.");
    }
    const planIsActive = await this.planRepository.isActive(data.planId);
    if (!planIsActive) {
      throw new Error("El plan asociado no está activo.");
    }
    const plan = await this.planRepository.findById(data.planId);
    if (!plan) {
      throw new Error("El plan asociado no existe.");
    }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationInDays);
    const membershipData = { ...data, startDate, endDate };
    return await this.membershipRepository.create(membershipData);
  };

  findById = async (id: string) => {
    return await this.membershipRepository.findById(id);
  };

  update = async (id: string, data: MembershipUpdate) => {
    return await this.membershipRepository.update(id, data);
  };

  delete = async (id: string) => {
    return await this.membershipRepository.delete(id);
  };
}
