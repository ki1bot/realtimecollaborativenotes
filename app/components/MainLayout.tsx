"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { NotebookPen } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import ProfileMenu from "@/app/components/ProfileMenu";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/?view=login");
  };

  return (
    <div className="relative isolate min-h-dvh overflow-x-hidden bg-red-50 text-slate-950 dark:bg-red-950 dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(244,63,94,0.24),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(220,38,38,0.22),transparent_30%),radial-gradient(circle_at_70%_90%,rgba(251,113,133,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_12%_12%,rgba(244,63,94,0.16),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(220,38,38,0.16),transparent_30%),radial-gradient(circle_at_70%_90%,rgba(251,113,133,0.1),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-white/95 via-red-50/70 to-transparent dark:from-red-950/95 dark:via-red-950/70 dark:to-transparent" />

      <header className="sticky top-0 z-40 border-b border-red-100/80 bg-white/82 backdrop-blur-2xl dark:border-white/10 dark:bg-red-950/78">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-20 sm:px-8">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 via-red-600 to-red-800 text-white shadow-lg shadow-red-600/30 transition group-hover:-translate-y-0.5 sm:h-11 sm:w-11">
              <NotebookPen size={21} strokeWidth={2.5} />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-lg">
                Realtime Notes
              </span>
              <span className="hidden text-xs font-bold text-red-600 dark:text-rose-300 sm:block">
                Write, share, collaborate
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-8 sm:py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
