// ─────────────────────────────────────────────────────────────────────────────
// Input sanitization & validation utilities
// ─────────────────────────────────────────────────────────────────────────────
// Used by API routes to prevent XSS in email templates and validate user input.

/**
 * Escapes HTML special characters to prevent XSS injection.
 * Must be applied to ALL user-supplied values before embedding in HTML emails.
 *
 * @example
 * escapeHtml('<script>alert("xss")</script>')
 * // → '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Validates an email address format using a practical regex.
 * Not RFC 5322 exhaustive, but catches 99% of invalid inputs.
 *
 * @example
 * isValidEmail('user@example.com') // → true
 * isValidEmail('not-an-email')     // → false
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Trims whitespace and enforces a maximum character length on input strings.
 * Returns the sanitized string.
 *
 * @param input - Raw user input
 * @param maxLength - Maximum allowed characters (default: 1000)
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  return input.trim().slice(0, maxLength)
}
