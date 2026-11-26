import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/screenshot
// Takes a headless screenshot of the project's live URL and stores it.
// Uses the built-in fetch + html2canvas fallback strategy in production,
// and @sparticuz/chromium in a standalone serverless context if available.
// Body: { projectId: string }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('REPLACE_WITH_')) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN is not configured in .env.local' },
      { status: 400 }
    )
  }

  const { projectId } = await req.json()
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const targetUrl = project.liveUrl || project.githubUrl
  if (!targetUrl) {
    return NextResponse.json({ error: 'No URL to screenshot' }, { status: 400 })
  }

  try {
    // Dynamic import — only works in Node.js runtime (not edge)
    const chromium = require('@sparticuz/chromium-min')
    const puppeteer = require('puppeteer-core')

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1440, height: 900 },
      executablePath: await chromium.executablePath(),
      headless: 'new',
    })

    const page = await browser.newPage()
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 20000 })

    // Scroll to trigger lazy-loaded content
    await page.evaluate(() => window.scrollTo(0, 300))
    await new Promise((r) => setTimeout(r, 800))

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    })
    await browser.close()

    const blob = await put(
      `screenshots/${projectId}.png`,
      screenshotBuffer,
      { access: 'public', contentType: 'image/png' }
    )

    await prisma.project.update({
      where: { id: projectId },
      data: {
        screenshotUrl: blob.url,
        screenshotAt: new Date(),
      },
    })

    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json({ ok: true, url: blob.url })
  } catch (err) {
    console.error('[screenshot]', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}

// Must use Node.js runtime for Puppeteer — not edge
export const runtime = 'nodejs'
export const maxDuration = 60
