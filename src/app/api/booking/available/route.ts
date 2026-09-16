import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getGoogleAuth, CALENDAR_ID, TIME_START, TIME_END } from '@/lib/googleCalendar'
import { TIMEZONE_IANA } from '@/data/site'

/**
 * GET /api/booking/available?date=YYYY-MM-DD
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns the list of available booking time slots for a given date by
 * checking Google Calendar's FreeBusy API.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Expected YYYY-MM-DD.' }, { status: 400 })
    }

    const calendar = google.calendar({ version: 'v3', auth: getGoogleAuth() })
    const timeMin = `${date}T00:00:00+01:00`
    const timeMax = `${date}T23:59:59+01:00`

    const freeBusy = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: TIMEZONE_IANA,
        items: [{ id: CALENDAR_ID }],
      },
    })

    const busySlots = freeBusy.data.calendars?.[CALENDAR_ID]?.busy || []

    // Filter TIME_START labels to those whose slot doesn't overlap any busy period
    const availableSlots = Object.keys(TIME_START).filter((label) => {
      const slotStart = new Date(`${date}T${TIME_START[label]}+01:00`).getTime()
      const slotEnd = new Date(`${date}T${TIME_END[label]}+01:00`).getTime()
      return !busySlots.some((busy) => {
        const busyStart = new Date(busy.start!).getTime()
        const busyEnd = new Date(busy.end!).getTime()
        return slotStart < busyEnd && slotEnd > busyStart
      })
    })

    return NextResponse.json({ availableSlots })
  } catch (err: any) {
    console.error('[booking/available/GET]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
