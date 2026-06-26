"use client";

import { KeyRound, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import ChangePasswordModal from "@/app/components/ChangePasswordModal";

export default function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

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
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-2 py-1.5 text-sm font-bold text-slate-900 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
          aria-label="Buka menu akun"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-black text-white">
            {initial}
          </span>

          <span className="max-w-32 truncate">{user?.name || "Akun"}</span>
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+12px)] z-[9999] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center gap-3 border-b border-slate-200 px-3 py-3 dark:border-slate-800">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 font-black text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <strong className="block truncate text-sm font-black text-slate-950 dark:text-slate-50">
                  {user?.name}
                </strong>

                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-extrabold text-slate-800 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-100 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              onClick={() => {
                setOpen(false);
                setShowChangePassword(true);
              }}
            >
              <KeyRound size={18} />
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
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
}
