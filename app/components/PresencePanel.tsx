"use client";

import { Activity, CircleDot, UsersRound } from "lucide-react";
import type { ActivityLog, UserSummary } from "@/app/types";

export default function PresencePanel({
  users,
  activities,
}: {
  users: UserSummary[];
  activities: ActivityLog[];
}) {
  return (
    <div className="grid gap-5 lg:sticky lg:top-28">
      <section className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/72 dark:shadow-black/30">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <UsersRound size={20} />
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
                Online
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                User aktif di note ini
              </p>
            </div>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
            Belum ada user online.
          </p>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50"
                key={user._id}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/20">
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-black text-slate-900 dark:text-slate-100">
                    {user.name}
                  </strong>

                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CircleDot size={11} fill="currentColor" />
                    Sedang online
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/72 dark:shadow-black/30">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <Activity size={20} />
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
                Activity
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Riwayat perubahan terakhir
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {activities.length}
          </span>
        </div>

        {activities.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
            Belum ada aktivitas.
          </p>
        ) : (
          <div className="grid max-h-[460px] gap-3 overflow-y-auto pr-1">
            {activities.map((activity) => (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                key={activity._id}
              >
                <p className="text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
                  {activity.message}
                </p>

                <span className="mt-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {new Date(activity.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
