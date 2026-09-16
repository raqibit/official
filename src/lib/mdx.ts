import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Project type & data loader
// ─────────────────────────────────────────────────────────────────────────────

/** Shape of a project parsed from MDX frontmatter + body content. */
export type Project = {
  /** Slug derived from the MDX filename (e.g. "natours") */
  id: string
  name: string
  tagline: string
  /** Full body text from the MDX content (below the frontmatter) */
  about: string
  videoUrl: string
  images: string[]
  liveUrl: string
  githubUrl: string
  techStack: string[]
  review: string
  /** Price in USD. 0 means "not for sale". */
  price: number
  accentColor: string
  /** If true, the card spans 2 columns in the projects grid. */
  wide: boolean
  /** Sort order for display (lower = first). Defaults to 99 if unset. */
  order: number
}

const projectsDirectory = path.join(process.cwd(), 'src/content/projects')

/**
 * Reads and parses all MDX files from `src/content/projects/`.
 *
 * Wrapped in React's `cache()` so multiple server components calling this
 * in the same render cycle share the same result — zero duplicate I/O.
 *
 * @returns Sorted array of `Project` objects (ascending by `order` field).
 */
export const getProjects = cache((): Project[] => {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(projectsDirectory)

  const projects = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName): Project => {
      const id = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        id,
        name: data.name ?? '',
        tagline: data.tagline ?? '',
        about: content,
        videoUrl: data.videoUrl ?? '',
        images: data.images ?? [],
        liveUrl: data.liveUrl ?? '',
        githubUrl: data.githubUrl ?? '',
        techStack: data.techStack ?? [],
        review: data.review ?? '',
        price: data.price ?? 0,
        accentColor: data.accentColor ?? '#ffffff',
        wide: data.wide ?? false,
        order: data.order ?? 99,
      }
    })

  // Sort by the `order` frontmatter field (ascending)
  return projects.sort((a, b) => a.order - b.order)
})
