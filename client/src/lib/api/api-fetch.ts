import type { ApiResponse } from "../../../../server/src/types/api";
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

  const apiResponse = await response.json().catch(() => {
    console.log("Ocurrio un error en el parseo de la respuesta");
  });

  // Si la respuesta no es OK (Status 4xx o 5xx)
  if (!response.ok) {
    const errorMessage = apiResponse?.message || "Ocurrió un error inesperado";
    const errorDetails = apiResponse?.errors || undefined;
    const errorCode = apiResponse?.code || undefined;

    throw new ApiError(errorMessage, response.status, errorDetails, errorCode);
  }

  if (!validateBackendResponse<T>(apiResponse)) {
    throw new Error(
      "La respuesta de la api no coincide con el formato esperado"
    );
  }

  return apiResponse.data as T;
}

function validateBackendResponse<T>(
  response: unknown
): response is ApiResponse<T> {
  if (!response || typeof response !== "object") {
    return false;
  }
  return "isSuccess" in response;
}
