"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import CollaboratorModal from "@/app/components/CollaboratorModal";
import Loading from "@/app/components/Loading";
import MainLayout from "@/app/components/MainLayout";
import PresencePanel from "@/app/components/PresencePanel";
import ProtectedPage from "@/app/components/ProtectedPage";
import { notesApi } from "@/app/lib/api";
import {
  connectSocket,
  disconnectSocket,
  type AppSocket,
} from "@/app/lib/socket";
import type { ActivityLog, Note, Role, UserSummary } from "@/app/types";

export default function NoteEditorPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { user, token, loading: authLoading } = useAuth();
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserSummary[]>([]);
  const [typingUsers, setTypingUsers] = useState<UserSummary[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const role = useMemo<Role | null>(() => {
    if (!note || !user) {
      return null;
    }

    if (note.owner._id === user._id) {
      return "owner";
    }

    return (
      note.collaborators.find((item) => item.user._id === user._id)?.role ||
      null
    );
  }, [note, user]);

  const canEdit = role === "owner" || role === "editor";
  const canShare = role === "owner";

  useEffect(() => {
    if (authLoading || !user || !token || !id) {
      return;
    }

    let active = true;

    const loadNote = async () => {
      setLoading(true);
      setError("");

      try {
        const [noteData, activityData] = await Promise.all([
          notesApi.getNote(id),
          notesApi.getActivities(id),
        ]);

        if (active) {
          setNote(noteData);
          setTitle(noteData.title);
          setContent(noteData.content);
          setActivities(activityData);
        }
      } catch {
        if (active) {
          setError(
            "Gagal membuka note. Note mungkin sudah dihapus atau kamu tidak punya akses.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadNote();

    return () => {
      active = false;
    };
  }, [authLoading, user, token, id]);

  useEffect(() => {
    if (authLoading || !user || !token) {
      return;
    }

    const connectedSocket = connectSocket(token);
    setSocket(connectedSocket);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [authLoading, user, token]);

  useEffect(() => {
    if (!socket || !id || !user) {
      return;
    }

    socket.emit("join_note", { noteId: id });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("note_title_updated", (payload) => {
      if (payload.updatedBy._id !== user._id) {
        setTitle(payload.title);
      }
    });

    socket.on("note_content_updated", (payload) => {
      if (payload.updatedBy._id !== user._id) {
        setContent(payload.content);
      }
    });

    socket.on("activity_created", (activity) => {
      setActivities((current) => {
        if (current.some((item) => item._id === activity._id)) {
          return current;
        }

        return [activity, ...current].slice(0, 50);
      });
    });

    socket.on("user_typing", (typingUser) => {
      if (typingUser._id === user._id) {
        return;
      }

      setTypingUsers((current) => {
        if (current.some((item) => item._id === typingUser._id)) {
          return current;
        }

        return [...current, typingUser];
      });
    });

    socket.on("user_stop_typing", (userId) => {
      setTypingUsers((current) =>
        current.filter((item) => item._id !== userId),
      );
    });

    socket.on("error_message", (message) => {
      window.alert(message);
    });

    return () => {
      socket.emit("leave_note", { noteId: id });
      socket.off("online_users");
      socket.off("note_title_updated");
      socket.off("note_content_updated");
      socket.off("activity_created");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("error_message");
    };
  }, [socket, id, user]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);

    if (!socket || !id || !canEdit) {
      return;
    }

    if (titleTimer.current) {
      clearTimeout(titleTimer.current);
    }

    titleTimer.current = setTimeout(() => {
      socket.emit("note_title_update", { noteId: id, title: value });
    }, 500);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setContent(value);

    if (!socket || !id || !canEdit) {
      return;
    }

    socket.emit("typing_start", { noteId: id });

    if (contentTimer.current) {
      clearTimeout(contentTimer.current);
    }

    contentTimer.current = setTimeout(() => {
      socket.emit("note_content_update", { noteId: id, content: value });
      socket.emit("typing_stop", { noteId: id });
    }, 700);
  };

  const saveManually = async () => {
    if (!id || !canEdit) {
      return;
    }

    try {
      const updatedNote = await notesApi.updateNote(id, { title, content });
      setNote(updatedNote);
    } catch {
      setError("Gagal menyimpan note.");
    }
  };

  return (
    <ProtectedPage>
      <MainLayout>
        {loading ? (
          <Loading />
        ) : !id ? (
          <div className="empty-state">
            <h3>ID note tidak ditemukan</h3>
            <p>
              Halaman ini harus dibuka dengan format /?view=note&id=ID_NOTE.
            </p>
          </div>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : !note ? (
          <div className="empty-state">
            <h3>Note tidak ditemukan</h3>
            <p>Note mungkin sudah dihapus atau kamu tidak punya akses.</p>
          </div>
        ) : (
          <>
            <div className="editor-layout">
              <section className="editor-main">
                <div className="editor-topbar">
                  <Link href="/" className="back-link">
                    ← Dashboard
                  </Link>

                  <div className="editor-actions">
                    <span className="badge">{role}</span>

                    {canEdit && (
                      <button
                        className="btn btn-secondary"
                        onClick={saveManually}
                      >
                        Simpan
                      </button>
                    )}

                    {canShare && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowShareModal(true)}
                      >
                        Share
                      </button>
                    )}
                  </div>
                </div>

                <input
                  className="editor-title"
                  value={title}
                  onChange={handleTitleChange}
                  disabled={!canEdit}
                />

                <textarea
                  className="editor-textarea"
                  value={content}
                  onChange={handleContentChange}
                  disabled={!canEdit}
                  placeholder={
                    canEdit
                      ? "Tulis catatan kamu di sini..."
                      : "Kamu hanya punya akses viewer"
                  }
                />

                <div className="typing-status">
                  {typingUsers.length > 0 &&
                    `${typingUsers.map((item) => item.name).join(", ")} sedang mengetik...`}
                </div>
              </section>

              <aside className="editor-sidebar">
                <PresencePanel users={onlineUsers} activities={activities} />
              </aside>
            </div>

            {showShareModal && (
              <CollaboratorModal
                note={note}
                onClose={() => setShowShareModal(false)}
                onUpdated={(updatedNote) => setNote(updatedNote)}
              />
            )}
          </>
        )}
      </MainLayout>
    </ProtectedPage>
  );
}
