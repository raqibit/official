'use client'

import { createContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [previousPathname, setPreviousPathname] = useState<string | undefined>(undefined)
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    // Store the previous pathname before it changes
    setPreviousPathname(pathnameRef.current)
    pathnameRef.current = pathname
  }, [pathname])

  return (
    <AppContext.Provider value={{ previousPathname }}>
      {children}
    </AppContext.Provider>
  )
}
