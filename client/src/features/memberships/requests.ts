import { apiFetch } from "../../lib/api/api-fetch";
import type {
  Membership,
  MembershipCreateInput,
  MembershipUpdateInput,
} from "../../../../server/src/domain/entities/membership";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";

export const getMemberships = async (params: {
  page: number;
  pageSize: number;
  filters?: { search?: string };
}): Promise<IPageableResult<Membership>> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });
  if (params.filters?.search) {
    queryParams.append("search", params.filters.search);
  }
  const response = await apiFetch<IPageableResult<Membership>>(
    `/memberships?${queryParams.toString()}`
  );
  return response;
};

export const getMembership = async ({ id }: { id: string }) => {
  const data = await apiFetch<Membership>(`/memberships/${id}`);
  return data;
};

export const createMembership = async (data: MembershipCreateInput) => {
  const response = await apiFetch<Membership>("/memberships", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const updateMembership = async ({
  id,
  data,
}: {
  id: string;
  data: MembershipUpdateInput;
}) => {
  return apiFetch<Membership>(`/memberships/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMembership = async (id: string) => {
  return apiFetch<Membership>(`/memberships/${id}`, {
    method: "DELETE",
  });
};
