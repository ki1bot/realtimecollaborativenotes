import { Link } from "react-router-dom";
import type { Note } from "../../types/note";

const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="note-card">
      <div>
        <Link to={`/notes/${note._id}`} className="note-title">
          {note.title}
        </Link>
        <p className="note-preview">
          {note.content || "Belum ada isi catatan"}
        </p>
      </div>

      <div className="note-footer">
        <span>{new Date(note.updatedAt).toLocaleString()}</span>
        <button className="btn btn-danger" onClick={() => onDelete(note._id)}>
          Hapus
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
