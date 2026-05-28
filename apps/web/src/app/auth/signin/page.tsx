export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#081226] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 glass shadow-xl">
        <h1 className="text-3xl font-semibold mb-4">Sign in to PULSE-R24</h1>
        <p className="text-slate-400 mb-6">Secure access to analytics, reports, and intelligence workflows.</p>
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-4 text-white">Auth.js is configured centrally in `packages/auth`.</div>
          <div className="rounded-xl bg-slate-900 p-4 text-slate-300">Implement provider forms or external auth flows in the future.</div>
        </div>
      </div>
    </div>
  )
}
