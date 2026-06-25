import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ActivityLogPanel from "../components/notes/ActivityLogPanel";
import CollaboratorModal from "../components/notes/CollaboratorModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MainLayout from "../components/layout/MainLayout";
import PresenceList from "../components/notes/PresenceList";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { noteService } from "../services/noteService";
import type { ActivityLog, Note, Role, UserSummary } from "../types/note";

const NoteEditorPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const socket = useSocket(token);
  const [note, setNote] = useState<Note | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserSummary[]>([]);
  const [typingUsers, setTypingUsers] = useState<UserSummary[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
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
    const loadNote = async () => {
      if (!id) {
        return;
      }

      const [noteData, activityData] = await Promise.all([
        noteService.getNote(id),
        noteService.getActivities(id),
      ]);

      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
      setActivities(activityData);
      setLoading(false);
    };

    loadNote();
  }, [id]);

  useEffect(() => {
    if (!socket || !id || !user) {
      return;
    }

    socket.emit("join_note", { noteId: id, user });

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
      socket.emit("leave_note", { noteId: id, userId: user._id });
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

    socket.emit("typing_start", { noteId: id, user: user || undefined });

    if (contentTimer.current) {
      clearTimeout(contentTimer.current);
    }

    contentTimer.current = setTimeout(() => {
      socket.emit("note_content_update", { noteId: id, content: value });
      socket.emit("typing_stop", { noteId: id, user: user || undefined });
    }, 700);
  };

  const saveManually = async () => {
    if (!id || !canEdit) {
      return;
    }

    const updatedNote = await noteService.updateNote(id, { title, content });
    setNote(updatedNote);
  };

  if (loading || !note) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <div className="editor-layout">
        <section className="editor-main">
          <div className="editor-topbar">
            <Link to="/" className="back-link">
              ← Dashboard
            </Link>

            <div className="editor-actions">
              <span className="badge">{role}</span>
              {canEdit && (
                <button className="btn btn-secondary" onClick={saveManually}>
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
          <PresenceList users={onlineUsers} />
          <ActivityLogPanel activities={activities} />
        </aside>
      </div>

      {showShareModal && (
        <CollaboratorModal
          note={note}
          onClose={() => setShowShareModal(false)}
          onUpdated={(updatedNote) => setNote(updatedNote)}
        />
      )}
    </MainLayout>
  );
};

export default NoteEditorPage;
