"use client";

import Link from "next/link";
import { CalendarDays, ExternalLink, Trash2, UserRound } from "lucide-react";
import type { Note } from "@/app/types";

export default function NoteCard({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => void;
}) {
  const preview = note.content.trim() || "Belum ada isi catatan.";
  const updatedAt = new Date(note.updatedAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-200/50 dark:border-slate-800/80 dark:bg-slate-900/72 dark:shadow-black/30 dark:hover:border-blue-700/80 dark:hover:shadow-blue-950/20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/8 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
            <ExternalLink size={20} />
          </div>

          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-red-200 bg-red-50 text-red-500 opacity-100 transition hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70 sm:opacity-0 sm:group-hover:opacity-100"
            onClick={() => onDelete(note._id)}
            aria-label="Hapus note"
            type="button"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <Link
          href={`/?view=note&id=${note._id}`}
          className="line-clamp-2 text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-300"
        >
          {note.title || "Untitled Note"}
        </Link>

        <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
          {preview}
        </p>
      </div>

      <div className="relative mt-7 space-y-3 border-t border-slate-200/80 pt-4 text-xs font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <UserRound size={15} className="text-blue-600 dark:text-blue-400" />
          <span className="truncate">{note.owner.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays
            size={15}
            className="text-blue-600 dark:text-blue-400"
          />
          <span>{updatedAt}</span>
        </div>
      </div>
    </article>
  );
}
