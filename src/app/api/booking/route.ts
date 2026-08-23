import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getGoogleAuth, CALENDAR_ID, TIME_START, TIME_END } from '@/lib/googleCalendar'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, projectType, message, date, timeSlot } = body

    if (!name || !email || !projectType || !date || !timeSlot || !TIME_START[timeSlot]) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

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
          timeZone: 'Africa/Lagos',
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

    // Send notification email
    try {
      await resend.emails.send({
        from: 'Bookings <hello@rq-ismail.dev>',
        to: 'rq.ismaeel@gmail.com',
        subject: `New Booking: ${name} (${projectType})`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Project:</strong> ${projectType}</p>
          <p><strong>Date & Time:</strong> ${date} @ ${TIME_START[timeSlot]}</p>
          <p><strong>Message:</strong><br/>${message || 'N/A'}</p>
        `,
      })
    } catch (emailError) {
      console.error('[Resend Error]', emailError)
    }

    // Create Google Calendar event with Meet link
    try {
      await calendar.events.insert({
        calendarId: CALENDAR_ID,
        conferenceDataVersion: 1,
        requestBody: {
          summary: `Project Sync: ${name} (${projectType})`,
          description: `Name: ${name}\\nEmail: ${email}\\nPhone: ${phone || 'N/A'}\\nProject: ${projectType}\\nMessage: ${message || 'N/A'}`,
          start: { dateTime: startDateTime, timeZone: 'Africa/Lagos' },
          end: { dateTime: endDateTime, timeZone: 'Africa/Lagos' },
          attendees: [{ email }],
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
    }

    return NextResponse.json({ success: true, id: bookingId }, { status: 201 })
  } catch (err) {
    console.error('[booking/POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
