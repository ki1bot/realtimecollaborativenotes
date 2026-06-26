"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import EmptyState from "@/app/components/EmptyState";
import Loading from "@/app/components/Loading";
import MainLayout from "@/app/components/MainLayout";
import NoteCard from "@/app/components/NoteCard";
import ProtectedPage from "@/app/components/ProtectedPage";
import { notesApi } from "@/app/lib/api";
import type { Note } from "@/app/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let active = true;

    const loadNotes = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await notesApi.getNotes();

        if (active) {
          setNotes(data);
        }
      } catch {
        if (active) {
          setError("Gagal mengambil data notes. Silakan login ulang.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  const createNote = async () => {
    try {
      const note = await notesApi.createNote({
        title: "Untitled Note",
        content: "",
      });

      router.push(`/?view=note&id=${note._id}`);
    } catch {
      setError("Gagal membuat note baru.");
    }
  };

  const deleteNote = async (id: string) => {
    const confirmed = window.confirm("Yakin hapus note ini?");

    if (!confirmed) {
      return;
    }

    try {
      await notesApi.deleteNote(id);
      setNotes((current) => current.filter((note) => note._id !== id));
    } catch {
      setError("Gagal menghapus note.");
    }
  };

  return (
    <ProtectedPage>
      <MainLayout>
        {loading ? (
          <Loading />
        ) : (
          <>
            <section className="mb-7 rounded-[2rem] border border-slate-200 bg-white/80 p-7 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                    My Notes
                  </h1>
                  <p className="mt-3 max-w-2xl leading-7 text-slate-500 dark:text-slate-400">
                    Kelola catatan pribadi dan catatan yang dibagikan ke kamu.
                  </p>
                </div>

                <button
                  className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5"
                  onClick={createNote}
                >
                  Buat Note
                </button>
              </div>
            </section>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            {notes.length === 0 ? (
              <EmptyState
                title="Belum ada note"
                description="Mulai dari satu note sederhana dulu. Fokus stabilkan CRUD, login, dan realtime sebelum menambah fitur lain."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <NoteCard key={note._id} note={note} onDelete={deleteNote} />
                ))}
              </div>
            )}
          </>
        )}
      </MainLayout>
    </ProtectedPage>
  );
}
