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
      } catch (err) {
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
            <div className="dashboard-header">
              <div>
                <h1>My Notes</h1>
                <p>
                  Kelola catatan pribadi dan catatan yang dibagikan ke kamu.
                </p>
              </div>

              <button className="btn btn-primary" onClick={createNote}>
                Buat Note
              </button>
            </div>

            {error && <div className="alert">{error}</div>}

            {notes.length === 0 ? (
              <EmptyState
                title="Belum ada note"
                description="Mulai dari satu note sederhana dulu. Fokus stabilkan CRUD, login, dan realtime sebelum menambah fitur lain."
              />
            ) : (
              <div className="notes-grid">
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
