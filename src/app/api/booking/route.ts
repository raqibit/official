import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getGoogleAuth, CALENDAR_ID, TIME_START, TIME_END } from '@/lib/googleCalendar'
import { Resend } from 'resend'
import crypto from 'crypto'
import { escapeHtml, isValidEmail, sanitizeInput } from '@/lib/sanitize'
import { EMAIL_FROM_BOOKING, EMAIL_NOTIFY_TO, TIMEZONE_IANA } from '@/data/site'

/**
 * POST /api/booking
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates a calendar booking:
 *  1. Validates & sanitizes all input
 *  2. Double-checks slot availability via Google Calendar FreeBusy
 *  3. Sends notification email via Resend
 *  4. Inserts Google Calendar event with Meet link
 */
export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Validate date format (YYYY-MM-DD)
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

    let calendar
    try {
      calendar = google.calendar({ version: 'v3', auth: getGoogleAuth() })

      // Double-check slot is still free at time of booking
      const freeBusy = await calendar.freebusy.query({
        requestBody: {
          timeMin: startDateTime,
          timeMax: endDateTime,
          timeZone: TIMEZONE_IANA,
          items: [{ id: CALENDAR_ID }],
        },
      })

      const busySlots = freeBusy.data.calendars?.[CALENDAR_ID]?.busy
      if (busySlots && busySlots.length > 0) {
        return NextResponse.json(
          { error: 'This time slot is no longer available' },
          { status: 409 },
        )
      }
    } catch (gcalError) {
      console.error('[Google Calendar Auth/FreeBusy Error]', gcalError)
      return NextResponse.json(
        { error: 'Calendar service unavailable. Check Service Account permissions.' },
        { status: 500 },
      )
    }

    const bookingId = crypto.randomUUID()

    // ── Send notification emails (HTML-escaped to prevent XSS) ──
    try {
      // 1. Email to You (Admin Notification)
      await resend.emails.send({
        from: EMAIL_FROM_BOOKING,
        to: EMAIL_NOTIFY_TO,
        subject: `New Booking: ${safeName} (${safeProjectType})`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(safePhone) || 'N/A'}</p>
          <p><strong>Project:</strong> ${escapeHtml(safeProjectType)}</p>
          <p><strong>Date & Time:</strong> ${escapeHtml(date)} @ ${TIME_START[timeSlot]}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(safeMessage) || 'N/A'}</p>
        `,
      })

      // 2. Email to Client (Confirmation)
      await resend.emails.send({
        from: EMAIL_FROM_BOOKING,
        to: safeEmail,
        subject: `Booking Confirmed: Project Sync with Raqīb Ismāʿīl`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <h2>Session Confirmed</h2>
            <p>Hi ${escapeHtml(safeName)},</p>
            <p>Thanks for reaching out! Your project sync session is confirmed for <strong>${escapeHtml(date)} at ${TIME_START[timeSlot]} (GMT+1)</strong>.</p>
            <p>You should also receive a Google Calendar invitation shortly containing the Google Meet video link for our call.</p>
            <p>Looking forward to discussing your project!<br/><br/>Best,<br/>Raqīb Ismāʿīl</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('[Resend Error]', emailError)
      // Non-blocking — booking still succeeds even if email fails
    }

    // ── Create Google Calendar event with Meet link ──────────
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
    } catch (insertError) {
      console.error('[Google Calendar Insert Error]', insertError)
      // Non-blocking — the booking ID is still returned
    }

    return NextResponse.json({ success: true, id: bookingId }, { status: 201 })
  } catch (err: unknown) {
    console.error('[booking/POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
