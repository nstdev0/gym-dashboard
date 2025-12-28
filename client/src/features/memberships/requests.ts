import { apiFetch } from "../../lib/api/apiFetch";
import type { ApiResponse } from "../../../../server/src/types/api";
import type { Membership, MembershipCreateInput, MembershipUpdateInput } from "../../../../server/src/domain/entities/membership";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";

export const getMemberships = async (params: {
  page: number;
  pageSize: number;
  filters?: { search?: string };
}): Promise<ApiResponse<IPageableResult<Membership>>> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });
  if (params.filters?.search) {
    queryParams.append("search", params.filters.search);
  }
  const response: ApiResponse<IPageableResult<Membership>> = await apiFetch<ApiResponse<IPageableResult<Membership>>>(
    `/memberships?${queryParams.toString()}`
  );
  return response;
};

export const getMembership = async ({ id }: { id: string }) => {
  const { data }: ApiResponse<Membership> = await apiFetch<ApiResponse<Membership>>(`/memberships/${id}`);
  return data;
};

export const createMembership = async (data: MembershipCreateInput) => {
  const response: ApiResponse<Membership> = await apiFetch<ApiResponse<Membership>>("/memberships", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateMembership = async ({
  id,
  data,
}: {
  id: string;
  data: MembershipUpdateInput;
}) => {
  return apiFetch<ApiResponse<Membership>>(`/memberships/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteMembership = async (id: string) => {
  return apiFetch<ApiResponse<Membership>>(`/memberships/${id}`, {
    method: "DELETE",
  });
};
