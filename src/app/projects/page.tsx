import { Metadata } from 'next'
import { getProjects } from '@/lib/mdx'
import { ProjectsClient } from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects | Raqīb Ismāʿīl',
  description: 'A collection of projects spanning frontend UI engineering to full-stack applications.',
}

export default async function ProjectsPage() {
  const projects = getProjects()
  return <ProjectsClient projects={projects} />
}
