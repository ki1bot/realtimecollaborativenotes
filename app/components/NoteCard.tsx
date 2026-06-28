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
    <article className="group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-200/50 dark:border-slate-800/80 dark:bg-slate-900/72 dark:shadow-black/30 dark:hover:border-blue-700/80 dark:hover:shadow-blue-950/20 sm:min-h-64 sm:rounded-[1.9rem] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 sm:h-12 sm:w-12">
            <ExternalLink size={19} />
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
          className="line-clamp-2 text-xl font-black tracking-tight text-slate-950 transition group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-300 sm:text-2xl"
        >
          {note.title || "Untitled Note"}
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:mt-4 sm:line-clamp-4">
          {preview}
        </p>
      </div>

      <div className="relative mt-5 space-y-3 border-t border-slate-200/80 pt-4 text-xs font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:mt-7">
        <div className="flex min-w-0 items-center gap-2">
          <UserRound
            size={15}
            className="shrink-0 text-blue-600 dark:text-blue-400"
          />
          <span className="truncate">{note.owner.name}</span>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays
            size={15}
            className="shrink-0 text-blue-600 dark:text-blue-400"
          />
          <span className="truncate">{updatedAt}</span>
        </div>
      </div>
    </article>
  );
}
