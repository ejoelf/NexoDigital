import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContextBase";
import { ApiError, apiRequest } from "../services/apiClient";
import {
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
} from "../services/authService";
import {
  clearStoredTokens,
  getStoredTokens,
  storeTokens,
} from "../utils/tokenStorage";

function goTo(path) {
  if (window.location.pathname !== path) {
    window.location.href = path;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("initializing");
  const [authError, setAuthError] = useState("");

  const clearSession = useCallback(() => {
    clearStoredTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshSession = useCallback(async () => {
    const { refreshToken } = getStoredTokens();

    if (!refreshToken) {
      clearSession();
      return null;
    }

    try {
      const result = await refreshRequest(refreshToken);
      storeTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      setUser(result.user);
      setStatus("authenticated");
      return result;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const { accessToken, refreshToken } = getStoredTokens();

      if (!accessToken && !refreshToken) {
        if (isMounted) {
          setStatus("unauthenticated");
        }
        return;
      }

      try {
        const result = await meRequest(accessToken);

        if (isMounted) {
          setUser(result.user);
          setStatus("authenticated");
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401 && refreshToken) {
          const refreshed = await refreshSession();

          if (!refreshed && isMounted) {
            setStatus("unauthenticated");
          }
          return;
        }

        if (isMounted) {
          clearSession();
        }
      }
    }

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, refreshSession]);

  const login = useCallback(async ({ email, password }) => {
    setAuthError("");
    setStatus("authenticating");

    try {
      const result = await loginRequest({ email, password });
      storeTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      setUser(result.user);
      setStatus("authenticated");
      goTo("/crm/dashboard");
    } catch (error) {
      setStatus("unauthenticated");
      setAuthError(
        error instanceof ApiError && error.status === 401
          ? "Credenciales invalidas. Revisá email y password."
          : "No se pudo iniciar sesion. Verificá que el backend esté disponible.",
      );
    }
  }, []);

  const logout = useCallback(async () => {
    const { refreshToken } = getStoredTokens();

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } finally {
      clearSession();
      goTo("/crm/login");
    }
  }, [clearSession]);

  const authenticatedRequest = useCallback(
    async (path, options = {}) => {
      const { accessToken } = getStoredTokens();

      try {
        return await apiRequest(path, {
          ...options,
          accessToken,
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          const refreshed = await refreshSession();

          if (!refreshed) {
            goTo("/crm/login");
            throw error;
          }

          return apiRequest(path, {
            ...options,
            accessToken: refreshed.accessToken,
          });
        }

        throw error;
      }
    },
    [refreshSession],
  );

  const value = useMemo(
    () => ({
      user,
      status,
      authError,
      isAuthenticated: status === "authenticated",
      isInitializing: status === "initializing",
      isAuthenticating: status === "authenticating",
      login,
      logout,
      authenticatedRequest,
    }),
    [authError, authenticatedRequest, login, logout, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
