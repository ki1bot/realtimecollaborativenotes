"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, router, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ name, email, password });
      router.replace("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Register gagal");
      } else {
        setError("Register gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-slate-50 px-5 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.26),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.16),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.10),transparent_35%)]" />

      <ThemeToggle variant="floating" />

      <form
        className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-black tracking-tight">Register</h1>

        <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
          Buat akun untuk mulai menulis catatan realtime.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
            Nama
          </label>

          <input
            value={name}
            className={inputClass}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
            Email
          </label>

          <input
            type="email"
            value={email}
            className={inputClass}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              className={`${inputClass} pr-12`}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          className="mt-6 w-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/?view=login"
            className="font-black text-blue-600 dark:text-blue-400"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
