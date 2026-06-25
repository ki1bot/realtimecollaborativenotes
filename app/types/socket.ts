import type { ActivityLog, UserSummary } from "./note";

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
  join_note: (payload: { noteId: string; user?: UserSummary }) => void;
  leave_note: (payload: { noteId: string; userId?: string }) => void;
  note_title_update: (payload: { noteId: string; title: string }) => void;
  note_content_update: (payload: { noteId: string; content: string }) => void;
  typing_start: (payload: { noteId: string; user?: UserSummary }) => void;
  typing_stop: (payload: { noteId: string; user?: UserSummary }) => void;
}
