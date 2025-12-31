import type {
  Member,
  MemberCreateInput,
  MemberUpdateInput,
} from "@server/entities/member";
import { type ApiResponse } from "../../../../server/src/types/api";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";
import { apiFetch } from "../../lib/api/api-fetch";

export async function getMembers(params: {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
}): Promise<IPageableResult<Member>> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params.filters?.search)
    queryParams.append("search", params.filters.search as string);
  const response = await apiFetch<IPageableResult<Member>>(
    `/members?${queryParams.toString()}`
  );
  return response;
}

export async function getMember(request: { id: string }): Promise<Member> {
  const data = await apiFetch<Member>(`/members/${request.id}`);

  return data;
}

export async function createMember(data: MemberCreateInput) {
  const response: ApiResponse<Member> = await apiFetch(`/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
}

export async function updateMember(id: string, data: MemberUpdateInput) {
  const response: ApiResponse<Member> = await apiFetch(`/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response;
}

export async function deleteMember(id: string) {
  const response: ApiResponse<null> = await apiFetch(`/members/${id}`, {
    method: "DELETE",
  });

  return response;
}
