export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type Role = "owner" | "editor" | "viewer";

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Collaborator {
  user: UserSummary;
  role: Role;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  owner: UserSummary;
  collaborators: Collaborator[];
  lastEditedBy?: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  note: string;
  user: UserSummary;
  action: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerToClientEvents {
  user_joined_note: (user: UserSummary) => void;
  user_left_note: (userId: string) => void;
  online_users: (users: UserSummary[]) => void;
  note_title_updated: (payload: {
    title: string;
    updatedBy: UserSummary;
  }) => void;
  note_content_updated: (payload: {
    content: string;
    updatedBy: UserSummary;
  }) => void;
  user_typing: (user: UserSummary) => void;
  user_stop_typing: (userId: string) => void;
  activity_created: (activity: ActivityLog) => void;
  error_message: (message: string) => void;
}

export interface ClientToServerEvents {
  join_note: (payload: { noteId: string }) => void;
  leave_note: (payload: { noteId: string }) => void;
  note_title_update: (payload: { noteId: string; title: string }) => void;
  note_content_update: (payload: { noteId: string; content: string }) => void;
  typing_start: (payload: { noteId: string }) => void;
  typing_stop: (payload: { noteId: string }) => void;
}
