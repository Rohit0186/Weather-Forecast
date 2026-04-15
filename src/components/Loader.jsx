export default function Loader() {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 p-12 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
        <p className="text-sm font-medium">Loading current weather...</p>
      </div>
    </div>
  )
}
