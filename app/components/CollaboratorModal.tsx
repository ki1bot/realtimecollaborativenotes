"use client";

import { Search, Trash2, UserPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { notesApi, usersApi } from "@/app/lib/api";
import type { Note, Role, UserSummary } from "@/app/types";

export default function CollaboratorModal({
  note,
  onClose,
  onUpdated,
}: {
  note: Note;
  onClose: () => void;
  onUpdated: (note: Note) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setError("");

      if (keyword.trim().length < 2) {
        setUsers([]);
        return;
      }

      try {
        const result = await usersApi.searchUsers(keyword);
        setUsers(result);
      } catch {
        setError("Gagal mencari user.");
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [keyword]);

  const addCollaborator = async (userId: string) => {
    setLoading(true);
    setError("");

    try {
      const updatedNote = await notesApi.addCollaborator(note._id, {
        userId,
        role,
      });

      onUpdated(updatedNote);
      setKeyword("");
      setUsers([]);
    } catch {
      setError("Gagal menambahkan collaborator.");
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (userId: string) => {
    setLoading(true);
    setError("");

    try {
      const updatedNote = await notesApi.removeCollaborator(note._id, userId);
      onUpdated(updatedNote);
    } catch {
      setError("Gagal menghapus collaborator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center overflow-y-auto bg-slate-950/70 p-0 backdrop-blur-md sm:items-center sm:p-5">
      <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6 sm:items-center">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
              Share Note
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              Tambahkan user lain sebagai viewer atau editor.
            </p>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
              Cari user
            </label>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Cari nama atau email"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
              Role
            </label>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className={inputClass}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
        </div>

        {users.length > 0 && (
          <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="grid gap-2">
              {users.map((user) => (
                <div
                  className="flex flex-col gap-3 rounded-2xl bg-white p-3 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  key={user._id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-black text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-black text-slate-950 dark:text-slate-50">
                        {user.name}
                      </strong>

                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 px-4 py-2 text-xs font-black text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
                    disabled={loading}
                    onClick={() => addCollaborator(user._id)}
                  >
                    <UserPlus size={16} />
                    Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7">
          <div className="mb-3 flex items-center gap-2">
            <Users size={18} className="text-blue-600 dark:text-blue-400" />

            <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
              Collaborators
            </h3>
          </div>

          <div className="grid max-h-[320px] gap-3 overflow-y-auto pr-1">
            {note.collaborators.map((item) => (
              <div
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                key={item.user._id}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                    {item.user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-black text-slate-950 dark:text-slate-50">
                      {item.user.name}
                    </strong>

                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {item.user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black capitalize text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                    {item.role}
                  </span>

                  {item.role !== "owner" && (
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                      disabled={loading}
                      onClick={() => removeCollaborator(item.user._id)}
                      aria-label="Hapus collaborator"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
