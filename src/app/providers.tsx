'use client'

/**
 * Providers
 * ─────────────────────────────────────────────────────────────────────────────
 * Root client-side provider wrapper. Currently a pass-through — kept as a
 * single point of extension for future context providers (auth, theme, etc.).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
