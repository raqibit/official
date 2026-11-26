import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RouteShell } from '@/components/layout/RouteShell'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RouteShell header={<Header />} footer={<Footer />}>
      {children}
    </RouteShell>
  )
}
