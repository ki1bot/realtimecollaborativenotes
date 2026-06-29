"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/app/lib/api";
import type { LoginPayload, RegisterPayload, User } from "@/app/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  googleClientId: string;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

const clearBrowserSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getSavedUser = () => {
  const savedUser = sessionStorage.getItem(USER_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const logout = useCallback(() => {
    clearBrowserSession();
    setToken(null);
    setUser(null);
  }, []);

  const saveSession = useCallback((data: { token: string; user: User }) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  useEffect(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    const savedToken = sessionStorage.getItem(TOKEN_KEY);
    const savedUser = getSavedUser();

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    if (savedUser) {
      setUser(savedUser);
    }

    authApi
      .me()
      .then((data) => {
        setUser(data.user);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [logout]);

  const login = async (payload: LoginPayload) => {
    const data = await authApi.login(payload);
    saveSession(data);
  };

  const loginWithGoogle = async (code: string) => {
    const data = await authApi.googleLogin({ code });
    saveSession(data);
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authApi.register(payload);
    saveSession(data);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      googleClientId,
      login,
      loginWithGoogle,
      register,
      logout,
    }),
    [user, token, loading, googleClientId, logout],
  );

  if (!googleClientId) {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
};
