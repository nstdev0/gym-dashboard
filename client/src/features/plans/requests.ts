import { apiFetch } from "@/lib/api/apiFetch";
import type { ApiResponse } from "../../../../../server/src/types/api";
import type { Plan, PlanCreateInput, PlanUpdateInput } from "../../../../../server/src/domain/entities/plan";
import type { IPageableResult } from "../../../../../server/src/application/common/pagination";

export const getPlans = async (params: {
  page: number;
  pageSize: number;
  filters?: { search?: string, isActive?: boolean };
}) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });

  if (params.filters?.search) {
    queryParams.append("search", params.filters.search);
  }
  
  if (params.filters?.isActive !== undefined) {
      queryParams.append("isActive", params.filters.isActive.toString());
  }

  return apiFetch<ApiResponse<IPageableResult<Plan>>>(
    `/plans?${queryParams.toString()}`
  );
};

export const getPlan = async (id: string) => {
  return apiFetch<ApiResponse<Plan>>(`/plans/${id}`);
};

export const createPlan = async (data: PlanCreateInput) => {
  return apiFetch<ApiResponse<Plan>>("/plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updatePlan = async ({
  id,
  data,
}: {
  id: string;
  data: PlanUpdateInput;
}) => {
  return apiFetch<ApiResponse<Plan>>(`/plans/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deletePlan = async (id: string) => {
  return apiFetch<ApiResponse<Plan>>(`/plans/${id}`, {
    method: "DELETE",
  });
};
