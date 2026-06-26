export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-blue-300 bg-white/70 px-6 py-14 text-center shadow-xl backdrop-blur dark:border-blue-900 dark:bg-slate-900/60">
      <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
