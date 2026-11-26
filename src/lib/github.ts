// ─────────────────────────────────────────────────────────────────────────────
// GitHub API helpers for the admin sync system
// ─────────────────────────────────────────────────────────────────────────────

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  homepage: string | null
  description: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  default_branch: string
  private: boolean
  updated_at: string
}

/**
 * Fetch all repos for the authenticated user (public + private).
 * Paginates automatically — returns up to 300 repos.
 */
export async function fetchAllGitHubRepos(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = []
  let page = 1

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&sort=updated&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
    }

    const repos: GitHubRepo[] = await res.json()
    allRepos.push(...repos)

    if (repos.length < 100) break
    page++
  }

  return allRepos
}

/**
 * Fetch the raw README content for a repository.
 * Returns empty string if not found.
 */
export async function fetchRepoReadme(fullName: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${fullName}/readme`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.raw+json',
        },
        cache: 'no-store',
      }
    )
    if (!res.ok) return ''
    return await res.text()
  } catch {
    return ''
  }
}

/**
 * Fetch package.json dependency keys for tech stack detection.
 */
export async function fetchRepoDependencies(fullName: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${fullName}/contents/package.json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.raw+json',
        },
        cache: 'no-store',
      }
    )
    if (!res.ok) return []
    const pkg = await res.json()
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ]
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tech stack detection from repo metadata + dependencies
// ─────────────────────────────────────────────────────────────────────────────

const TOPIC_MAP: Record<string, string> = {
  'nextjs': 'Next.js',
  'next-js': 'Next.js',
  'react': 'React',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'nodejs': 'Node.js',
  'node-js': 'Node.js',
  'prisma': 'Prisma',
  'tailwindcss': 'Tailwind CSS',
  'tailwind': 'Tailwind CSS',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'python': 'Python',
  'django': 'Django',
  'fastapi': 'FastAPI',
  'express': 'Express',
  'graphql': 'GraphQL',
  'docker': 'Docker',
  'stripe': 'Stripe',
  'supabase': 'Supabase',
  'firebase': 'Firebase',
  'vercel': 'Vercel',
}

const DEP_MAP: Record<string, string> = {
  'next': 'Next.js',
  'react': 'React',
  'typescript': 'TypeScript',
  '@prisma/client': 'Prisma',
  'tailwindcss': 'Tailwind CSS',
  'framer-motion': 'Framer Motion',
  'stripe': 'Stripe',
  'openai': 'OpenAI',
  'express': 'Express',
  'fastify': 'Fastify',
  'mongoose': 'MongoDB',
  'pg': 'PostgreSQL',
  'graphql': 'GraphQL',
  '@supabase/supabase-js': 'Supabase',
  'firebase': 'Firebase',
  'three': 'Three.js',
  '@react-three/fiber': 'React Three Fiber',
  'drizzle-orm': 'Drizzle',
  'resend': 'Resend',
  'zod': 'Zod',
}

export function detectTechStack(
  repo: GitHubRepo,
  deps: string[] = []
): string[] {
  const stack = new Set<string>()

  // Primary language
  if (repo.language && repo.language !== 'HTML' && repo.language !== 'CSS') {
    stack.add(repo.language)
  }

  // From GitHub topics
  for (const topic of repo.topics) {
    const mapped = TOPIC_MAP[topic.toLowerCase()]
    if (mapped) stack.add(mapped)
  }

  // From package.json dependencies
  for (const dep of deps) {
    const mapped = DEP_MAP[dep]
    if (mapped) stack.add(mapped)
  }

  return [...stack].slice(0, 8) // Cap at 8 tags
}

/**
 * Format a GitHub repo name into a display name.
 * "my-cool-project" → "My Cool Project"
 */
export function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
