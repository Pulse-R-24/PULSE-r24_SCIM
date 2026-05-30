import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerSessionFromHeaders, hasAnyRole, RoleName } from '@pulse-r24/auth'

export default async function DashboardPage() {
  const session = await getServerSessionFromHeaders(new Headers(await headers()))

  if (!session) {
    redirect('/auth/signin')
  }

  const authorized = hasAnyRole(session, [RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.ANALYST])
  if (!authorized) {
    redirect('/unauthorized')
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Protected Dashboard</h2>
        <span className="text-slate-400">{session.user.email}</span>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-6">Secure analytics and reporting overview</div>
        <div className="glass rounded-xl p-6">Workflow and publication queue</div>
      </div>
    </div>
  )
}
