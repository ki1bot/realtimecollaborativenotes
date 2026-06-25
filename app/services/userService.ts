import api from "./api";
import type { UserSummary } from "../types/note";

export const userService = {
  async searchUsers(keyword: string): Promise<UserSummary[]> {
    const response = await api.get<UserSummary[]>("/users/search", {
      params: { keyword },
    });
    return response.data;
  },
};
