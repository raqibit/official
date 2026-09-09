// ─────────────────────────────────────────────────────────────────────────────
// Shared utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamps a number between a and b (order-independent).
 */
export function clamp(number: number, a: number, b: number): number {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.min(Math.max(number, min), max)
}

/**
 * Formats a Date object into a human-readable string.
 * e.g. "Monday, 9 September"
 */
export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/**
 * Converts a Date to a timezone-safe "YYYY-MM-DD" string.
 * Uses the local timezone offset so the date doesn't shift to the previous day
 * when the browser is behind UTC.
 */
export function toLocalDateString(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .split('T')[0]
}
