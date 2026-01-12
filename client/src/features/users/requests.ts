import type { User, CreateUserDto, UpdateUserDto } from "@/DTOs/users.dto";
import { apiFetch } from "../../lib/api/api-fetch";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";

export const getUsers = async (params: {
  page: number;
  pageSize: number;
  filters?: { search?: string; role?: string };
}): Promise<IPageableResult<User>> => {
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

  return apiFetch<IPageableResult<User>>(`/users?${queryParams.toString()}`);
};

export const getUser = async (id: string) => {
  return apiFetch<User>(`/users/${id}`);
};

export const createUser = async (data: CreateUserDto) => {
  return apiFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserDto;
}) => {
  return apiFetch<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: string) => {
  return apiFetch<User>(`/users/${id}`, {
    method: "DELETE",
  });
};
