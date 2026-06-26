import { FilePlus2 } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-blue-300 bg-white/75 px-6 py-16 text-center shadow-xl shadow-slate-200/60 backdrop-blur dark:border-blue-900/70 dark:bg-slate-900/70 dark:shadow-black/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent" />

      <div className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
        <FilePlus2 size={30} />
      </div>

      <h3 className="relative text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h3>

      <p className="relative mx-auto mt-3 max-w-xl leading-7 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
