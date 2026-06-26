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
    <article className="group flex min-h-52 flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <Link
          href={`/?view=note&id=${note._id}`}
          className="inline-block text-xl font-black tracking-tight text-slate-950 transition group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-300"
        >
          {note.title}
        </Link>

        <p className="mt-3 line-clamp-3 leading-7 text-slate-500 dark:text-slate-400">
          {note.content || "Belum ada isi catatan"}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>{new Date(note.updatedAt).toLocaleString("id-ID")}</span>

        <button
          className="rounded-2xl bg-red-50 px-4 py-2 font-black text-red-500 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
          onClick={() => onDelete(note._id)}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}
