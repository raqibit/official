import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id, deletedAt: null }
    })
    
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    
    return NextResponse.json({
      ...project,
      images: JSON.parse(project.images),
      techStack: JSON.parse(project.techStack)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updatedData = await request.json()
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: updatedData.name,
        tagline: updatedData.tagline,
        about: updatedData.about,
        videoUrl: updatedData.videoUrl || '',
        liveUrl: updatedData.liveUrl || '',
        githubUrl: updatedData.githubUrl || '',
        review: updatedData.review || '',
        price: parseFloat(updatedData.price) || 0,
        accentColor: updatedData.accentColor,
        images: JSON.stringify(updatedData.images || []),
        techStack: JSON.stringify(updatedData.techStack || [])
      }
    })
    
    return NextResponse.json({
      ...project,
      images: JSON.parse(project.images),
      techStack: JSON.parse(project.techStack)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
