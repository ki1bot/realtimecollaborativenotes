"use client";

import axios from "axios";
import {
  Eye,
  EyeOff,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

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
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-500/15";

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
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-5 py-8 text-slate-950 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(203,213,225,0.72),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(226,232,240,0.88),transparent_30%),radial-gradient(circle_at_72%_88%,rgba(148,163,184,0.38),transparent_34%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-xs font-black text-slate-700 shadow-lg shadow-slate-200/50 backdrop-blur">
            <Sparkles size={15} />
            Mulai workspace baru
          </div>

          <h1 className="max-w-2xl text-6xl font-black tracking-tight text-slate-950">
            Bangun catatan kolaboratif yang jelas dari awal.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            Buat akun, mulai note pertama, lalu bagikan akses sebagai viewer
            atau editor kepada user lain.
          </p>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur">
              <Users className="mb-4 text-slate-600" size={24} />
              <h3 className="font-black text-slate-950">Collaborator</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Bagikan note dengan role yang jelas.
              </p>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur">
              <ShieldCheck className="mb-4 text-slate-600" size={24} />
              <h3 className="font-black text-slate-950">Protected</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Setiap note hanya bisa diakses user yang berhak.
              </p>
            </div>
          </div>
        </section>

        <form
          className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/90 p-7 shadow-2xl shadow-slate-300/60 backdrop-blur-2xl sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-300/30 to-transparent" />

          <div className="relative mb-8">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 text-white shadow-lg shadow-slate-400/30">
              <NotebookPen size={28} />
            </div>

            <h1 className="text-4xl font-black tracking-tight">Register</h1>

            <p className="mt-3 leading-7 text-slate-500">
              Buat akun untuk mulai menulis catatan realtime.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800">
              Nama
            </label>

            <input
              value={name}
              className={inputClass}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama kamu"
              required
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-black text-slate-800">
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
            <label className="mb-2 block text-sm font-black text-slate-800">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className={`${inputClass} pr-12`}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
            className="mt-6 w-full rounded-2xl bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-400/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link
              href="/?view=login"
              className="font-black text-slate-700 transition hover:text-slate-950"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
