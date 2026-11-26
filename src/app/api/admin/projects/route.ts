import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/projects          → list all projects
// POST /api/admin/projects          → create a manual project
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { updatedAt: 'desc' }],
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const name = typeof body.name === 'string' ? body.name.trim() : ''

  if (!name) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
  }

  const uniqueSlug = crypto.randomUUID().slice(0, 8)

  const project = await prisma.project.create({
    data: {
      githubId: body.githubId ?? -Math.floor(Date.now() % 1e9) - Math.floor(Math.random() * 1000),
      githubRepo: body.githubRepo?.trim() || `manual/${uniqueSlug}`,
      githubUrl: body.githubUrl ?? '',
      name,
      tagline: body.tagline ?? '',
      about: body.about ?? '',
      liveUrl: body.liveUrl ?? '',
      thumbnailUrl: body.thumbnailUrl ?? '',
      screenshotUrl: body.screenshotUrl ?? '',
      videoUrl: body.videoUrl ?? '',
      deliverableUrl: body.deliverableUrl ?? '',
      review: body.review ?? '',
      techStack: JSON.stringify(Array.isArray(body.techStack) ? body.techStack : []),
      topics: JSON.stringify(Array.isArray(body.topics) ? body.topics : []),
      accentColor: body.accentColor ?? '#00e5ff',
      price: Number(body.price ?? 0),
      order: Number(body.order ?? 99),
      wide: Boolean(body.wide ?? false),
      featured: Boolean(body.featured ?? false),
      published: Boolean(body.published ?? false),
    },
  })

  revalidatePath('/')
  revalidatePath('/projects')

  return NextResponse.json(project, { status: 201 })
}
