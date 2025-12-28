import {
  Membership,
  MembershipCreateInput,
  MembershipUpdateInput,
} from "../../../domain/entities/membership";
import { IPageableResult } from "../../common/pagination";
import { IMembershipRepository, MembershipsFilters } from "../../repositories/memberships-repository.interface";

export class MembershipsService {
  constructor(private membershipsRepository: IMembershipRepository) {}

  findAll = async (request: {
    page: number;
    pageSize: number;
    filters?: MembershipsFilters;
  }): Promise<IPageableResult<Membership>> => {
    const includes = {
        member: true,
        plan: true
    };
    try {
      const response = await this.membershipsRepository.findAll(request, includes);
      if (!response) {
        throw new Error("No memberships found");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: MembershipCreateInput): Promise<Membership> => {
    // Logic for active memberships check could go here
    // For now simple create
    return await this.membershipsRepository.create(data);
  };

  findById = async (id: string): Promise<Membership | null> => {
    const includes = {
        member: true,
        plan: true
    };
    return await this.membershipsRepository.findById(id, includes);
  };

  update = async (
    id: string,
    data: MembershipUpdateInput
  ): Promise<Membership | null> => {
    return await this.membershipsRepository.update(id, data);
  };

  delete = async (id: string): Promise<Membership | null> => {
    return await this.membershipsRepository.delete(id);
  };
}
