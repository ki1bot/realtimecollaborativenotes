"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { NotebookPen, Sparkles, Wifi } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import ProfileMenu from "@/app/components/ProfileMenu";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/?view=login");
  };

  return (
    <div className="relative isolate min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(14,165,233,0.15),transparent_30%),radial-gradient(circle_at_70%_90%,rgba(99,102,241,0.15),transparent_34%)] dark:bg-[radial-gradient(circle_at_12%_12%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_70%_90%,rgba(129,140,248,0.12),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-white/75 to-transparent dark:from-slate-950/80" />

      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/75">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-20 sm:px-8">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition group-hover:-translate-y-0.5 sm:h-11 sm:w-11">
              <NotebookPen size={21} strokeWidth={2.5} />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-lg">
                Realtime Notes
              </span>
              <span className="hidden text-xs font-bold text-slate-500 dark:text-slate-400 sm:block">
                Write, share, collaborate
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
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
