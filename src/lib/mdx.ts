import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'

export type Project = {
  id: string
  name: string
  tagline: string
  about: string
  videoUrl: string
  images: string[]
  liveUrl: string
  githubUrl: string
  techStack: string[]
  review: string
  price: number
  accentColor: string
  wide?: boolean
}

const projectsDirectory = path.join(process.cwd(), 'src/content/projects')

/**
 * Reads and parses all MDX files from src/content/projects/.
 * Wrapped in React's `cache()` so multiple server components calling this
 * in the same render cycle share the same result — zero duplicate I/O.
 */
export const getProjects = cache((): Project[] => {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(projectsDirectory)

  const projects = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
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
      } satisfies Project
    })

  // Sort by `order` frontmatter field ascending
  return projects.sort((a, b) => {
    const orderA = (a as any).order ?? 99
    const orderB = (b as any).order ?? 99
    return orderA - orderB
  })
})
