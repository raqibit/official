import { NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email'
import { isValidEmail, sanitizeInput } from '@/lib/sanitize'
import { EMAIL_FROM_NEWSLETTER, EMAIL_NOTIFY_TO } from '@/data/site'

/**
 * POST /api/newsletter
 * ─────────────────────────────────────────────────────────────────────────────
 * Subscribes an email address to the newsletter:
 *  1. Validates email format
 *  2. Sends a notification email to the site owner with the new subscriber
 */
export async function POST(req: Request) {
  try {
    const resend = getResendClient()
    const { email } = await req.json()

    // ── Validate email ───────────────────────────────────────
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeEmail = sanitizeInput(email, 320)

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
