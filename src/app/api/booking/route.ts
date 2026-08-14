import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, projectType, message, date, timeSlot } = body

    if (!name || !email || !projectType || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        projectType,
        message: message || null,
        date,
        timeSlot,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, id: booking.id }, { status: 201 })
  } catch (err) {
    console.error('[booking/POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Used by admin dashboard (future)
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bookings)
}
