import { Suspense } from "react";
import AppRouter from "@/app/components/AppRouter";
import Loading from "@/app/components/Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AppRouter />
    </Suspense>
  );
}
