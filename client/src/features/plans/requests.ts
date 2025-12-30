import type { Plan, PlanCreateInput, PlanUpdateInput } from "@/entities/plan";
import type { IPageableResult } from "../../../../server/src/application/common/pagination";
import type { ApiResponse } from "../../../../server/src/types/api";
import { apiFetch } from "../../lib/api/api-fetch";

export const getPlans = async (params: {
  page: number;
  pageSize: number;
  filters?: { search?: string; isActive?: boolean };
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
    body: JSON.stringify(data),
  });
};

export const deletePlan = async (id: string) => {
  return apiFetch<ApiResponse<Plan>>(`/plans/${id}`, {
    method: "DELETE",
  });
};
