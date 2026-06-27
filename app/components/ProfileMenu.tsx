"use client";

import Link from "next/link";
import {
  ChevronDown,
  KeyRound,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import ChangePasswordModal from "@/app/components/ChangePasswordModal";

export default function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  const displayName = user?.name || "Akun";
  const displayEmail = user?.email || "Mode pengunjung";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative z-50" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Buka menu akun"
          aria-expanded={open}
          className="group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 px-2.5 py-2 pr-3 text-sm font-black text-slate-900 shadow-xl shadow-slate-200/60 ring-1 ring-white/70 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/70 hover:shadow-2xl hover:shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-100 dark:shadow-black/30 dark:ring-white/10"
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-cyan-400/10 opacity-0 transition duration-300 group-hover:opacity-100" />

          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/35 ring-1 ring-white/30">
            {user ? initial : <UserRound size={18} strokeWidth={2.6} />}

            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />
          </span>

          <span className="relative hidden min-w-0 text-left sm:block">
            <span className="block max-w-32 truncate leading-4">
              {displayName}
            </span>
            <span className="mt-0.5 block max-w-32 truncate text-[11px] font-bold leading-3 text-slate-500 dark:text-slate-400">
              {user ? "Kelola akun" : "Masuk / daftar"}
            </span>
          </span>

          <ChevronDown
            size={16}
            strokeWidth={2.8}
            className={`relative hidden text-slate-500 transition duration-300 sm:block dark:text-slate-400 ${
              open ? "rotate-180 text-blue-500" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+14px)] z-[9999] w-80 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-3 shadow-2xl shadow-slate-300/50 ring-1 ring-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/40 dark:ring-white/10">
            <div className="absolute -top-2 right-8 h-4 w-4 rotate-45 border-l border-t border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/95" />

            <div className="mb-3 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-blue-50/70 p-4 dark:border-white/10 dark:from-slate-900 dark:to-blue-950/30">
              <div className="flex items-center gap-3">
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-600 text-base font-black text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/30">
                  {user ? initial : <UserRound size={21} strokeWidth={2.6} />}
                  <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />
                </div>

                <div className="min-w-0">
                  <strong className="block truncate text-sm font-black text-slate-950 dark:text-slate-50">
                    {displayName}
                  </strong>

                  <span className="mt-1 block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {displayEmail}
                  </span>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300">
                <ShieldCheck size={13} />
                {user ? "Akun aktif" : "Guest mode"}
              </div>
            </div>

            {user ? (
              <div className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-extrabold text-slate-800 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-100 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                  onClick={() => {
                    setOpen(false);
                    setShowChangePassword(true);
                  }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                    <KeyRound size={18} />
                  </span>
                  <span>Ubah Password</span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-extrabold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40">
                    <LogOut size={18} />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/?view=login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  href="/?view=register"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {user && showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
}
