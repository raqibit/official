import { MetadataRoute } from 'next'
import { getProjects } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://prime3it.vercel.app'
  const projects = getProjects()

  const staticRoutes = [
    '',
    '/about',
    '/uses',
    '/projects',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects#${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
