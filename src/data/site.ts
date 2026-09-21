// ─────────────────────────────────────────────────────────────────────────────
// Site-wide constants
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for brand identity, owner details, and environment
// config used across layouts, metadata, emails, and footer.

/** The canonical production URL of the site (falls back to localhost in dev) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/** Owner / brand identity */
export const OWNER_NAME = 'Raqīb Ismāʿīl'
export const OWNER_EMAIL = 'raqibit3@gmail.com'
export const OWNER_TITLE = 'Software Engineer'

/** Canonical domain — used in email templates and metadata fallbacks */
export const SITE_DOMAIN = 'raqibit.io'

/** Geographic + timezone info shown in footer and contact section */
export const LOCATION = 'Lagos, Nigeria'
export const TIMEZONE = 'UTC+1'
export const TIMEZONE_IANA = 'Africa/Lagos'

/** Email sender addresses (Resend) */
export const EMAIL_FROM_CONTACT = 'Contact Form <onboarding@resend.dev>'
export const EMAIL_FROM_BOOKING = 'Bookings <onboarding@resend.dev>'
export const EMAIL_FROM_NEWSLETTER = 'Raqīb Ismāʿīl <onboarding@resend.dev>'
export const EMAIL_NOTIFY_TO = 'raqibit3@gmail.com'

/** Brand colour palette — mirrors CSS custom properties */
export const BRAND = {
  cyan: '#00e5ff',
  purple: '#7c3aed',
  amber: '#f59e0b',
  surface: '#0a0a0a',
  surface2: '#111111',
} as const
