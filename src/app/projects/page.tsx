import { Metadata } from 'next'
import { PROJECTS } from '@/data/projects'
import { ProjectsClient } from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects | Roqeeb Ismail',
  description: 'A collection of projects spanning frontend UI engineering to full-stack applications.',
}

export default function ProjectsPage() {
  return <ProjectsClient projects={PROJECTS} />
}
