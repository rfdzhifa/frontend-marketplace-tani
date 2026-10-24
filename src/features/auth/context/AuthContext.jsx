import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AUTH_STORAGE_KEYS,
  AUTH_UNAUTHORIZED_EVENT,
} from "../../../services/httpClient";
import { ROUTES } from "../../../constants/routes";
import { getProfile } from "../api/auth.api";
import { AuthContext } from "./authContextValue";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    return null;
  }
}

function readStoredToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(() => readStoredUser());
  const [isInitializing, setIsInitializing] = useState(() =>
    Boolean(readStoredToken() && !readStoredUser()),
  );

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
  }, [queryClient]);

  const login = useCallback(
    (nextToken, nextUser) => {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, nextToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
      queryClient.setQueryData(["auth", "profile"], nextUser);
    },
    [queryClient],
  );

  const updateUser = useCallback(
    (nextUser) => {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(nextUser));
      setUser(nextUser);
      queryClient.setQueryData(["auth", "profile"], nextUser);
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearSession();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [clearSession, navigate]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      toast.error("Sesi berakhir, silakan masuk lagi");
      navigate(ROUTES.LOGIN, { replace: true });
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [clearSession, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function verifyStoredSession() {
      if (!token) {
        if (isMounted) {
          setIsInitializing(false);
        }
        return;
      }

      try {
        const response = await getProfile();
        if (isMounted && response?.data) {
          updateUser(response.data);
        }
      } catch (error) {
        if (isMounted && error?.response?.status === 401) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    verifyStoredSession();

    return () => {
      isMounted = false;
    };
  }, [token, updateUser, clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      logout,
      updateUser,
    }),
    [user, token, isInitializing, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
