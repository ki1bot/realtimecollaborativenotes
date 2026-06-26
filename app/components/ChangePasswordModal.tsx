"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { authApi } from "@/app/lib/api";

export default function ChangePasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Gagal mengubah password");
      } else {
        setError("Gagal mengubah password");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordInputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

  const eyeButtonClass =
    "absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-300";

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/70 p-5 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
            Ubah Password
          </h2>

          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-2xl font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-bold text-green-600 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
              Password Lama
            </label>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={passwordInputClass}
                required
              />

              <button
                type="button"
                className={eyeButtonClass}
                onClick={() => setShowCurrentPassword((current) => !current)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
              Password Baru
            </label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={passwordInputClass}
                required
              />

              <button
                type="button"
                className={eyeButtonClass}
                onClick={() => setShowNewPassword((current) => !current)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
              Konfirmasi Password Baru
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={passwordInputClass}
                required
              />

              <button
                type="button"
                className={eyeButtonClass}
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>

            <button
              className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
