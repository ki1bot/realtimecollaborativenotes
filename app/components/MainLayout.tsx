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
    <div className="relative isolate min-h-dvh overflow-x-hidden bg-[#fffafa] text-slate-950 dark:bg-[#080304] dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(244,63,94,0.18),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(190,18,60,0.12),transparent_32%),radial-gradient(circle_at_70%_90%,rgba(255,107,107,0.12),transparent_34%)] dark:bg-[radial-gradient(circle_at_12%_10%,rgba(244,63,94,0.14),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(190,18,60,0.14),transparent_32%),radial-gradient(circle_at_70%_90%,rgba(255,107,107,0.08),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-white/95 via-red-50/70 to-transparent dark:from-[#080304]/95 dark:via-red-950/35 dark:to-transparent" />

      <header className="sticky top-0 z-40 border-b border-red-100/80 bg-white/82 shadow-sm shadow-red-100/60 backdrop-blur-2xl dark:border-red-900/35 dark:bg-[#080304]/82 dark:shadow-black/30">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-20 sm:px-8">
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-3"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-400 via-red-600 to-red-900 text-white shadow-lg shadow-red-600/30 ring-1 ring-white/40 transition group-hover:-translate-y-0.5 group-hover:shadow-red-600/45 sm:h-11 sm:w-11">
              <NotebookPen size={21} strokeWidth={2.5} />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-lg">
                Realtime Notes
              </span>
              <span className="hidden text-xs font-bold text-red-600 dark:text-red-200 sm:block">
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
