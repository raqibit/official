'use client'

import { useEffect, useState } from 'react'
import {
  type AdminProject,
  Field,
  Toggle,
  inputCls,
  readApiError,
  safeParseArray,
} from './adminShared'

type Props = {
  project: AdminProject
  onClose: () => void
  onSaved: () => void
  showToast: (msg: string) => void
}

export default function ProjectEditModal({ project, onClose, onSaved, showToast }: Props) {
  const [form, setForm] = useState({
    name: project.name,
    tagline: project.tagline,
    about: project.about,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    thumbnailUrl: project.thumbnailUrl,
    screenshotUrl: project.screenshotUrl,
    videoUrl: project.videoUrl,
    deliverableUrl: project.deliverableUrl,
    review: project.review,
    accentColor: project.accentColor || '#00e5ff',
    price: project.price,
    order: project.order,
    wide: project.wide ?? false,
    techStack: safeParseArray(project.techStack).join(', '),
    featured: project.featured,
    published: project.published,
  })

  const [saving, setSaving] = useState(false)
  const [aiStreaming, setAiStreaming] = useState(false)
  const [thumbLoading, setThumbLoading] = useState(false)
  const [ssLoading, setSsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isBusy = saving || aiStreaming || thumbLoading || ssLoading

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isBusy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, isBusy])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function streamAIDescription() {
    setAiStreaming(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/admin/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      })

      if (!res.ok) {
        const err = await readApiError(res, 'Failed to generate AI description')
        setErrorMsg(err)
        showToast(`✗ ${err}`)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        const text = await res.text()
        update('about', text)
        showToast('✓ AI description generated')
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''
      update('about', '')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        update('about', accumulated)
      }

      showToast('✓ AI description generated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Streaming failed'
      setErrorMsg(msg)
      showToast(`✗ ${msg}`)
    } finally {
      setAiStreaming(false)
    }
  }

  async function generateThumbnail() {
    setThumbLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/admin/ai/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      })

      if (!res.ok) {
        const err = await readApiError(res, 'Failed to generate thumbnail')
        setErrorMsg(err)
        showToast(`✗ ${err}`)
        return
      }

      const data = await res.json()
      if (data.url) {
        update('thumbnailUrl', data.url)
        showToast('✓ Thumbnail generated')
      }
    } finally {
      setThumbLoading(false)
    }
  }

  async function takeScreenshot() {
    setSsLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/admin/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      })

      if (!res.ok) {
        const err = await readApiError(res, 'Screenshot failed — check live URL')
        setErrorMsg(err)
        showToast(`✗ ${err}`)
        return
      }

      const data = await res.json()
      if (data.url) {
        update('screenshotUrl', data.url)
        showToast('✓ Screenshot captured')
      }
    } finally {
      setSsLoading(false)
    }
  }

  async function save() {
    if (!form.name.trim()) {
      setErrorMsg('Display name is required.')
      return
    }

    setSaving(true)
    setErrorMsg('')

    const techArray = form.techStack
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)

    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        name: form.name.trim(),
        techStack: techArray,
        price: Number(form.price),
        order: Number(form.order),
      }),
    })

    setSaving(false)
    if (res.ok) {
      showToast('✓ Saved')
      onSaved()
    } else {
      const err = await readApiError(res, 'Failed to save changes')
      setErrorMsg(err)
      showToast(`✗ ${err}`)
    }
  }

  const previewUrl = form.thumbnailUrl || form.screenshotUrl

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => !isBusy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${project.name}`}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur-sm z-10">
          <div className="min-w-0 pr-4">
            <h2 className="font-semibold text-sm text-white truncate">{form.name || project.name}</h2>
            <p className="text-zinc-500 text-xs mt-0.5 truncate">{project.githubRepo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close"
            className="text-zinc-500 hover:text-white transition-colors disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Visual preview + quick AI media actions */}
        <div className="px-6 pt-5">
          <div className="relative h-40 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={form.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `${form.accentColor}15` }}
              >
                <span className="text-4xl font-black" style={{ color: form.accentColor }}>
                  {(form.name || project.name).charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generateThumbnail}
                disabled={isBusy}
                className="bg-black/75 hover:bg-black border border-white/10 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50"
              >
                {thumbLoading ? 'Generating…' : '🎨 AI Thumbnail'}
              </button>
              <button
                type="button"
                onClick={takeScreenshot}
                disabled={isBusy}
                className="bg-black/75 hover:bg-black border border-white/10 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors disabled:opacity-50"
              >
                {ssLoading ? 'Capturing…' : '📸 Screenshot'}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Display Name">
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </Field>

            <Field label="Tagline">
              <input
                className={inputCls}
                value={form.tagline}
                onChange={(e) => update('tagline', e.target.value)}
                placeholder="One-line description"
              />
            </Field>
          </div>

          <Field
            label="About (AI or manual)"
            action={
              <button
                type="button"
                onClick={streamAIDescription}
                disabled={isBusy}
                className="text-[11px] font-medium text-[#00e5ff] hover:text-[#6ef2ff] transition-colors disabled:opacity-50"
              >
                {aiStreaming ? '✦ Streaming…' : '✦ Stream AI Description'}
              </button>
            }
          >
            <textarea
              className={`${inputCls} resize-y`}
              rows={4}
              value={form.about}
              onChange={(e) => update('about', e.target.value)}
              placeholder="Project description…"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Live URL">
              <input
                className={inputCls}
                value={form.liveUrl}
                onChange={(e) => update('liveUrl', e.target.value)}
                placeholder="https://…"
              />
            </Field>

            <Field label="GitHub URL">
              <input
                className={inputCls}
                value={form.githubUrl}
                onChange={(e) => update('githubUrl', e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
          </div>

          <Field label="Tech Stack (comma separated)">
            <input
              className={inputCls}
              value={form.techStack}
              onChange={(e) => update('techStack', e.target.value)}
              placeholder="Next.js, Tailwind CSS, Prisma"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Thumbnail URL">
              <input
                className={inputCls}
                value={form.thumbnailUrl}
                onChange={(e) => update('thumbnailUrl', e.target.value)}
                placeholder="https://… or /images/…"
              />
            </Field>

            <Field label="Screenshot URL">
              <input
                className={inputCls}
                value={form.screenshotUrl}
                onChange={(e) => update('screenshotUrl', e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Video Demo URL">
              <input
                className={inputCls}
                value={form.videoUrl}
                onChange={(e) => update('videoUrl', e.target.value)}
                placeholder="https://… or /videos/…"
              />
            </Field>

            <Field label="Deliverable URL (if sold)">
              <input
                className={inputCls}
                value={form.deliverableUrl}
                onChange={(e) => update('deliverableUrl', e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </div>

          <Field label="Client Review / Quote (optional)">
            <input
              className={inputCls}
              value={form.review}
              onChange={(e) => update('review', e.target.value)}
              placeholder="Short testimonial quote"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Accent Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) => update('accentColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer shrink-0"
                />
                <input
                  className={`${inputCls} flex-1 min-w-0`}
                  value={form.accentColor}
                  onChange={(e) => update('accentColor', e.target.value)}
                />
              </div>
            </Field>

            <Field label="Price ($)">
              <input
                type="number"
                className={inputCls}
                value={form.price}
                onChange={(e) => update('price', Number(e.target.value))}
                min={0}
              />
            </Field>

            <Field label="Order (lower = first)">
              <input
                type="number"
                className={inputCls}
                value={form.order}
                onChange={(e) => update('order', Number(e.target.value))}
              />
            </Field>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-5 pt-2">
            <Toggle
              label="Published"
              value={form.published}
              onChange={(v) => update('published', v)}
            />
            <Toggle
              label="Featured"
              value={form.featured}
              onChange={(v) => update('featured', v)}
            />
            <Toggle
              label="Wide card"
              value={form.wide}
              onChange={(v) => update('wide', v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex gap-3 sticky bottom-0 bg-zinc-900/95 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isBusy}
            className="flex-1 py-2.5 rounded-lg bg-[#00e5ff] text-black font-semibold text-sm hover:bg-[#00c8e0] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
