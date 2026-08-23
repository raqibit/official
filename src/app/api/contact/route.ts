import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, whatsapp, company, inquiryType, budget, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Send notification email to you
    await resend.emails.send({
      from: 'Contact Form <hello@rq-ismail.dev>',
      to: 'rq.ismaeel@gmail.com',
      subject: `New Inquiry: ${inquiryType} from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    // Send auto-reply to the user
    await resend.emails.send({
      from: 'Roqeeb Ismail <hello@rq-ismail.dev>',
      to: email,
      subject: 'Thanks for reaching out',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 48px 32px; border-radius: 12px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #555; margin-bottom: 24px; font-family: monospace;">Roqeeb Ismail</p>
          <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.2; margin: 0 0 16px;">Message Received.</h1>
          <p style="color: #888; line-height: 1.7; font-size: 15px; margin: 0 0 32px;">
            Hi ${name},<br/><br/>
            Thanks for getting in touch. I've received your inquiry regarding <strong>${inquiryType}</strong> and I'll get back to you as soon as possible.
          </p>
          <p style="color: #444; font-size: 12px; margin-top: 48px; border-top: 1px solid #1a1a1a; padding-top: 24px;">
            Roqeeb Ismail · Software Engineer & Hardware Technician
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[contact/POST]', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
