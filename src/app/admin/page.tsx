'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import type { AdminProject } from './components/adminShared'
import ProjectCard from './components/ProjectCard'
import ProjectEditModal from './components/ProjectEditModal'
import NewProjectModal from './components/NewProjectModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import StatsBar from './components/StatsBar'

export type Project = AdminProject

export default function AdminDashboard() {
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [selected, setSelected] = useState<AdminProject | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<AdminProject | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(''), 3500)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    fetch('/api/admin/projects')
      .then((res) => res.json())
      .then((data) => {
        if (active) setProjects(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  async function syncGitHub() {
    setSyncing(true)
    showToast('Syncing GitHub repos…')
    const res = await fetch('/api/admin/github/sync', { method: 'POST' })
    const data = await res.json()
    setSyncing(false)
    if (res.ok && data.ok) {
      showToast(`✓ Synced — ${data.created} new, ${data.updated} updated`)
      load()
    } else {
      showToast(`✗ ${data.error || 'GitHub sync failed'}`)
    }
  }

  async function togglePublish(p: AdminProject) {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published }),
    })
    if (res.ok) {
      showToast(p.published ? 'Moved to drafts' : '✓ Published to portfolio')
      load()
    } else {
      showToast('✗ Failed to update status')
    }
  }

  async function toggleFeatured(p: AdminProject) {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !p.featured }),
    })
    if (res.ok) {
      showToast(p.featured ? 'Removed from featured' : '★ Featured on home page')
      load()
    } else {
      showToast('✗ Failed to update featured flag')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const res = await fetch(`/api/admin/projects/${pendingDelete.id}`, {
      method: 'DELETE',
    })
    setDeleting(false)
    if (res.ok) {
      setPendingDelete(null)
      load()
      showToast('Project deleted')
    } else {
      showToast('✗ Failed to delete project')
    }
  }

  const filtered = projects
    .filter((p) => {
      if (filter === 'published') return p.published
      if (filter === 'draft') return !p.published
      if (filter === 'featured') return p.featured
      return true
    })
    .filter((p) =>
      search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.githubRepo.toLowerCase().includes(search.toLowerCase())
        : true
    )

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.published).length,
    featured: projects.filter((p) => p.featured).length,
    withAI: projects.filter((p) => p.aiDescriptionAt).length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top navigation bar */}
      <header className="border-b border-zinc-800/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg tracking-tight text-white">
            raqibit<span className="text-[#00e5ff]">.</span>
          </span>
          <span className="text-zinc-600 text-xs font-mono">admin</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-2 rounded-lg transition-colors"
          >
            View Site ↗
          </Link>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="bg-[#00e5ff] hover:bg-[#00c8e0] text-black text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            + New Project
          </button>

          <button
            type="button"
            onClick={syncGitHub}
            disabled={syncing}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {syncing ? 'Syncing…' : 'Sync GitHub'}
          </button>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-zinc-500 hover:text-zinc-300 text-xs sm:text-sm px-2 py-2 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Filters + search */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {(['all', 'published', 'draft', 'featured'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#00e5ff] text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}

          <div className="w-full sm:w-auto sm:ml-auto">
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e5ff] transition-colors w-full sm:w-56"
            />
          </div>
        </div>

        {/* Projects grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 bg-zinc-900 rounded-xl animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-24 text-zinc-600">
              {projects.length === 0
                ? 'No projects yet — click "Sync GitHub" or "+ New Project" to get started.'
                : 'No projects match your filter.'}
            </div>
          ) : (
            filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={() => setSelected(p)}
                onTogglePublish={() => togglePublish(p)}
                onToggleFeatured={() => toggleFeatured(p)}
                onRequestDelete={() => setPendingDelete(p)}
                onRefresh={load}
                showToast={showToast}
              />
            ))
          )}
        </div>
      </main>

      {/* Edit modal */}
      {selected && (
        <ProjectEditModal
          project={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null)
            load()
          }}
          showToast={showToast}
        />
      )}

      {/* Create manual project modal */}
      {showCreateModal && (
        <NewProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            load()
          }}
          showToast={showToast}
        />
      )}

      {/* Styled delete confirmation modal */}
      {pendingDelete && (
        <DeleteConfirmModal
          project={pendingDelete}
          deleting={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 max-w-md text-center">
          {toast}
        </div>
      )}
    </div>
  )
}
