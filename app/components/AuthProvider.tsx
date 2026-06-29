"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  createContext,
  useContext,
  useEffect,
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    authApi
      .me()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveSession = (data: { token: string; user: User }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    googleClientId,
    login,
    loginWithGoogle,
    register,
    logout,
  };

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
