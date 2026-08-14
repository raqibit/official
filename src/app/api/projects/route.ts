import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' }
    })
    
    // Parse JSON strings back to arrays
    const formattedProjects = projects.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      techStack: JSON.parse(p.techStack)
    }))
    
    return NextResponse.json(formattedProjects)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json()
    const id = newProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

    const project = await prisma.project.create({
      data: {
        id,
        name: newProject.name,
        tagline: newProject.tagline,
        about: newProject.about,
        videoUrl: newProject.videoUrl || '',
        liveUrl: newProject.liveUrl || '',
        githubUrl: newProject.githubUrl || '',
        review: newProject.review || '',
        price: parseFloat(newProject.price) || 0,
        accentColor: newProject.accentColor,
        images: JSON.stringify(newProject.images || []),
        techStack: JSON.stringify(newProject.techStack || [])
      }
    })
    
    return NextResponse.json({
      ...project,
      images: JSON.parse(project.images),
      techStack: JSON.parse(project.techStack)
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
