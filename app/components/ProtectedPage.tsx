"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import Loading from "@/app/components/Loading";

export default function ProtectedPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/?view=login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return <Loading />;
  }

  return <>{children}</>;
}
