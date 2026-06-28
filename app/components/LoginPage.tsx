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

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-red-100 bg-white/90 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-50 dark:placeholder:text-red-200/50 dark:focus:border-rose-400 dark:focus:ring-rose-400/15";

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
    <div className="relative isolate min-h-screen overflow-hidden bg-red-50 px-5 py-8 text-slate-950 dark:bg-red-950 dark:text-slate-50 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(244,63,94,0.26),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(220,38,38,0.2),transparent_30%),radial-gradient(circle_at_72%_88%,rgba(251,113,133,0.2),transparent_34%)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(244,63,94,0.18),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(220,38,38,0.16),transparent_30%),radial-gradient(circle_at_72%_88%,rgba(251,113,133,0.12),transparent_34%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/75 px-4 py-2 text-xs font-black text-red-700 shadow-lg shadow-red-200/50 backdrop-blur dark:border-red-900/60 dark:bg-red-950/40 dark:text-rose-200 dark:shadow-black/20">
            <Sparkles size={15} />
            Realtime Collaborative Notes
          </div>

          <h1 className="max-w-2xl text-6xl font-black tracking-tight text-slate-950 dark:text-slate-50">
            Catatan realtime yang rapi, cepat, dan siap dibagikan.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-red-100/75">
            Login untuk masuk ke workspace, membuka catatan pribadi, dan
            berkolaborasi dengan user lain secara langsung.
          </p>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-red-100 bg-white/80 p-5 shadow-xl shadow-red-200/50 backdrop-blur dark:border-red-900/60 dark:bg-red-950/40 dark:shadow-black/20">
              <Wifi
                className="mb-4 text-red-600 dark:text-rose-300"
                size={24}
              />
              <h3 className="font-black text-slate-950 dark:text-slate-50">
                Realtime Sync
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-red-100/70">
                Perubahan catatan tampil langsung antar pengguna.
              </p>
            </div>

            <div className="rounded-3xl border border-red-100 bg-white/80 p-5 shadow-xl shadow-red-200/50 backdrop-blur dark:border-red-900/60 dark:bg-red-950/40 dark:shadow-black/20">
              <LockKeyhole
                className="mb-4 text-red-600 dark:text-rose-300"
                size={24}
              />
              <h3 className="font-black text-slate-950 dark:text-slate-50">
                Secure Access
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-red-100/70">
                Akses berbasis login dan role collaborator.
              </p>
            </div>
          </div>
        </section>

        <form
          className="relative overflow-hidden rounded-[2.25rem] border border-red-100 bg-white/92 p-7 shadow-2xl shadow-red-300/50 backdrop-blur-2xl dark:border-red-900/60 dark:bg-red-950/50 dark:shadow-black/30 sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-red-500/18 to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-red-500/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-rose-400/14 blur-3xl" />

          <div className="relative mb-8">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-rose-400 via-red-600 to-red-800 text-white shadow-lg shadow-red-600/30">
              <NotebookPen size={28} />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50">
              Login
            </h1>

            <p className="mt-3 leading-7 text-slate-500 dark:text-red-100/75">
              Masuk untuk membuka catatan kolaboratif kamu.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-red-50">
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
            <label className="mb-2 block text-sm font-black text-slate-800 dark:text-red-50">
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
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-red-400 transition hover:bg-red-50 hover:text-red-600 dark:text-rose-200/70 dark:hover:bg-red-900/40 dark:hover:text-rose-200"
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
            className="mt-6 w-full rounded-2xl bg-gradient-to-br from-rose-400 via-red-600 to-red-800 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-red-100/70">
            Belum punya akun?{" "}
            <Link
              href="/?view=register"
              className="font-black text-red-600 transition hover:text-red-800 dark:text-rose-300 dark:hover:text-rose-100"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
