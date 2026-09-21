import { NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email'
import { escapeHtml, isValidEmail, sanitizeInput } from '@/lib/sanitize'
import { EMAIL_FROM_CONTACT, EMAIL_NOTIFY_TO, OWNER_NAME } from '@/data/site'

/**
 * POST /api/contact
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles the contact form submission:
 *  1. Validates & sanitizes input
 *  2. Sends notification email to the site owner
 *  3. Sends an auto-reply acknowledgement to the user
 *
 * All user input is HTML-escaped before embedding in email templates.
 */
export async function POST(req: Request) {
  const resend = getResendClient()

  try {
    const body = await req.json()
    const { name, email, whatsapp, company, inquiryType, budget, message } = body

    // ── Validate required fields ─────────────────────────────
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── Sanitize all input ───────────────────────────────────
    const safeName = sanitizeInput(name, 200)
    const safeEmail = sanitizeInput(email, 320)
    const safeWhatsapp = sanitizeInput(whatsapp || '', 30)
    const safeCompany = sanitizeInput(company || '', 200)
    const safeInquiryType = sanitizeInput(inquiryType || 'General', 100)
    const safeBudget = sanitizeInput(budget || '', 100)
    const safeMessage = sanitizeInput(message, 5000)

    // ── Send notification email to owner ─────────────────────
    const adminResult = await resend.emails.send({
      from: EMAIL_FROM_CONTACT,
      to: EMAIL_NOTIFY_TO,
      subject: `New Inquiry: ${safeInquiryType} from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(safeWhatsapp) || 'N/A'}</p>
        <p><strong>Company:</strong> ${escapeHtml(safeCompany) || 'N/A'}</p>
        <p><strong>Inquiry Type:</strong> ${escapeHtml(safeInquiryType)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(safeBudget)}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}</p>
      `,
    })

    if (adminResult.error) {
      console.error('[Contact Admin Email Error]', adminResult.error)
    }

    // ── Send auto-reply to the user ──────────────────────────
    const clientResult = await resend.emails.send({
      from: EMAIL_FROM_CONTACT,
      to: safeEmail,
      subject: 'Thanks for reaching out',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 48px 32px; border-radius: 12px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #555; margin-bottom: 24px; font-family: monospace;">${OWNER_NAME}</p>
          <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.2; margin: 0 0 16px;">Message Received.</h1>
          <p style="color: #888; line-height: 1.7; font-size: 15px; margin: 0 0 32px;">
            Hi ${escapeHtml(safeName)},<br/><br/>
            Thanks for getting in touch. I've received your inquiry regarding <strong>${escapeHtml(safeInquiryType)}</strong> and I'll get back to you as soon as possible.
          </p>
          <p style="color: #444; font-size: 12px; margin-top: 48px; border-top: 1px solid #1a1a1a; padding-top: 24px;">
            ${OWNER_NAME} · Software Engineer &amp; Hardware Technician
          </p>
        </div>
      `,
    })

    if (clientResult.error) {
      console.error('[Contact Client Email Error]', clientResult.error)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('[contact/POST]', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
