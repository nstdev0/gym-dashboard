import type { Member, MemberCreateInput, MemberUpdateInput } from "@/entities/member";
import { type ApiResponse } from "../../../../server/src/types/api";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";
import { apiFetch } from "../../lib/api/apiFetch";

export async function getMembers(request: {
  filters?: Record<string, unknown>;
  page: number;
  pageSize: number;
}): Promise<ApiResponse<IPageableResult<Member>>> {
  const params = new URLSearchParams();
  params.append("page", request.page.toString() || "1");
  params.append("pageSize", request.pageSize.toString() || "10");
  if (request.filters?.search) {
    params.append("search", request.filters.search as string);
  }
  const response: ApiResponse<IPageableResult<Member>> = await apiFetch(
    `/members?${params.toString()}`
  );
  return response;
}

export async function getMember(request: { id: string }): Promise<Member> {
  const { data }: ApiResponse<Member> = await apiFetch(
    `/members/${request.id}`
  );

  return data;
}

export async function createMember(data: MemberCreateInput) {
  const response: ApiResponse<Member> = await apiFetch(`/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function updateMember(id: string, data: MemberUpdateInput) {
  const response: ApiResponse<Member> = await apiFetch(`/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function deleteMember(id: string) {
  const response: ApiResponse<null> = await apiFetch(`/members/${id}`, {
    method: "DELETE",
  });

  return response.data;
}
