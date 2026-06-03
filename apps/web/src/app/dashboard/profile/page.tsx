import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerSessionFromHeaders } from '@pulse-r24/auth'
import { getActivityFeed } from '@modules/activities'
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui/Card'
import { formatRole, getDisplayName, getInitials, getSessionPermissions } from '@/components/account/accountUtils'

export const metadata: Metadata = {
  title: 'Profile | PULSE-R24'
}

function formatDate(date?: string | Date | null) {
  if (!date) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(typeof date === 'string' ? new Date(date) : date)
}

function formatAction(action: string) {
  return action.replace(/_/g, ' ')
}

export default async function ProfilePage() {
  const session = await getServerSessionFromHeaders(new Headers(await headers()))
  if (!session) redirect('/auth/signin')

  const permissions = getSessionPermissions(session)
  const recentActivity = await getActivityFeed({ actorId: session.user.id, take: 5 })

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="relative overflow-hidden rounded-2xl border border-rose-500/15 bg-[radial-gradient(circle_at_top_right,rgba(190,18,60,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))] p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-rose-500/60 via-cyan-300/25 to-transparent" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-700 to-red-950 text-xl font-black text-white shadow-xl shadow-rose-950/30">
            {getInitials(session)}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rose-200">Staff Account</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{getDisplayName(session)}</h1>
            <p className="mt-1 text-sm text-slate-400">{session.user.email}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <InfoRow label="Name" value={session.user.name || 'Not provided'} />
            <InfoRow label="Email" value={session.user.email} />
            <InfoRow label="Primary Role" value={formatRole(session.user.roles[0])} />
            <InfoRow label="All Roles" value={session.user.roles.map(formatRole).join(', ') || 'No roles assigned'} />
            <InfoRow label="Account Created" value="Not available in current session" />
            <InfoRow label="Session Expires" value={formatDate(session.expires)} />
            <InfoRow label="Authentication" value="Signed in with Auth.js session" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {permissions.length ? (
              <div className="flex flex-wrap gap-2">
                {permissions.map((item) => (
                  <span key={item.permission} className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
                    {item.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No permissions are available for this session.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length ? (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold capitalize text-slate-200">{formatAction(item.action)}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{formatDate(item.created_at)}</p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.entityType}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No recent activity found" description="Activity will appear here after this account performs workflow actions." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  )
}
