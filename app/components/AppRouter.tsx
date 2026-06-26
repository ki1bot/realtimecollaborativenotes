"use client";

import { useSearchParams } from "next/navigation";
import DashboardPage from "@/app/components/DashboardPage";
import LoginPage from "@/app/components/LoginPage";
import NoteEditorPage from "@/app/components/NoteEditorPage";
import RegisterPage from "@/app/components/RegisterPage";

export default function AppRouter() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "login") {
    return <LoginPage />;
  }

  if (view === "register") {
    return <RegisterPage />;
  }

  if (view === "note") {
    return <NoteEditorPage />;
  }

  return <DashboardPage />;
}
