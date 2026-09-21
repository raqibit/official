// ─────────────────────────────────────────────────────────────────────────────
// Shared Resend email client
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the Resend SDK instance. All API routes import
// from here instead of independently instantiating the client.

import { Resend } from 'resend'

/** Lazily-initialised singleton — created on first call, reused thereafter. */
let _client: Resend | null = null

/**
 * Returns a shared Resend client instance.
 *
 * Validates that the `RESEND_API_KEY` env var is set. In development the key
 * may be a placeholder, so we only warn rather than crash the server.
 */
export function getResendClient(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY

    if (!key) {
      console.warn('[email] RESEND_API_KEY is not set — emails will fail silently.')
    }

    _client = new Resend(key)
  }

  return _client
}
