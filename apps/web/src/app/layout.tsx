import './globals.css'

export const metadata = {
  title: 'PULSE-R24',
  description: 'Enterprise intelligence platform'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b1020] text-slate-100">
        <div className="flex min-h-screen">
          <aside className="w-72 bg-gradient-to-b from-[#071022] via-[#07152a] to-[#081826] p-4">
            <div className="text-2xl font-semibold mb-6">PULSE-R24</div>
            <nav className="space-y-2">{/* sidebar placeholder */}</nav>
          </aside>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
