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
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-black tracking-tight text-slate-950 dark:text-slate-50"
          >
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
