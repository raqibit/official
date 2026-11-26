import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/ai/describe
// Generates an AI project description and streams it back.
// Body: { projectId: string }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('REPLACE_WITH_')) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in .env.local' },
      { status: 400 }
    )
  }

  const { projectId } = await req.json()
  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const techStack = JSON.parse(project.techStack) as string[]
  const topics = JSON.parse(project.topics) as string[]

  const prompt = `You are writing the project description for a software portfolio.

Project details:
- Name: ${project.name}
- GitHub repo: ${project.githubRepo}
- Language: ${project.language}
- Tech stack: ${techStack.join(', ') || 'unknown'}
- GitHub topics: ${topics.join(', ') || 'none'}
- Tagline: ${project.tagline || 'none'}
- Stars: ${project.stars}

Write a compelling, concise portfolio description (2–3 sentences max). 
Focus on what the project DOES and WHO it helps. 
Use plain, confident language — no buzzwords, no fluff. 
Do not mention GitHub stars. Do not start with "I built" or "This is".`

  const result = streamText({
    model: openai('gpt-4o-mini'),
    prompt,
    maxOutputTokens: 200,
    temperature: 0.7,
    onFinish: async ({ text }) => {
      // Persist the generated description
      await prisma.project.update({
        where: { id: projectId },
        data: {
          about: text,
          aiDescriptionAt: new Date(),
        },
      })
      revalidatePath('/')
      revalidatePath('/projects')
    },
  })

  return result.toTextStreamResponse()
}
