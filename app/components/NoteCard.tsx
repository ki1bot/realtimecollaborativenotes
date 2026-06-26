"use client";

import Link from "next/link";
import type { Note } from "@/app/types";

export default function NoteCard({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="note-card">
      <div>
        <Link href={`/?view=note&id=${note._id}`} className="note-title">
          {note.title}
        </Link>

        <p className="note-preview">
          {note.content || "Belum ada isi catatan"}
        </p>
      </div>

      <div className="note-footer">
        <span>{new Date(note.updatedAt).toLocaleString("id-ID")}</span>

        <button className="btn btn-danger" onClick={() => onDelete(note._id)}>
          Hapus
        </button>
      </div>
    </div>
  );
}
