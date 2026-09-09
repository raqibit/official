'use client'

import { createContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// Tracks the previous route for page transition animations
export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [previousPathname, setPreviousPathname] = useState<string | undefined>(undefined)
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    setPreviousPathname(pathnameRef.current)
    pathnameRef.current = pathname
  }, [pathname])

  return (
    <AppContext.Provider value={{ previousPathname }}>
      {children}
    </AppContext.Provider>
  )
}
