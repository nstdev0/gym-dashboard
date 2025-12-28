import { Membership } from "../../domain/entities/membership";
import { Prisma } from "../../generated/prisma/client";
import { IBaseRepository } from "./base-repository.interface";

export type MembershipsFilters = {
  search?: string;
};

export interface IMembershipRepository
  extends IBaseRepository<Membership, MembershipsFilters> {
  findActiveByMemberId(memberId: string): Prisma.PrismaPromise<Membership>;
}
