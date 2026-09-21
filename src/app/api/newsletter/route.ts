import { NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email'
import { isValidEmail, sanitizeInput } from '@/lib/sanitize'
import { EMAIL_FROM_NEWSLETTER, EMAIL_NOTIFY_TO, OWNER_NAME, SITE_URL } from '@/data/site'

/**
 * POST /api/newsletter
 * ─────────────────────────────────────────────────────────────────────────────
 * Subscribes an email address to the newsletter:
 *  1. Validates email format
 *  2. Sends a styled welcome confirmation email to the subscriber
 *  3. Sends a notification email to the site owner
 */
export async function POST(req: Request) {
  const resend = getResendClient()

  try {
    const { email } = await req.json()

    // ── Validate email ───────────────────────────────────────
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeEmail = sanitizeInput(email, 320)

    // ── Send welcome confirmation to subscriber ──────────────
    const welcomeResult = await resend.emails.send({
      from: EMAIL_FROM_NEWSLETTER,
      to: safeEmail,
      subject: `You're subscribed — ${OWNER_NAME}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 48px 32px; border-radius: 12px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #555; margin-bottom: 24px; font-family: monospace;">${OWNER_NAME}</p>
          <h1 style="font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2; margin: 0 0 16px;">You're in.</h1>
          <p style="color: #888; line-height: 1.7; font-size: 15px; margin: 0 0 32px;">
            Thanks for subscribing. You'll hear from me when I ship new projects, publish hardware experiments, or write something worth reading. No spam — ever.
          </p>
          <a href="${SITE_URL}/projects" style="display: inline-block; background: #00e5ff; color: #000; font-weight: 600; font-size: 13px; padding: 12px 28px; letter-spacing: 0.05em; text-decoration: none; text-transform: uppercase;">
            View My Work →
          </a>
          <p style="color: #444; font-size: 12px; margin-top: 48px; border-top: 1px solid #1a1a1a; padding-top: 24px;">
            You subscribed at ${SITE_URL.replace(/^https?:\/\//, '')} · <a href="${SITE_URL}" style="color: #00e5ff; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      `,
    })

    if (welcomeResult.error) {
      console.error('[Newsletter Welcome Email Error]', welcomeResult.error)
    }

    // ── Notify site owner ────────────────────────────────────
    const notifyResult = await resend.emails.send({
      from: EMAIL_FROM_NEWSLETTER,
      to: EMAIL_NOTIFY_TO,
      subject: `New subscriber: ${safeEmail}`,
      html: `<p>New newsletter subscriber: <strong>${safeEmail}</strong></p>`,
    })

    if (notifyResult.error) {
      console.error('[Newsletter Notify Email Error]', notifyResult.error)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[newsletter/POST]', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
