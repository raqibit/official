import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

async function test() {
  try {
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: '2026-09-17T00:00:00+01:00',
        timeMax: '2026-09-17T23:59:59+01:00',
        timeZone: 'Africa/Lagos',
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
      },
    });
    console.log('Success:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
