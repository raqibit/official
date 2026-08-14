import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProjectDetailClient } from './ProjectDetailClient'

// This is a server component that fetches the data initially
export default async function ProjectPage({ params }: { params: { id: string } }) {
  // We fetch locally since it's the same app
  const res = await fetch(`http://localhost:3000/api/projects/${params.id}`, { cache: 'no-store' })
  
  if (!res.ok) {
    notFound()
  }

  const project = await res.json()

  return <ProjectDetailClient project={project} />
}
