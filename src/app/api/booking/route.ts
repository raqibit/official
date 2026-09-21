import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getGoogleAuth, CALENDAR_ID, TIME_START, TIME_END } from '@/lib/googleCalendar'
import { getResendClient } from '@/lib/email'
import crypto from 'crypto'
import { escapeHtml, isValidEmail, sanitizeInput } from '@/lib/sanitize'
import { EMAIL_FROM_BOOKING, EMAIL_NOTIFY_TO, OWNER_NAME, TIMEZONE_IANA } from '@/data/site'

/**
 * POST /api/booking
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates a calendar booking:
 *  1. Validates & sanitizes all input
 *  2. Double-checks slot availability via Google Calendar FreeBusy
 *  3. Sends notification email via Resend
 *  4. Inserts Google Calendar event with Meet link
 *
 * Designed to be resilient — calendar and email failures are logged but
 * never block the booking from succeeding. The user always gets feedback.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, projectType, message, date, timeSlot } = body

    // ── Validate required fields ─────────────────────────────
    if (!name || !email || !projectType || !date || !timeSlot || !TIME_START[timeSlot]) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // ── Sanitize all user input ──────────────────────────────
    const safeName = sanitizeInput(name, 200)
    const safeEmail = sanitizeInput(email, 320)
    const safePhone = sanitizeInput(phone || '', 30)
    const safeProjectType = sanitizeInput(projectType, 200)
    const safeMessage = sanitizeInput(message || '', 2000)

    const startDateTime = `${date}T${TIME_START[timeSlot]}+01:00`
    const endDateTime = `${date}T${TIME_END[timeSlot]}+01:00`

    const bookingId = crypto.randomUUID()

    // ── Check calendar availability (non-blocking) ───────────
    // If the calendar check fails (auth issues, permissions, etc.)
    // we still accept the booking. The calendar is a convenience,
    // not a gatekeeper.
    let calendarAvailable = true
    let calendar: ReturnType<typeof google.calendar> | null = null

    try {
      calendar = google.calendar({ version: 'v3', auth: getGoogleAuth() })

      const freeBusy = await calendar.freebusy.query({
        requestBody: {
          timeMin: startDateTime,
          timeMax: endDateTime,
          timeZone: TIMEZONE_IANA,
          items: [{ id: CALENDAR_ID }],
        },
      })

      const calendarData = freeBusy.data.calendars?.[CALENDAR_ID]

      // Handle permission errors gracefully
      if (calendarData?.errors && calendarData.errors.length > 0) {
        console.warn('[booking] Calendar returned errors:', JSON.stringify(calendarData.errors))
      } else {
        const busySlots = calendarData?.busy
        if (busySlots && busySlots.length > 0) {
          calendarAvailable = false
        }
      }
    } catch (gcalError: unknown) {
      const msg = gcalError instanceof Error ? gcalError.message : String(gcalError)
      console.warn('[booking] Calendar check failed (proceeding anyway):', msg)
    }

    if (!calendarAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another.' },
        { status: 409 },
      )
    }

    // ── Send notification emails (non-blocking) ──────────────
    // Without a verified domain, Resend only delivers to your own
    // registered email. We send admin notification first (always works),
    // then attempt client confirmation (may fail in testing mode).
    try {
      const resend = getResendClient()

      // 1. Admin notification — always send to your own email
      const adminEmail = await resend.emails.send({
        from: EMAIL_FROM_BOOKING,
        to: EMAIL_NOTIFY_TO,
        subject: `New Booking: ${safeName} (${safeProjectType})`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(safePhone) || 'N/A'}</p>
          <p><strong>Project:</strong> ${escapeHtml(safeProjectType)}</p>
          <p><strong>Date & Time:</strong> ${escapeHtml(date)} @ ${TIME_START[timeSlot]} (GMT+1)</p>
          <p><strong>Message:</strong><br/>${escapeHtml(safeMessage) || 'N/A'}</p>
        `,
      })

      if (adminEmail.error) {
        console.error('[Resend Admin Error]', adminEmail.error)
      }

      // 2. Client confirmation — will fail if domain not verified
      //    and client email ≠ your registered Resend email
      const clientEmail = await resend.emails.send({
        from: EMAIL_FROM_BOOKING,
        to: safeEmail,
        subject: `Booking Confirmed: Project Sync with ${OWNER_NAME}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <h2>Session Confirmed</h2>
            <p>Hi ${escapeHtml(safeName)},</p>
            <p>Thanks for reaching out! Your project sync session is confirmed for <strong>${escapeHtml(date)} at ${TIME_START[timeSlot]} (GMT+1)</strong>.</p>
            <p>You should also receive a Google Calendar invitation shortly containing the Google Meet video link for our call.</p>
            <p>Looking forward to discussing your project!<br/><br/>Best,<br/>${OWNER_NAME}</p>
          </div>
        `,
      })

      if (clientEmail.error) {
        // Expected in Resend testing mode — not a real error
        console.warn('[Resend Client Email]', clientEmail.error.message || clientEmail.error)
      }
    } catch (emailError: unknown) {
      const msg = emailError instanceof Error ? emailError.message : String(emailError)
      console.warn('[Resend] Email sending failed (booking still succeeds):', msg)
    }

    // ── Create Google Calendar event (non-blocking) ──────────
    if (calendar) {
      try {
        await calendar.events.insert({
          calendarId: CALENDAR_ID,
          conferenceDataVersion: 1,
          requestBody: {
            summary: `Project Sync: ${safeName} (${safeProjectType})`,
            description: `Name: ${safeName}\nEmail: ${safeEmail}\nPhone: ${safePhone || 'N/A'}\nProject: ${safeProjectType}\nMessage: ${safeMessage || 'N/A'}`,
            start: { dateTime: startDateTime, timeZone: TIMEZONE_IANA },
            end: { dateTime: endDateTime, timeZone: TIMEZONE_IANA },
            attendees: [{ email: safeEmail }],
            conferenceData: {
              createRequest: {
                requestId: bookingId,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
              },
            },
          },
        })
      } catch (insertError: unknown) {
        const msg = insertError instanceof Error ? insertError.message : String(insertError)
        console.warn('[Calendar Insert] Event creation failed (booking still succeeds):', msg)
      }
    }

    // ── Always return success with booking ID ────────────────
    return NextResponse.json({ success: true, id: bookingId }, { status: 201 })
  } catch (err: unknown) {
    // Top-level catch — ensures we ALWAYS return valid JSON
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[booking/POST] Unhandled error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
