"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileText,
  LockKeyhole,
  Plus,
  Search,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
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

  const createNote = () => {
    if (!user) {
      router.push("/?view=login");
      return;
    }

    router.push("/?view=note&mode=create");
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

  if (authLoading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="space-y-6 sm:space-y-8">
          <section className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 dark:shadow-black/30 sm:rounded-[2.25rem] sm:p-8 lg:p-12">
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
              <div>
                <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300">
                  <Sparkles size={15} />
                  <span className="truncate">Realtime collaborative notes</span>
                </div>

                <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
                  Kelola catatan, ide, dan kolaborasi dalam satu workspace.
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                  Halaman utama ini sekarang bisa dilihat oleh pengunjung tanpa
                  login. Login hanya diperlukan ketika pengguna ingin membuat,
                  membuka, mengedit, menghapus, atau membagikan note.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => router.push("/?view=login")}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 sm:w-auto"
                  >
                    Login untuk mulai
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/?view=register")}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 sm:w-auto"
                  >
                    Buat akun baru
                  </button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:shadow-black/30 sm:rounded-[2rem] sm:p-6">
                <div className="rounded-[1.25rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 dark:border-blue-900/60 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                        Preview
                      </p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                        Guest Mode
                      </h2>
                    </div>

                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
                      <FileText size={23} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-slate-50">
                        <Zap
                          size={17}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        CRUD Notes
                      </div>
                      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Buat, baca, ubah, dan hapus catatan setelah login.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-slate-50">
                        <Share2
                          size={17}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        Sharing
                      </div>
                      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Bagikan note ke pengguna lain dengan role yang jelas.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-slate-50">
                        <LockKeyhole
                          size={17}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        Protected Workspace
                      </div>
                      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Data note tetap aman karena fitur internal tetap
                        membutuhkan autentikasi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <FileText size={21} />
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
                Catatan Terstruktur
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Simpan catatan dengan tampilan bersih dan mudah digunakan.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <Users size={21} />
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
                Kolaborasi
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Cocok untuk kerja kelompok, dokumentasi, dan ide proyek.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <LockKeyhole size={21} />
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
                Akses Aman
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Halaman utama publik, tetapi data pengguna tetap private.
              </p>
            </div>
          </section>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-5 sm:space-y-7">
          <section className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-black/30 sm:rounded-[2.25rem] sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
              <div>
                <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-black text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300 sm:mb-5 sm:px-4 sm:text-xs">
                  <Sparkles size={15} />
                  <span className="truncate">
                    Workspace pribadi dan kolaboratif
                  </span>
                </div>

                <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
                  Kelola catatan realtime dengan tampilan yang lebih bersih.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:mt-5 sm:text-base sm:leading-8">
                  Buat, edit, dan bagikan catatan tanpa membuat alur kerja jadi
                  ribet. Fokus utama aplikasi ini adalah CRUD stabil, kolaborasi
                  realtime, dan akses role yang jelas.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 sm:w-auto"
                    onClick={createNote}
                  >
                    <Plus size={18} />
                    Buat Note Baru
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
                      className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white/75 p-3 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:rounded-3xl sm:p-5">
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 sm:text-sm">
                      Total
                    </span>
                    <FileText
                      size={17}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <strong className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
                    {notes.length}
                  </strong>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/75 p-3 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:rounded-3xl sm:p-5">
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 sm:text-sm">
                      Milik
                    </span>
                    <Zap
                      size={17}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <strong className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
                    {ownedNotes}
                  </strong>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/75 p-3 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:rounded-3xl sm:p-5">
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 sm:text-sm">
                      Share
                    </span>
                    <Users
                      size={17}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <strong className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
                    {sharedNotes}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 shadow-lg shadow-red-100/60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:shadow-black/20 sm:px-5 sm:py-4">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-2xl">
                  Daftar Note
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {keyword
                    ? `${filteredNotes.length} hasil ditemukan`
                    : "Semua catatan yang bisa kamu akses"}
                </p>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <EmptyState
                title={keyword ? "Note tidak ditemukan" : "Belum ada note"}
                description={
                  keyword
                    ? "Kata kunci yang kamu masukkan tidak cocok dengan judul, isi, atau pemilik note."
                    : "Mulai dari satu note sederhana dulu. Setelah CRUD stabil, baru kembangkan fitur realtime dan sharing lebih jauh."
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
