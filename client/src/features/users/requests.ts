import type { User, UserCreateInput, UserUpdateInput } from "@/entities/user";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";
import type { ApiResponse } from "../../../../server/src/types/api";
import { apiFetch } from "../../lib/api/api-fetch";

export const getUsers = async (params: {
  page: number;
  pageSize: number;
  filters?: { search?: string; role?: string };
}) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });

  if (params.filters?.search) {
    queryParams.append("search", params.filters.search);
  }

  // if (params.filters?.role) {
  //   queryParams.append("role", params.filters.role);
  // }

  return apiFetch<ApiResponse<IPageableResult<User>>>(
    `/users?${queryParams.toString()}`
  );
};

export const getUser = async (id: string) => {
  return apiFetch<ApiResponse<User>>(`/users/${id}`);
};

export const createUser = async (data: UserCreateInput) => {
  return apiFetch<ApiResponse<User>>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UserUpdateInput;
}) => {
  return apiFetch<ApiResponse<User>>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: string) => {
  return apiFetch<ApiResponse<User>>(`/users/${id}`, {
    method: "DELETE",
  });
};
