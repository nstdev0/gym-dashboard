const BASE_API_URL = "http://localhost:4000/api";

export async function apiFetch<T>(
  path: string,
  method: string,
  body?: BodyInit | null | undefined,
  headers?: HeadersInit | undefined
): Promise<T> {
  console.log("Calling APIFETCH", path);
  const isJson = body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof URLSearchParams);
  const config: RequestInit = {
    method,
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: isJson ? JSON.stringify(body) : body,
  };

  const response = await fetch(`${BASE_API_URL}${path}`, config);
  console.log("Response APIFETCH", response);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}
