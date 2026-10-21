import { NextResponse } from 'next/server'
import { isValidEmail } from '@/lib/sanitize'
import { SITE_URL } from '@/data/site'

/**
 * POST /api/paystack/checkout
 * ─────────────────────────────────────────────────────────────────────────────
 * Initializes a Paystack transaction.
 * Receives the project ID, price, and customer email from the frontend.
 * Returns the Paystack authorization URL to redirect the user to.
 */
export async function POST(req: Request) {
  try {
    const { projectId, projectName, price, email } = await req.json()

    // ── Validation ────────────────────────────────────────────────────────
    if (!projectId || !price || !email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('[Paystack] PAYSTACK_SECRET_KEY is missing from environment variables')
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 })
    }

    // ── Initialize Transaction ─────────────────────────────────────────────
    // Paystack expects amount in kobo (base subunit), so multiply by 100.
    const amountInKobo = Math.round(price * 100)

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        currency: 'USD',
        callback_url: `${SITE_URL}/projects?payment=success&projectId=${projectId}`,
        metadata: {
          projectId,
          projectName,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      console.error('[Paystack Initialization Error]', data)
      throw new Error(data.message || 'Failed to initialize payment')
    }

    // ── Return Auth URL ────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    })
  } catch (err: unknown) {
    console.error('[paystack/checkout/POST]', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
