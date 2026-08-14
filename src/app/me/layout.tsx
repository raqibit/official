'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { LogoutButton } from '@/components/ui/LogoutButton'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a] text-white pt-16">
      {/* Background Grid and Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div className="absolute right-0 top-0 w-[40vw] h-[40vw] bg-[#00e5ff] opacity-[0.03] rounded-full blur-[100px]" />
        <div className="absolute left-0 bottom-0 w-[40vw] h-[40vw] bg-[#7c3aed] opacity-[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="relative z-10 w-64 border-r border-[rgba(255,255,255,0.05)] bg-transparent hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 shrink-0">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gray-500 font-mono">
              Admin / Studio
            </h2>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/me"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-mono rounded-md transition-all",
                pathname === '/me' ? "text-white bg-[rgba(255,255,255,0.1)]" : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Overview
            </Link>
            <Link
              href="/me/projects"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-mono rounded-md transition-all",
                pathname.includes('/projects') ? "text-[#00e5ff] bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)]" : "text-gray-400 hover:text-[#00e5ff] hover:bg-[rgba(255,255,255,0.05)] border border-transparent"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Projects
            </Link>

            <Link
              href="/me/settings"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-mono rounded-md transition-all",
                pathname.includes('/settings') ? "text-white bg-[rgba(255,255,255,0.1)]" : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </Link>
            <Link
              href="/me/trash"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-mono rounded-md transition-all mt-4 border-t border-[rgba(255,255,255,0.05)] pt-4",
                pathname.includes('/trash') ? "text-red-400 bg-[rgba(248,113,113,0.05)] border-t-[rgba(248,113,113,0.2)]" : "text-gray-400 hover:text-red-400 hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Trash
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-[rgba(255,255,255,0.05)]">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-sm font-mono text-gray-500 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Exit Studio
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-[rgba(255,255,255,0.05)] px-4 py-4">
        <Link href="/me" className={clsx("p-3 rounded-full transition-all", pathname === '/me' ? "text-white bg-[rgba(255,255,255,0.1)]" : "text-gray-500 hover:text-white")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </Link>
        <Link href="/me/projects" className={clsx("p-3 rounded-full transition-all", pathname.includes('/projects') ? "text-[#00e5ff] bg-[rgba(0,229,255,0.1)]" : "text-gray-500 hover:text-[#00e5ff]")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </Link>

        <Link href="/me/settings" className={clsx("p-3 rounded-full transition-all", pathname.includes('/settings') ? "text-white bg-[rgba(255,255,255,0.1)]" : "text-gray-500 hover:text-white")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </Link>
        <Link href="/me/trash" className={clsx("p-3 rounded-full transition-all", pathname.includes('/trash') ? "text-red-400 bg-[rgba(248,113,113,0.1)]" : "text-gray-500 hover:text-red-400")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </Link>
        <Link href="/" className="p-3 rounded-full text-gray-500 hover:text-red-400 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </Link>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 min-w-0 p-4 md:p-8 lg:p-12 pb-28 md:pb-8 h-[calc(100vh-64px)] overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
