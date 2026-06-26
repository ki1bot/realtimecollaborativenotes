"use client";

import type { ActivityLog, UserSummary } from "@/app/types";

export default function PresencePanel({
  users,
  activities,
}: {
  users: UserSummary[];
  activities: ActivityLog[];
}) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
            Online
          </h3>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <p className="leading-7 text-slate-500 dark:text-slate-400">
            Belum ada user online.
          </p>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50"
                key={user._id}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-black text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0">
                  <strong className="block truncate text-sm font-black text-slate-900 dark:text-slate-100">
                    {user.name}
                  </strong>

                  <span className="block text-xs font-bold text-green-600 dark:text-green-400">
                    Sedang online
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-slate-50">
            Activity
          </h3>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {activities.length}
          </span>
        </div>

        {activities.length === 0 ? (
          <p className="leading-7 text-slate-500 dark:text-slate-400">
            Belum ada aktivitas.
          </p>
        ) : (
          <div className="grid max-h-[440px] gap-3 overflow-y-auto pr-1">
            {activities.map((activity) => (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50"
                key={activity._id}
              >
                <p className="text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
                  {activity.message}
                </p>

                <span className="mt-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {new Date(activity.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
