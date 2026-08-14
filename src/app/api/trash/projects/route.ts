import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' }
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
