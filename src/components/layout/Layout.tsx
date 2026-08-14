import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full flex-col min-h-screen bg-[#0a0a0a]">
      {/* Global Background Grid and Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div className="absolute right-0 top-1/4 w-[55vw] h-[55vw] bg-[#00e5ff] opacity-[0.04] rounded-full blur-[120px]" />
        <div className="absolute left-1/4 bottom-0 w-[30vw] h-[30vw] bg-[#7c3aed] opacity-[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-auto w-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
