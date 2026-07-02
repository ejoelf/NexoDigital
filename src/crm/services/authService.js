import { apiRequest } from "./apiClient";

export function loginRequest({ email, password }) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function refreshRequest(refreshToken) {
  return apiRequest("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export function logoutRequest(refreshToken) {
  return apiRequest("/api/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export function meRequest(accessToken) {
  return apiRequest("/api/auth/me", {
    accessToken,
  });
}
