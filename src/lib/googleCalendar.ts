import { google } from 'googleapis'

// ─────────────────────────────────────────────────────────────────────────────
// Google Calendar configuration
// ─────────────────────────────────────────────────────────────────────────────
// Provides the shared JWT auth client and time-slot mappings used by the
// booking API routes.

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
]

/**
 * Returns a Google JWT auth client for Calendar API calls.
 *
 * Requires `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` env vars.
 * The private key's escaped `\n` sequences are converted to real newlines.
 */
export function getGoogleAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  })
}

/**
 * Google Calendar ID from environment.
 *
 * Throws at import-time if `GOOGLE_CALENDAR_ID` is missing — failing
 * explicitly prevents silent bugs where the FreeBusy API returns
 * `notFound` errors because it's querying the wrong calendar.
 */
export const CALENDAR_ID = (() => {
  const id = process.env.GOOGLE_CALENDAR_ID
  if (!id) {
    console.error('[googleCalendar] GOOGLE_CALENDAR_ID env var is not set.')
  }
  return id || ''
})()

/**
 * Maps friendly time-slot labels to ISO time components.
 *
 * These labels must match the `TIME_SLOTS` array in `BookQuoteSection.tsx`
 * so the frontend IDs align with the backend lookups.
 */
export const TIME_START: Record<string, string> = {
  '9:00 AM': '09:00:00',
  '1:00 PM': '13:00:00',
  '5:00 PM': '17:00:00',
}

export const TIME_END: Record<string, string> = {
  '9:00 AM': '10:00:00',
  '1:00 PM': '14:00:00',
  '5:00 PM': '18:00:00',
}
