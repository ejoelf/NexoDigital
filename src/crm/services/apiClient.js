const fallbackApiBaseUrl = "http://localhost:4000";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? fallbackApiBaseUrl;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    accessToken,
    headers = {},
    signal,
  } = options;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok || data.ok === false) {
    throw new ApiError(
      data.message ?? "No se pudo completar la solicitud.",
      response.status,
      data,
    );
  }

  return data;
}
