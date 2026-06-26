import axios from "axios";
import type {
  ActivityLog,
  AuthResponse,
  LoginPayload,
  Note,
  RegisterPayload,
  Role,
  User,
  UserSummary,
} from "@/app/types";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("", payload, {
      params: { action: "register" },
    });

    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("", payload, {
      params: { action: "login" },
    });

    return response.data;
  },

  async me(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>("", {
      params: { action: "me" },
    });

    return response.data;
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>("", payload, {
      params: { action: "change-password" },
    });

    return response.data;
  },
};

export const notesApi = {
  async getNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>("", {
      params: { action: "notes" },
    });

    return response.data;
  },

  async createNote(payload: {
    title?: string;
    content?: string;
  }): Promise<Note> {
    const response = await api.post<Note>("", payload, {
      params: { action: "notes" },
    });

    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get<Note>("", {
      params: { action: "note", id },
    });

    return response.data;
  },

  async updateNote(
    id: string,
    payload: { title?: string; content?: string },
  ): Promise<Note> {
    const response = await api.patch<Note>("", payload, {
      params: { action: "note", id },
    });

    return response.data;
  },

  async deleteNote(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>("", {
      params: { action: "note", id },
    });

    return response.data;
  },

  async getActivities(id: string): Promise<ActivityLog[]> {
    const response = await api.get<ActivityLog[]>("", {
      params: { action: "activities", id },
    });

    return response.data;
  },

  async addCollaborator(
    id: string,
    payload: { userId?: string; email?: string; role: Role },
  ): Promise<Note> {
    const response = await api.post<Note>("", payload, {
      params: { action: "collaborators", id },
    });

    return response.data;
  },

  async removeCollaborator(id: string, userId: string): Promise<Note> {
    const response = await api.delete<Note>("", {
      params: { action: "collaborator", id, userId },
    });

    return response.data;
  },
};

export const usersApi = {
  async searchUsers(keyword: string): Promise<UserSummary[]> {
    const response = await api.get<UserSummary[]>("", {
      params: { action: "users", keyword },
    });

    return response.data;
  },
};
