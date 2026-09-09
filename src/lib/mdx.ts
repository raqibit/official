import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

export function getProjects(): Project[] {
  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(projectsDirectory)
  
  const projects = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".mdx" from file name to get id
      const id = fileName.replace(/\.mdx$/, '')

      // Read markdown file as string
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the project metadata section
      const matterResult = matter(fileContents)

      return {
        id,
        name: matterResult.data.name || '',
        tagline: matterResult.data.tagline || '',
        about: matterResult.content || '',
        videoUrl: matterResult.data.videoUrl || '',
        images: matterResult.data.images || [],
        liveUrl: matterResult.data.liveUrl || '',
        githubUrl: matterResult.data.githubUrl || '',
        techStack: matterResult.data.techStack || [],
        review: matterResult.data.review || '',
        price: matterResult.data.price || 0,
        accentColor: matterResult.data.accentColor || '#ffffff',
        wide: matterResult.data.wide || false,
      } as Project
    })

  // We sort by price descending or another logic? The original array was hardcoded in specific order.
  // We can add an 'order' field to frontmatter, or just return them as is and let the client handle it.
  // Let's add an 'order' field to enforce the same display order:
  // 1. raqi-build, 2. nexter, 3. natours, 4. microsoldering-lab
  
  // Sort projects by order frontmatter if available
  return projects.sort((a: any, b: any) => {
    const orderA = a.order ?? 99
    const orderB = b.order ?? 99
    return orderA - orderB
  })
}
