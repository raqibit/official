'use client'

import { useState } from 'react'
import { type AdminProject, readApiError, safeParseArray } from './adminShared'

type Props = {
  project: AdminProject
  onEdit: () => void
  onTogglePublish: () => void
  onToggleFeatured: () => void
  onRequestDelete: () => void
  onRefresh: () => void
  showToast: (msg: string) => void
}

export default function ProjectCard({
  project: p,
  onEdit,
  onTogglePublish,
  onToggleFeatured,
  onRequestDelete,
  onRefresh,
  showToast,
}: Props) {
  const [aiLoading, setAiLoading] = useState(false)
  const [thumbLoading, setThumbLoading] = useState(false)
  const [ssLoading, setSsLoading] = useState(false)

  const techStack = safeParseArray(p.techStack)

  async function generateDescription() {
    setAiLoading(true)
    showToast('Generating AI description…')
    try {
      const res = await fetch('/api/admin/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: p.id }),
      })
      if (res.ok) {
        await res.text() // Wait for stream + onFinish DB persistence to complete
        showToast('✓ AI description generated')
        onRefresh()
      } else {
        showToast(`✗ ${await readApiError(res, 'Failed to generate description')}`)
      }
    } finally {
      setAiLoading(false)
    }
  }

  async function generateThumbnail() {
    setThumbLoading(true)
    showToast('Generating AI thumbnail (DALL-E 3)…')
    try {
      const res = await fetch('/api/admin/ai/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: p.id }),
      })
      if (res.ok) {
        showToast('✓ Thumbnail generated')
        onRefresh()
      } else {
        showToast(`✗ ${await readApiError(res, 'Failed to generate thumbnail')}`)
      }
    } finally {
      setThumbLoading(false)
    }
  }

  async function takeScreenshot() {
    setSsLoading(true)
    showToast('Taking screenshot…')
    try {
      const res = await fetch('/api/admin/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: p.id }),
      })
      if (res.ok) {
        showToast('✓ Screenshot captured')
        onRefresh()
      } else {
        showToast(`✗ ${await readApiError(res, 'Screenshot failed — check live URL')}`)
      }
    } finally {
      setSsLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group flex flex-col justify-between">
      <div>
        {/* Thumbnail */}
        <div className="relative h-36 bg-zinc-800 overflow-hidden">
          {p.thumbnailUrl || p.screenshotUrl ? (
            <img
              src={p.thumbnailUrl || p.screenshotUrl}
              alt={p.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${p.accentColor}15` }}
            >
              <span className="text-3xl font-black" style={{ color: p.accentColor }}>
                {p.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {p.published && (
              <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                LIVE
              </span>
            )}
            {p.featured && (
              <span className="bg-[#00e5ff] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                ★ FEATURED
              </span>
            )}
          </div>

          {/* Stars */}
          {p.stars > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full">
              <span>★</span>
              <span>{p.stars}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate text-white">{p.name}</h3>
              <p className="text-zinc-500 text-xs truncate mt-0.5">{p.githubRepo}</p>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="shrink-0 text-zinc-500 hover:text-white transition-colors p-1"
              title="Edit project"
              aria-label={`Edit ${p.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          {/* Description preview */}
          {p.about ? (
            <p className="mt-2 text-zinc-400 text-xs line-clamp-2 leading-relaxed">{p.about}</p>
          ) : (
            <p className="mt-2 text-zinc-600 text-xs italic">No description yet</p>
          )}

          {/* Tech stack tags */}
          {techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {techStack.slice(0, 4).map((t) => (
                <span key={t} className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-md">
                  {t}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="text-zinc-600 text-[10px] px-1">+{techStack.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        {/* AI Actions */}
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={generateDescription}
            disabled={aiLoading}
            title="Generate AI description"
            className="flex flex-col items-center gap-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2 px-1 transition-colors disabled:opacity-50 text-[10px] text-zinc-300"
          >
            <span>{aiLoading ? '…' : '✦'}</span>
            <span>Describe</span>
          </button>
          <button
            type="button"
            onClick={generateThumbnail}
            disabled={thumbLoading}
            title="Generate AI thumbnail"
            className="flex flex-col items-center gap-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2 px-1 transition-colors disabled:opacity-50 text-[10px] text-zinc-300"
          >
            <span>{thumbLoading ? '…' : '🎨'}</span>
            <span>Thumbnail</span>
          </button>
          <button
            type="button"
            onClick={takeScreenshot}
            disabled={ssLoading}
            title="Screenshot live URL"
            className="flex flex-col items-center gap-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2 px-1 transition-colors disabled:opacity-50 text-[10px] text-zinc-300"
          >
            <span>{ssLoading ? '…' : '📸'}</span>
            <span>Screenshot</span>
          </button>
        </div>

        {/* Publish / Feature / Delete */}
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onTogglePublish}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
              p.published
                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {p.published ? 'Unpublish' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={onToggleFeatured}
            title={p.featured ? 'Remove from featured' : 'Feature on home page'}
            aria-label={p.featured ? 'Unfeature project' : 'Feature project'}
            className={`text-xs py-1.5 px-3 rounded-lg font-medium transition-colors ${
              p.featured
                ? 'bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff]/20'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            ★
          </button>
          <button
            type="button"
            onClick={onRequestDelete}
            title="Delete project"
            aria-label={`Delete ${p.name}`}
            className="text-xs py-1.5 px-3 rounded-lg bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
