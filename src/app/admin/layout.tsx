import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="admin-shell min-h-screen bg-[#0a0a0a] text-white">
        {children}
      </div>
    </SessionProvider>
  )
}
