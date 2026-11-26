import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { put } from '@vercel/blob'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/ai/thumbnail
// Generates a DALL-E 3 thumbnail for a project and stores it in Vercel Blob.
// Body: { projectId: string }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('REPLACE_WITH_')) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in .env.local' },
      { status: 400 }
    )
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('REPLACE_WITH_')) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN is not configured in .env.local' },
      { status: 400 }
    )
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const { projectId } = await req.json()
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const techStack = JSON.parse(project.techStack) as string[]

  const prompt = `Create a modern, minimalist tech project thumbnail for a software portfolio.
Project: "${project.name}"
Tech: ${techStack.slice(0, 4).join(', ') || project.language}
Style: Dark background (#0a0a0a), neon accent color (${project.accentColor}), geometric code/UI elements, clean composition. No text. 16:9 aspect ratio. High quality digital art.`

  try {
    const image = await client.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'url',
    })

    const imageUrl = image.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('OpenAI did not return an image URL')
    }

    // Download the image and re-upload to Vercel Blob for permanence
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()

    const blob = await put(
      `thumbnails/${projectId}.png`,
      Buffer.from(imageBuffer),
      {
        access: 'public',
        contentType: 'image/png',
      }
    )

    await prisma.project.update({
      where: { id: projectId },
      data: {
        thumbnailUrl: blob.url,
        aiThumbnailAt: new Date(),
      },
    })

    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json({ ok: true, url: blob.url })
  } catch (err) {
    console.error('[ai/thumbnail]', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
