// ─────────────────────────────────────────────────────────────────────────────
// Navigation link data — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
// Shared by Header (desktop + mobile nav) and Footer so links stay in sync.

/** A navigation link entry */
export type NavLink = {
  href: string
  label: string
}

/**
 * Primary navigation links shown in the header nav bar.
 * The home link ("/") is intentionally excluded — the avatar serves that role.
 */
export const navLinks: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/uses', label: 'Uses' },
]

/**
 * Full set of page links including Home — used in the footer.
 */
export const pageLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  ...navLinks,
]
