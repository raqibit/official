import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getGoogleAuth, CALENDAR_ID, TIME_START, TIME_END } from '@/lib/googleCalendar'
import { TIMEZONE_IANA } from '@/data/site'

/** All available slot labels — used as fallback when calendar is unreachable */
const ALL_SLOTS = Object.keys(TIME_START)

/**
 * GET /api/booking/available?date=YYYY-MM-DD
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns the list of available booking time slots for a given date by
 * checking Google Calendar's FreeBusy API.
 *
 * If the calendar is unreachable or returns permission errors, ALL slots
 * are returned as available so clients can still book. The calendar event
 * insertion in the POST route acts as the final guard against double-booking.
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

    // ── Query Google Calendar FreeBusy ──────────────────────
    let busySlots: { start?: string | null; end?: string | null }[] = []

    try {
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

      const calendarData = freeBusy.data.calendars?.[CALENDAR_ID]

      // Check for API-level errors (e.g. "notFound" when the service account
      // doesn't have permission to read the calendar)
      if (calendarData?.errors && calendarData.errors.length > 0) {
        console.warn(
          '[booking/available] Calendar API returned errors:',
          JSON.stringify(calendarData.errors),
          '— returning all slots as available.',
        )
        return NextResponse.json({ availableSlots: ALL_SLOTS })
      }

      busySlots = calendarData?.busy || []
    } catch (calendarError: unknown) {
      // Calendar unreachable — log and fall back to all-available
      const message = calendarError instanceof Error ? calendarError.message : String(calendarError)
      console.warn('[booking/available] Calendar query failed:', message, '— returning all slots as available.')
      return NextResponse.json({ availableSlots: ALL_SLOTS })
    }

    // ── Filter slots that overlap any busy period ───────────
    const availableSlots = ALL_SLOTS.filter((label) => {
      const slotStart = new Date(`${date}T${TIME_START[label]}+01:00`).getTime()
      const slotEnd = new Date(`${date}T${TIME_END[label]}+01:00`).getTime()
      return !busySlots.some((busy) => {
        const busyStart = new Date(busy.start!).getTime()
        const busyEnd = new Date(busy.end!).getTime()
        return slotStart < busyEnd && slotEnd > busyStart
      })
    })

    return NextResponse.json({ availableSlots })
  } catch (err: unknown) {
    // Outer catch — unexpected errors (e.g. malformed URL)
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[booking/available/GET]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
