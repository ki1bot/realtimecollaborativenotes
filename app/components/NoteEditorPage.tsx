"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  FileText,
  Save,
  Share2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import CollaboratorModal from "@/app/components/CollaboratorModal";
import Loading from "@/app/components/Loading";
import MainLayout from "@/app/components/MainLayout";
import PresencePanel from "@/app/components/PresencePanel";
import ProtectedPage from "@/app/components/ProtectedPage";
import { notesApi } from "@/app/lib/api";
import type { ActivityLog, Note, Role, UserSummary } from "@/app/types";

export default function NoteEditorPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { user, loading: authLoading } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const onlineUsers = useMemo<UserSummary[]>(() => {
    if (!user) {
      return [];
    }

    return [
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      },
    ];
  }, [user]);

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const roleLabel = role || "no-access";

  useEffect(() => {
    if (authLoading || !user || !id) {
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
  }, [authLoading, user, id]);

  useEffect(() => {
    if (authLoading || !user || !id) {
      return;
    }

    let active = true;

    const refreshActivities = async () => {
      try {
        const activityData = await notesApi.getActivities(id);

        if (active) {
          setActivities(activityData);
        }
      } catch {
        if (active) {
          setError("Gagal memperbarui activity note.");
        }
      }
    };

    const interval = window.setInterval(refreshActivities, 8000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [authLoading, user, id]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const refreshActivities = async () => {
    try {
      const activityData = await notesApi.getActivities(id);
      setActivities(activityData);
    } catch {
      setError("Note tersimpan, tetapi activity gagal diperbarui.");
    }
  };

  const scheduleSave = (nextTitle: string, nextContent: string) => {
    if (!id || !canEdit) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    setSaving(true);
    setError("");

    saveTimer.current = setTimeout(async () => {
      try {
        const updatedNote = await notesApi.updateNote(id, {
          title: nextTitle,
          content: nextContent,
        });

        setNote(updatedNote);
        await refreshActivities();
      } catch {
        setError("Gagal menyimpan note.");
      } finally {
        setSaving(false);
      }
    }, 900);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);
    scheduleSave(value, content);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setContent(value);
    scheduleSave(title, value);
  };

  const saveManually = async () => {
    if (!id || !canEdit) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    setSaving(true);
    setError("");

    try {
      const updatedNote = await notesApi.updateNote(id, { title, content });
      setNote(updatedNote);
      await refreshActivities();
    } catch {
      setError("Gagal menyimpan note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedPage>
      <MainLayout>
        {loading ? (
          <Loading />
        ) : !id ? (
          <div className="rounded-[1.5rem] border border-red-300 bg-red-50 p-5 text-red-600 shadow-lg dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 sm:rounded-[2rem] sm:p-8">
            <h3 className="text-xl font-black tracking-tight sm:text-2xl">
              ID note tidak ditemukan
            </h3>

            <p className="mt-3 text-sm leading-7 sm:text-base">
              Halaman ini harus dibuka dengan format /?view=note&id=ID_NOTE.
            </p>
          </div>
        ) : error && !note ? (
          <div className="rounded-[1.5rem] border border-red-300 bg-red-50 p-5 text-red-600 shadow-lg dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 sm:rounded-[2rem] sm:p-8">
            <h3 className="text-xl font-black tracking-tight sm:text-2xl">
              Gagal membuka note
            </h3>

            <p className="mt-3 text-sm leading-7 sm:text-base">{error}</p>
          </div>
        ) : !note ? (
          <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:rounded-[2rem] sm:p-8">
            <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-2xl">
              Note tidak ditemukan
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Note mungkin sudah dihapus atau kamu tidak punya akses.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5">
              <section className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 dark:shadow-black/30 sm:rounded-[2rem] sm:shadow-2xl">
                <div className="border-b border-slate-200/80 bg-white/60 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/20 sm:p-6">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <Link
                      href="/"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300 sm:w-fit"
                    >
                      <ArrowLeft size={17} />
                      Dashboard
                    </Link>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                      <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        <ShieldCheck size={14} />
                        {roleLabel}
                      </span>

                      <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <UsersRound size={14} />
                        {onlineUsers.length} aktif
                      </span>

                      {canEdit && (
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                          onClick={saveManually}
                          disabled={saving}
                        >
                          <Save size={17} />
                          {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                      )}

                      {canShare && (
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5"
                          onClick={() => setShowShareModal(true)}
                        >
                          <Share2 size={17} />
                          Share
                        </button>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 sm:mt-5">
                      {error}
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-7 lg:p-8">
                  <input
                    className="w-full border-none bg-transparent text-3xl font-black leading-tight tracking-tight text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 dark:text-slate-50 sm:text-5xl"
                    value={title}
                    onChange={handleTitleChange}
                    disabled={!canEdit}
                    placeholder="Untitled Note"
                  />

                  <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-5 text-xs font-black text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                      <FileText size={14} />
                      {wordCount} kata
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                      <Clock3 size={14} className="shrink-0" />
                      <span className="truncate">
                        {new Date(note.updatedAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </span>
                  </div>

                  <textarea
                    className="mt-5 min-h-[420px] w-full resize-y border-none bg-transparent text-sm leading-7 text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 dark:text-slate-200 sm:mt-6 sm:min-h-[560px] sm:text-base sm:leading-8"
                    value={content}
                    onChange={handleContentChange}
                    disabled={!canEdit}
                    placeholder={
                      canEdit
                        ? "Tulis catatan kamu di sini..."
                        : "Kamu hanya punya akses viewer"
                    }
                  />

                  <div className="mt-4 min-h-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {saving
                      ? "Menyimpan perubahan..."
                      : canEdit
                        ? "Perubahan disimpan otomatis melalui API Route Next.js."
                        : "Mode viewer. Kamu tidak bisa mengedit note ini."}
                  </div>
                </div>
              </section>

              <aside>
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
