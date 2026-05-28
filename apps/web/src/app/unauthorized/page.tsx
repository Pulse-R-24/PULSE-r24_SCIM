export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#081226] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 glass shadow-xl">
        <h1 className="text-3xl font-semibold mb-4">Access Denied</h1>
        <p className="text-slate-400">You do not have permission to view this page.</p>
      </div>
    </div>
  )
}
