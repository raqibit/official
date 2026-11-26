import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  fetchAllGitHubRepos,
  fetchRepoDependencies,
  detectTechStack,
  formatRepoName,
} from '@/lib/github'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/github/sync
// Fetches all GitHub repos and upserts them into the database.
// Does NOT overwrite user-customised fields (name, about, thumbnailUrl, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export async function POST() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN.startsWith('REPLACE_WITH_')) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN is not configured in .env.local' },
      { status: 400 }
    )
  }

  try {
    const repos = await fetchAllGitHubRepos()
    let created = 0
    let updated = 0

    for (const repo of repos) {
      const deps = await fetchRepoDependencies(repo.full_name)
      const techStack = detectTechStack(repo, deps)

      const existing = await prisma.project.findUnique({
        where: { githubId: repo.id },
      })

      if (existing) {
        // Only refresh GitHub metadata — never overwrite user edits
        await prisma.project.update({
          where: { githubId: repo.id },
          data: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            defaultBranch: repo.default_branch,
            language: repo.language ?? '',
            topics: JSON.stringify(repo.topics),
            githubUrl: repo.html_url,
            liveUrl: existing.liveUrl || repo.homepage || '',
            syncedAt: new Date(),
            // Only set techStack if user hasn't customised it yet
            ...(existing.techStack === '[]' && {
              techStack: JSON.stringify(techStack),
            }),
          },
        })
        updated++
      } else {
        await prisma.project.create({
          data: {
            githubId: repo.id,
            githubRepo: repo.full_name,
            githubUrl: repo.html_url,
            defaultBranch: repo.default_branch,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language ?? '',
            topics: JSON.stringify(repo.topics),
            name: formatRepoName(repo.name),
            tagline: repo.description ?? '',
            techStack: JSON.stringify(techStack),
            liveUrl: repo.homepage ?? '',
            published: false,
          },
        })
        created++
      }
    }

    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json({
      ok: true,
      total: repos.length,
      created,
      updated,
    })
  } catch (err) {
    console.error('[github/sync]', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
