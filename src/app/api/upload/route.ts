import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Verify Authentication
  const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1]
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
  }

  try {
    // 2. Upload file to Vercel Blob
    const blob = await put(filename, request.body!, {
      access: 'public',
    })

    return NextResponse.json(blob)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload to Vercel Blob. Ensure BLOB_READ_WRITE_TOKEN is set.' },
      { status: 500 }
    )
  }
}
