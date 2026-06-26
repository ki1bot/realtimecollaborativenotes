"use client";

import axios from "axios";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  NotebookPen,
  Sparkles,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100";

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
      await login({ email, password });
      router.replace("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login gagal");
      } else {
        setError("Login gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-5 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-100 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.24),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_72%_88%,rgba(99,102,241,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(96,165,250,0.18),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_72%_88%,rgba(129,140,248,0.12),transparent_34%)]" />

      <ThemeToggle variant="floating" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-black text-blue-700 shadow-lg shadow-slate-200/50 backdrop-blur dark:border-blue-900/70 dark:bg-slate-900/60 dark:text-blue-300 dark:shadow-black/20">
            <Sparkles size={15} />
            Realtime Collaborative Notes
          </div>

          <h1 className="max-w-2xl text-6xl font-black tracking-tight text-slate-950 dark:text-slate-50">
            Catatan realtime yang rapi, cepat, dan siap dibagikan.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
            Login untuk masuk ke workspace, membuka catatan pribadi, dan
            berkolaborasi dengan user lain secara langsung.
          </p>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/65 dark:shadow-black/30">
              <Wifi
                className="mb-4 text-blue-600 dark:text-blue-400"
                size={24}
              />
              <h3 className="font-black text-slate-950 dark:text-slate-50">
                Realtime Sync
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Perubahan catatan tampil langsung antar pengguna.
              </p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/65 dark:shadow-black/30">
              <LockKeyhole
                className="mb-4 text-blue-600 dark:text-blue-400"
                size={24}
              />
              <h3 className="font-black text-slate-950 dark:text-slate-50">
                Secure Access
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Akses berbasis login dan role collaborator.
              </p>
            </div>
          </div>
        </section>

        <form
          className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/85 p-7 shadow-2xl shadow-slate-300/60 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/78 dark:shadow-black/35 sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent" />

          <div className="relative mb-8">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
              <NotebookPen size={28} />
            </div>

            <h1 className="text-4xl font-black tracking-tight">Login</h1>

            <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
              Masuk untuk membuka catatan kolaboratif kamu.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-slate-200">
              Email
            </label>

            <input
              type="email"
              value={email}
              className={inputClass}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
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
                placeholder="Masukkan password"
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
            className="mt-6 w-full rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Belum punya akun?{" "}
            <Link
              href="/?view=register"
              className="font-black text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
