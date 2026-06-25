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
