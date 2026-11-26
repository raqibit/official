import type { ReactNode } from 'react'

export type AdminProject = {
  id: string
  githubId: number
  githubRepo: string
  githubUrl: string
  name: string
  tagline: string
  about: string
  language: string
  techStack: string
  topics: string
  thumbnailUrl: string
  screenshotUrl: string
  videoUrl: string
  images: string
  liveUrl: string
  deliverableUrl: string
  review: string
  stars: number
  forks: number
  featured: boolean
  published: boolean
  wide: boolean
  order: number
  accentColor: string
  price: number
  aiDescriptionAt: string | null
  aiThumbnailAt: string | null
  screenshotAt: string | null
  syncedAt: string
  updatedAt: string
}

export function safeParseArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      : []
  } catch {
    return []
  }
}

export async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    if (data && typeof data.error === 'string' && data.error.trim()) {
      return data.error
    }
  } catch {
    // Non-JSON response body
  }
  return fallback
}

export const inputCls =
  'w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e5ff] transition-colors'

export function Field({
  label,
  action,
  children,
}: {
  label: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-zinc-400">{label}</label>
        {action}
      </div>
      {children}
    </div>
  )
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex items-center gap-2 cursor-pointer select-none group"
    >
      <span
        className={`relative w-9 h-5 rounded-full transition-colors ${
          value ? 'bg-[#00e5ff]' : 'bg-zinc-700 group-hover:bg-zinc-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-4' : ''
          }`}
        />
      </span>
      <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
        {label}
      </span>
    </button>
  )
}
