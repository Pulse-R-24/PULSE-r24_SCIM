export default function Page() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-slate-400">Welcome back — Analyst</div>
      </header>

      <section className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-gradient-to-br from-white/5 to-white/2 rounded-lg p-4">Main content</div>
        <aside className="bg-gradient-to-br from-white/3 to-white/2 rounded-lg p-4">Activity</aside>
      </section>
    </div>
  )
}
