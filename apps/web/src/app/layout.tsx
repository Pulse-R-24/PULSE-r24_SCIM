import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata = {
  title: 'PULSE-R24',
  description: 'Enterprise intelligence platform'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070d1a] text-slate-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
