import { google } from 'googleapis'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
]

/** Shared Google Calendar JWT auth client */
export function getGoogleAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  })
}

/** Calendar ID from env or fallback */
export const CALENDAR_ID =
  process.env.GOOGLE_CALENDAR_ID || 'rq.ismaeel@gmail.com'

/** Maps friendly time labels → ISO time components */
export const TIME_START: Record<string, string> = {
  '9:00 AM': '09:00:00',
  '1:00 PM': '13:00:00',
  '5:00 PM': '17:00:00',
}

export const TIME_END: Record<string, string> = {
  '9:00 AM': '10:00:00',
  '1:00 PM': '14:00:00',
  '5:00 PM': '18:00:00',
}
