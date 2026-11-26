'use client'

import { usePathname } from 'next/navigation'

/**
 * RouteShell
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the public portfolio chrome (grid overlay, ambient glows, Header,
 * Footer) on public pages while letting `/admin/*` manage its own isolated UI.
 */
export function RouteShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return <div className="w-full min-h-screen bg-[#0a0a0a]">{children}</div>
  }

  return (
    <div className="relative flex w-full flex-col min-h-screen bg-[#0a0a0a]">
      {/* Global Background Grid and Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div className="absolute right-0 top-1/4 w-[55vw] h-[55vw] bg-[#00e5ff] opacity-[0.04] rounded-full blur-[120px]" />
        <div className="absolute left-1/4 bottom-0 w-[30vw] h-[30vw] bg-[#7c3aed] opacity-[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col w-full min-h-screen">
        {header}
        <main className="flex-auto w-full">{children}</main>
        {footer}
      </div>
    </div>
  )
}
