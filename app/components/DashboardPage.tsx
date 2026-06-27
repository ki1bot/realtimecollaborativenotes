"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Search, Sparkles, Users, Zap } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import EmptyState from "@/app/components/EmptyState";
import Loading from "@/app/components/Loading";
import MainLayout from "@/app/components/MainLayout";
import NoteCard from "@/app/components/NoteCard";
import { notesApi } from "@/app/lib/api";
import type { Note } from "@/app/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
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

  const filteredNotes = useMemo(() => {
    const value = keyword.trim().toLowerCase();

    if (!value) {
      return notes;
    }

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(value) ||
        note.content.toLowerCase().includes(value) ||
        note.owner.name.toLowerCase().includes(value)
      );
    });
  }, [keyword, notes]);

  const ownedNotes = useMemo(() => {
    if (!user) {
      return 0;
    }

    return notes.filter((note) => note.owner._id === user._id).length;
  }, [notes, user]);

  const sharedNotes = notes.length - ownedNotes;

  const createNote = async () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/?view=login");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const note = await notesApi.createNote({
        title: "Untitled Note",
        content: "",
      });

      router.push(`/?view=note&id=${note._id}`);
    } catch {
      setError("Gagal membuat note baru.");
    } finally {
      setCreating(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) {
      router.push("/?view=login");
      return;
    }

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
    <MainLayout>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-7">
          <section className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-black/30 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300">
                  <Sparkles size={15} />
                  Workspace pribadi dan kolaboratif
                </div>

                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
                  Kelola catatan realtime dengan tampilan yang lebih bersih.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
                  Buat, edit, dan bagikan catatan tanpa membuat alur kerja jadi
                  ribet. Fokus utama aplikasi ini adalah CRUD stabil, kolaborasi
                  realtime, dan akses role yang jelas.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={createNote}
                    disabled={creating || authLoading}
                  >
                    <Plus size={18} />
                    {authLoading
                      ? "Memuat..."
                      : !user
                        ? "Login untuk Buat Note"
                        : creating
                          ? "Membuat..."
                          : "Buat Note Baru"}
                  </button>

                  <div className="relative w-full sm:max-w-sm">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      placeholder="Cari note..."
                      disabled={!user}
                      className="h-full w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl border border-slate-200 bg-white/75 p-5 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                      Total Notes
                    </span>
                    <FileText
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <strong className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                    {notes.length}
                  </strong>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/75 p-5 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                      Milik Kamu
                    </span>
                    <Zap
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <strong className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                    {ownedNotes}
                  </strong>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/75 p-5 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                      Dibagikan
                    </span>
                    <Users
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <strong className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                    {sharedNotes}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-bold text-red-600 shadow-lg shadow-red-100/60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:shadow-black/20">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                  Daftar Note
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {!user
                    ? "Login hanya diperlukan untuk membuat dan mengelola note"
                    : keyword
                      ? `${filteredNotes.length} hasil ditemukan`
                      : "Semua catatan yang bisa kamu akses"}
                </p>
              </div>
            </div>

            {!user ? (
              <EmptyState
                title="Halaman utama bisa dibuka tanpa login"
                description="Kamu bisa masuk ke halaman utama website tanpa akun. Login hanya dibutuhkan saat ingin membuat note, membuka note pribadi, mengedit, atau menggunakan fitur kolaborasi."
              />
            ) : filteredNotes.length === 0 ? (
              <EmptyState
                title={keyword ? "Note tidak ditemukan" : "Belum ada note"}
                description={
                  keyword
                    ? "Kata kunci yang kamu masukkan tidak cocok dengan judul, isi, atau pemilik note."
                    : "Mulai dari satu note sederhana dulu. Setelah CRUD stabil, baru kembangkan fitur realtime dan sharing lebih jauh."
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <NoteCard key={note._id} note={note} onDelete={deleteNote} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </MainLayout>
  );
}
