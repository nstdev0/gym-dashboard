import { config } from "../../config/config";
import { ApiError } from "./api-error";

const BASE_API_URL = config.BASE_API_URL || "http://localhost:4000/api";

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_API_URL}${path}`, {
    method: init.method || "GET",
    ...init,
    headers: {
      "Content-Type": "Application/Json",
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  // Manejo de respuesta vacía
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  // Si la respuesta no es OK (Status 4xx o 5xx)
  if (!response.ok) {
    const errorMessage = data?.message || "Ocurrió un error inesperado";
    const errorDetails = data?.errors || undefined;
    const errorCode = data?.code || undefined;

    throw new ApiError(errorMessage, response.status, errorDetails, errorCode);
  }

  return data as T;
}
