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
    <div className="app-shell">
      <header className="navbar">
        <Link href="/" className="brand">
          Realtime Notes
        </Link>

        <div className="navbar-right">
          <ThemeToggle />
          <ProfileMenu onLogout={handleLogout} />
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}
