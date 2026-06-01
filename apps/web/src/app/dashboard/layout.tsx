import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerSessionFromHeaders, hasAnyRole, RoleName } from '@pulse-r24/auth'
import { Sidebar } from '@/components/Sidebar'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSessionFromHeaders(new Headers(await headers()))

  if (!session) {
    redirect('/auth/signin')
  }

  const authorized = hasAnyRole(session, [RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.ANALYST, RoleName.EDITOR, RoleName.FACT_CHECKER, RoleName.PUBLISHER])
  if (!authorized) {
    redirect('/unauthorized')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex justify-end">
          <NotificationBell />
        </div>
        {children}
      </main>
    </div>
  )
}
