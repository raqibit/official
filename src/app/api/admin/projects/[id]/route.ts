import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  // Serialise array fields before writing
  const data = { ...body }
  if (Array.isArray(data.techStack)) data.techStack = JSON.stringify(data.techStack)
  if (Array.isArray(data.topics)) data.topics = JSON.stringify(data.topics)
  if (Array.isArray(data.images)) data.images = JSON.stringify(data.images)

  const project = await prisma.project.update({
    where: { id },
    data,
  })

  revalidatePath('/')
  revalidatePath('/projects')

  return NextResponse.json(project)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/projects')
  return NextResponse.json({ ok: true })
}
