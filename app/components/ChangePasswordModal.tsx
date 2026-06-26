"use client";

import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { authApi } from "@/app/lib/api";

export default function ChangePasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 pr-12 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950";

  const labelClass =
    "mb-2 block text-sm font-black text-slate-800 dark:text-slate-200";

  const eyeButtonClass =
    "absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-300";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(response.message || "Password berhasil diubah.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Gagal mengubah password.");
      } else {
        setError("Gagal mengubah password.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950/75 px-4 py-6 backdrop-blur-md"
      onMouseDown={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-2xl dark:border-slate-800/90 dark:bg-slate-900/95"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/15 to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative border-b border-slate-200/80 px-6 py-5 dark:border-slate-800 sm:px-7">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 gap-4">
              <div className="grid h-13 w-13 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                <KeyRound size={26} />
              </div>

              <div className="min-w-0">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                  Ubah Password
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
                  Gunakan password baru yang kuat supaya akun tetap aman.
                </p>
              </div>
            </div>

            <button
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300 dark:shadow-black/20 dark:hover:border-red-900/70 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              onClick={onClose}
              type="button"
              aria-label="Tutup modal"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <form className="relative px-6 py-5 sm:px-7" onSubmit={handleSubmit}>
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm font-bold leading-6 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/35 dark:text-blue-300">
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
            <span>
              Setelah password berhasil diubah, gunakan password baru untuk
              login berikutnya.
            </span>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className={labelClass}>Password Lama</label>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={inputClass}
                placeholder="Masukkan password lama"
                required
              />

              <button
                type="button"
                className={eyeButtonClass}
                onClick={() => setShowCurrentPassword((current) => !current)}
                aria-label={
                  showCurrentPassword
                    ? "Sembunyikan password lama"
                    : "Tampilkan password lama"
                }
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Password Baru</label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={inputClass}
                placeholder="Minimal 6 karakter"
                required
              />

              <button
                type="button"
                className={eyeButtonClass}
                onClick={() => setShowNewPassword((current) => !current)}
                aria-label={
                  showNewPassword
                    ? "Sembunyikan password baru"
                    : "Tampilkan password baru"
                }
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Konfirmasi Password Baru</label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClass}
                placeholder="Ulangi password baru"
                required
              />

              <button
                type="button"
                className={eyeButtonClass}
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi password"
                    : "Tampilkan konfirmasi password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:shadow-black/20 dark:hover:bg-slate-900"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>

            <button
              className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
