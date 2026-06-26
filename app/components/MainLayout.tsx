"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
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
    <div className="relative isolate min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.10),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.09),transparent_32%)]" />

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-black tracking-tight text-slate-950 dark:text-slate-50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-base font-black text-white shadow-lg shadow-blue-500/25">
              R
            </span>

            <span>Realtime Notes</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
