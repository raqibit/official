import { NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email'
import { escapeHtml, isValidEmail, sanitizeInput } from '@/lib/sanitize'
import { EMAIL_FROM_CONTACT, EMAIL_NOTIFY_TO } from '@/data/site'

/**
 * POST /api/contact
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles the contact form submission:
 *  1. Validates & sanitizes input
 *  2. Sends notification email to the site owner (with WhatsApp reply link)
 *
 * All user input is HTML-escaped before embedding in email templates.
 */
export async function POST(req: Request) {
  try {
    const resend = getResendClient()
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
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>WhatsApp:</strong> ${escapeHtml(safeWhatsapp) || 'N/A'}</p>
          <p><strong>Company:</strong> ${escapeHtml(safeCompany) || 'N/A'}</p>
          <p><strong>Inquiry Type:</strong> ${escapeHtml(safeInquiryType)}</p>
          <p><strong>Budget:</strong> ${escapeHtml(safeBudget)}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}</p>
          ${safeWhatsapp ? `
          <div style="margin-top: 24px;">
            <a href="https://wa.me/${safeWhatsapp.replace(/[^0-9]/g, '')}" style="background-color: #25D366; color: white; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reply on WhatsApp
            </a>
          </div>
          ` : ''}
        </div>
      `,
    })

    if (adminResult.error) {
      console.error('[Contact Admin Email Error]', adminResult.error)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('[contact/POST]', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
