import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { getProjects, type Project } from '@/lib/mdx'

export type PortfolioProject = Project & {
  featured?: boolean
  source?: 'db' | 'mdx'
}

function safeParseStringArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : []
  } catch {
    return []
  }
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\/+$/, '')
}

/**
 * Fetches published projects from Prisma SQLite and merges them with the
 * curated MDX projects in `src/content/projects/`.
 *
 * - Published DB projects take precedence over MDX entries matching the same
 *   id, GitHub URL, or name.
 * - Falls back cleanly to MDX if the database is unreachable or has no rows.
 */
export const getPortfolioProjects = cache(async (): Promise<PortfolioProject[]> => {
  const mdxProjects: PortfolioProject[] = getProjects().map((p) => ({
    ...p,
    featured: false,
    source: 'mdx',
  }))

  try {
    const dbRows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { stars: 'desc' }],
    })

    if (dbRows.length === 0) {
      return mdxProjects
    }

    const dbProjects: PortfolioProject[] = dbRows.map((row) => {
      const extraImages = safeParseStringArray(row.images)
      const images = Array.from(
        new Set([row.thumbnailUrl, row.screenshotUrl, ...extraImages].filter((s) => Boolean(s && s.trim())))
      )

      return {
        id: row.id,
        name: row.name,
        tagline: row.tagline,
        about: row.about || row.tagline || '',
        videoUrl: row.videoUrl,
        images,
        liveUrl: row.liveUrl,
        githubUrl: row.githubUrl,
        techStack: safeParseStringArray(row.techStack),
        review: row.review,
        price: row.price,
        deliverableUrl: row.deliverableUrl,
        accentColor: row.accentColor || '#00e5ff',
        wide: row.wide,
        order: row.order,
        featured: row.featured,
        source: 'db',
      }
    })

    // Deduplicate: if a DB project matches an MDX project by githubUrl or name, prefer the DB version
    const dbKeys = new Set<string>()
    for (const p of dbProjects) {
      if (p.githubUrl) dbKeys.add(normalizeKey(p.githubUrl))
      if (p.name) dbKeys.add(normalizeKey(p.name))
      dbKeys.add(normalizeKey(p.id))
    }

    const remainingMdx = mdxProjects.filter((p) => {
      if (p.githubUrl && dbKeys.has(normalizeKey(p.githubUrl))) return false
      if (p.name && dbKeys.has(normalizeKey(p.name))) return false
      if (dbKeys.has(normalizeKey(p.id))) return false
      return true
    })

    return [...dbProjects, ...remainingMdx].sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
      return a.order - b.order
    })
  } catch (err) {
    console.error('[getPortfolioProjects] Falling back to MDX:', err)
    return mdxProjects
  }
})

/**
 * Returns up to `limit` featured projects for the home page bento grid.
 * Prioritizes projects explicitly marked `featured` in the admin panel,
 * then fills remaining slots by `order`.
 */
export const getFeaturedPortfolioProjects = cache(async (limit = 3): Promise<PortfolioProject[]> => {
  const all = await getPortfolioProjects()
  return all.slice(0, limit)
})
