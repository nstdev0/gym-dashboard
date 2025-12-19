const BASE_API_URL = "http://localhost:4000/api";

export async function apiFetch<T>(
  path: string,
  method: string,
  body?: any,
  headers?: HeadersInit | undefined
): Promise<T> {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  };

  const response = await fetch(`${BASE_API_URL}${path}`, config);
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
        const errorData = await response.json();
        if (errorData.message) {
            errorMessage = errorData.message;
        }
    } catch (error) {
        throw new Error(error.message);
    }
    throw new Error(errorMessage);
  }
  return response.json();
}
