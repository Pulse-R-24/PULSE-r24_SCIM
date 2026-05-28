// Server component placeholder for protected dashboard
// Replace the placeholder session check with a server-side Auth.js session check

import React from 'react'

export default function DashboardPage() {
  // TODO: perform server-side session retrieval (getServerSession/getToken) and RBAC checks
  return (
    <div>
      <h2 className="text-2xl font-bold">Protected Dashboard</h2>
      <p className="text-slate-400">Only authenticated users should see this.</p>
    </div>
  )
}
