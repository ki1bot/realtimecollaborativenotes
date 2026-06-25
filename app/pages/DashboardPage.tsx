import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NoteCard from "../components/notes/NoteCard";
import { noteService } from "../services/noteService";
import type { Note } from "../types/note";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    const data = await noteService.getNotes();
    setNotes(data);
  };

  useEffect(() => {
    loadNotes().finally(() => setLoading(false));
  }, []);

  const createNote = async () => {
    const note = await noteService.createNote({
      title: "Untitled Note",
      content: "",
    });

    navigate(`/notes/${note._id}`);
  };

  const deleteNote = async (id: string) => {
    const confirmed = window.confirm("Yakin hapus note ini?");

    if (!confirmed) {
      return;
    }

    await noteService.deleteNote(id);
    setNotes((current) => current.filter((note) => note._id !== id));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <div className="dashboard-header">
        <div>
          <h1>My Notes</h1>
          <p>Kelola catatan pribadi dan catatan yang dibagikan ke kamu.</p>
        </div>
        <button className="btn btn-primary" onClick={createNote}>
          Buat Note
        </button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="Belum ada note"
          description="Mulai dari satu note sederhana dulu. Jangan kebanyakan fitur sebelum CRUD dan realtime stabil."
        />
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
