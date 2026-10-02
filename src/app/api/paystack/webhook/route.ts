import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getResendClient } from '@/lib/email'
import { getProjects } from '@/lib/mdx'
import { EMAIL_NOTIFY_TO, OWNER_NAME, SITE_URL } from '@/data/site'

/**
 * POST /api/paystack/webhook
 * ─────────────────────────────────────────────────────────────────────────────
 * Paystack webhook handler for successful payments.
 * 1. Cryptographically verifies the request signature to prevent fraud.
 * 2. Checks the event type (charge.success).
 * 3. Extracts the project ID from metadata and fetches the project details.
 * 4. Automatically emails the customer the deliverable link via Resend.
 * 5. Notifies the admin of the sale.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('[Paystack Webhook] PAYSTACK_SECRET_KEY is missing')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    // ── 1. Verify Signature ──────────────────────────────────────────────────
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex')

    if (hash !== signature) {
      console.warn('[Paystack Webhook] Invalid signature detected')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    // ── 2. Handle 'charge.success' ───────────────────────────────────────────
    if (event.event === 'charge.success') {
      const { data } = event
      const { metadata, customer, amount } = data
      
      const projectId = metadata?.projectId
      const email = customer?.email

      if (!projectId || !email) {
        console.error('[Paystack Webhook] Missing projectId or email in metadata/customer', data)
        return NextResponse.json({ error: 'Invalid payload data' }, { status: 400 })
      }

      // Fetch the project to get the deliverableUrl
      const projects = getProjects()
      const project = projects.find(p => p.id === projectId)

      if (!project) {
        console.error(`[Paystack Webhook] Project not found: ${projectId}`)
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      const resend = getResendClient()
      const formattedAmount = (amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

      // ── 3. Send Deliverable to Customer ────────────────────────────────────
      const deliverableContent = project.deliverableUrl 
        ? `<p>You can access your purchased files here: <br/><br/><a href="${project.deliverableUrl}" style="background-color: ${project.accentColor}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access ${project.name} Files</a></p>`
        : `<p>The files for this project are currently being prepared. ${OWNER_NAME} will contact you shortly with direct access.</p>`

      await resend.emails.send({
        from: `Sales <onboarding@resend.dev>`, // Must be an authenticated domain in production
        to: email,
        subject: `Your Purchase: ${project.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
            <h2>Thank you for your purchase!</h2>
            <p>Your payment of ${formattedAmount} for <strong>${project.name}</strong> was successful.</p>
            ${deliverableContent}
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="color: #666; font-size: 14px;">If you have any issues accessing your files, please reply to this email.</p>
          </div>
        `,
      })

      // ── 4. Notify Admin ────────────────────────────────────────────────────
      await resend.emails.send({
        from: `Sales System <onboarding@resend.dev>`,
        to: EMAIL_NOTIFY_TO,
        subject: `New Sale: ${project.name}`,
        html: `
          <div style="font-family: sans-serif;">
            <h2>🎉 New Sale!</h2>
            <p><strong>Project:</strong> ${project.name}</p>
            <p><strong>Customer Email:</strong> ${email}</p>
            <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
            <p><strong>Reference:</strong> ${data.reference}</p>
          </div>
        `,
      })

      console.log(`[Paystack Webhook] Successfully processed sale for ${project.name} (${email})`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Paystack Webhook Error]', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
