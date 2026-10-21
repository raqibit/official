import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getResendClient } from '@/lib/email'
import { getProjects } from '@/lib/mdx'
import { EMAIL_NOTIFY_TO, OWNER_NAME } from '@/data/site'

/**
 * POST /api/paystack/webhook
 * ─────────────────────────────────────────────────────────────────────────────
 * Paystack webhook handler for successful payments.
 *
 * Flow:
 *  1. Cryptographically verifies the request signature (HMAC-SHA512)
 *  2. Extracts the project ID and customer email from the event payload
 *  3. Sends an admin notification with full sale details + deliverable link
 *
 * NOTE: On the free Resend tier (onboarding@resend.dev), emails can only be
 * sent to the verified owner address. The admin receives the customer email
 * and deliverable URL so they can manually forward the files to the buyer.
 * Once a custom domain is verified on Resend, the customer auto-email can
 * be re-enabled below.
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
      const { metadata, customer, amount, currency } = data

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

      // Format amount using the actual currency from Paystack response
      const displayCurrency = currency || 'USD'
      const formattedAmount = (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: displayCurrency,
      })

      // ── 3. Notify Admin (with deliverable link for manual forwarding) ──────
      const deliverableSection = project.deliverableUrl
        ? `<p><strong>Deliverable URL:</strong> <a href="${project.deliverableUrl}">${project.deliverableUrl}</a></p>
           <p style="color: #666; font-size: 13px;">Forward this link to the customer at <strong>${email}</strong></p>`
        : `<p style="color: #e74c3c;"><strong>⚠ No deliverableUrl set</strong> for this project. Please prepare the files and send them to <strong>${email}</strong> manually.</p>`

      await resend.emails.send({
        from: `Sales System <onboarding@resend.dev>`,
        to: EMAIL_NOTIFY_TO,
        subject: `💰 New Sale: ${project.name} — ${formattedAmount}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
            <h2>🎉 New Sale!</h2>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
            <p><strong>Project:</strong> ${project.name}</p>
            <p><strong>Customer Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
            <p><strong>Reference:</strong> <code>${data.reference}</code></p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
            <h3>📦 Delivery</h3>
            ${deliverableSection}
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
            <p style="color: #999; font-size: 12px;">
              Once you verify a custom domain on Resend, automatic customer delivery will be enabled.
              Until then, please forward the deliverable to the customer manually.
            </p>
          </div>
        `,
      })

      // ── 4. Auto-deliver to customer (DISABLED — requires verified domain) ──
      // Uncomment the block below once you have a verified domain on Resend.
      // Replace 'onboarding@resend.dev' with your domain email.
      //
      // const deliverableContent = project.deliverableUrl
      //   ? `<p>Access your files here:<br/><br/><a href="${project.deliverableUrl}" style="background-color: ${project.accentColor}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access ${project.name} Files</a></p>`
      //   : `<p>Your files are being prepared. ${OWNER_NAME} will contact you shortly.</p>`
      //
      // await resend.emails.send({
      //   from: `${OWNER_NAME} <sales@yourdomain.com>`,
      //   to: email,
      //   subject: `Your Purchase: ${project.name}`,
      //   html: `
      //     <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
      //       <h2>Thank you for your purchase!</h2>
      //       <p>Your payment of ${formattedAmount} for <strong>${project.name}</strong> was successful.</p>
      //       ${deliverableContent}
      //       <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      //       <p style="color: #666; font-size: 14px;">If you have any issues, please reply to this email.</p>
      //     </div>
      //   `,
      // })

      console.log(`[Paystack Webhook] Sale processed: ${project.name} → ${email} (${formattedAmount})`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Paystack Webhook Error]', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
