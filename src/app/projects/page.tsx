import { Metadata } from 'next'
import { getPortfolioProjects } from '@/lib/projects'
import { ProjectsClient } from './ProjectsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A curated collection of software projects — from full-stack web applications and AI pipelines to premium UI/UX systems and hardware diagnostics tools.',
  openGraph: {
    title: 'Projects — Raqīb Ismāʿīl',
    description:
      'Full-stack apps, AI pipelines, premium UI systems, and hardware tools built by Raqīb Ismāʿīl.',
  },
  twitter: {
    title: 'Projects — Raqīb Ismāʿīl',
    description:
      'Full-stack apps, AI pipelines, premium UI systems, and hardware tools.',
  },
}

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects()
  return <ProjectsClient projects={projects} />
}
