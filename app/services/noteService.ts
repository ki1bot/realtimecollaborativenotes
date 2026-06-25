import api from "./api";
import type { ActivityLog, Note, Role } from "../types/note";

export const noteService = {
  async getNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>("/notes");
    return response.data;
  },

  async createNote(payload: {
    title?: string;
    content?: string;
  }): Promise<Note> {
    const response = await api.post<Note>("/notes", payload);
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async updateNote(
    id: string,
    payload: { title?: string; content?: string },
  ): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, payload);
    return response.data;
  },

  async deleteNote(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/notes/${id}`);
    return response.data;
  },

  async addCollaborator(
    id: string,
    payload: { userId?: string; email?: string; role: Role },
  ): Promise<Note> {
    const response = await api.post<Note>(
      `/notes/${id}/collaborators`,
      payload,
    );
    return response.data;
  },

  async removeCollaborator(id: string, userId: string): Promise<Note> {
    const response = await api.delete<Note>(
      `/notes/${id}/collaborators/${userId}`,
    );
    return response.data;
  },

  async getActivities(id: string): Promise<ActivityLog[]> {
    const response = await api.get<ActivityLog[]>(`/notes/${id}/activities`);
    return response.data;
  },
};
