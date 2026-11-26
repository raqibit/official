import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/projects
// Public endpoint — returns only published projects for the portfolio frontend.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { stars: 'desc' },
    ],
    select: {
      id: true,
      name: true,
      tagline: true,
      about: true,
      techStack: true,
      thumbnailUrl: true,
      screenshotUrl: true,
      liveUrl: true,
      githubUrl: true,
      stars: true,
      featured: true,
      accentColor: true,
      price: true,
      wide: true,
      language: true,
    },
  })

  // Parse JSON fields before sending
  const parsed = projects.map((p) => ({
    ...p,
    techStack: JSON.parse(p.techStack),
  }))

  return NextResponse.json(parsed, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
