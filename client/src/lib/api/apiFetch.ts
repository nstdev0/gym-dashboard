import { config } from "../../config/config";

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
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unknown error occurred while processing the API response."
      );
    }
    throw new Error(errorMessage);
  }
  return response.json();
}
