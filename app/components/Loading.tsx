export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-950" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400" />
          <div className="absolute inset-3 rounded-full bg-blue-600/10 dark:bg-blue-400/10" />
        </div>

        <p className="text-sm font-black tracking-wide text-slate-500 dark:text-slate-400">
          Memuat data...
        </p>
      </div>
    </div>
  );
}
