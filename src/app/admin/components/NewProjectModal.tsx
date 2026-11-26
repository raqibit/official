'use client'

import { useEffect, useState } from 'react'
import { Field, Toggle, inputCls, readApiError } from './adminShared'

type Props = {
  onClose: () => void
  onCreated: () => void
  showToast: (msg: string) => void
}

export default function NewProjectModal({ onClose, onCreated, showToast }: Props) {
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [techStack, setTechStack] = useState('')
  const [accentColor, setAccentColor] = useState('#00e5ff')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, saving])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Project name is required.')
      return
    }

    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        tagline: tagline.trim(),
        liveUrl: liveUrl.trim(),
        githubUrl: githubUrl.trim(),
        techStack: techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        accentColor,
        published,
      }),
    })

    setSaving(false)
    if (res.ok) {
      showToast('✓ Project created')
      onCreated()
    } else {
      setError(await readApiError(res, 'Failed to create project'))
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create new project"
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="font-semibold text-sm text-white">New Project</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Add a custom software or hardware project</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          <Field label="Project Name *">
            <input
              required
              autoFocus
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BoardView Diagnostics"
            />
          </Field>

          <Field label="Tagline">
            <input
              className={inputCls}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One-line summary"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Live URL">
              <input
                className={inputCls}
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field label="GitHub URL">
              <input
                className={inputCls}
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
          </div>

          <Field label="Tech Stack (comma separated)">
            <input
              className={inputCls}
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Next.js, TypeScript, Prisma"
            />
          </Field>

          <Field label="Accent Color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <input
                className={`${inputCls} flex-1`}
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
              />
            </div>
          </Field>

          <div className="pt-1">
            <Toggle label="Publish immediately" value={published} onChange={setPublished} />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-[#00e5ff] text-black font-semibold text-sm hover:bg-[#00c8e0] transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
