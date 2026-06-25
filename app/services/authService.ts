import api from "./api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async me(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data;
  },
};
