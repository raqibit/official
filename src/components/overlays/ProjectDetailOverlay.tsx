'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PurchaseModal } from '@/components/overlays/PurchaseModal'

export type FullProject = {
  id: string
  name: string
  tagline: string
  about: string
  videoUrl: string
  images?: string[]
  liveUrl: string
  githubUrl: string
  techStack: string[]
  review: string
  price: number
  accentColor: string
}

type Tab = 'overview' | 'stack' | 'review'

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

// ─── Visual Panel (Left) ─────────────────────────────────────────────────────

function VisualPanel({ project }: { project: FullProject }) {
  const [isHovering, setIsHovering] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const images = (project.images ?? []).filter(Boolean)
  const mainImage = images[activeIdx] ?? null
  const hasVideo = !!project.videoUrl
  const hasMultiple = images.length > 1

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Main Visual */}
      <div
        className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] cursor-pointer select-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Static Image */}
        {mainImage && (
          <motion.img
            key={activeIdx}
            src={mainImage}
            alt={project.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering && hasVideo ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Video — fades in on hover */}
        {hasVideo && (
          <motion.div
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <video
              src={project.videoUrl}
              autoPlay={isHovering}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Empty state */}
        {!mainImage && !hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-gray-600 tracking-widest">NO MEDIA</span>
          </div>
        )}

        {/* Accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: `linear-gradient(to right, ${project.accentColor}, transparent)` }}
        />

        {/* Hover badge */}
        {hasVideo && (
          <AnimatePresence>
            {!isHovering && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded bg-black/60 backdrop-blur border border-[rgba(255,255,255,0.08)]"
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: project.accentColor }} />
                <span className="font-mono text-[10px] text-white tracking-widest">HOVER TO PLAY</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                activeIdx === idx
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Details Panel (Right) ───────────────────────────────────────────────────

function DetailsPanel({
  project,
  onPurchase,
}: {
  project: FullProject
  onPurchase: () => void
}) {
  const [tab, setTab] = useState<Tab>('overview')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stack', label: 'Tech Stack' },
    ...(project.review ? [{ id: 'review' as Tab, label: 'Review' }] : []),
  ]

  const safeAbout = project.about ?? ''
  const safeTechStack = project.techStack ?? []
  const safeReview = project.review ?? ''

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Project header */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full" style={{ background: project.accentColor }} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500">Case Study</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-sans text-white leading-tight mb-3">
          {project.name}.
        </h2>
        <p className="text-lg text-gray-400 font-display italic leading-snug">
          {project.tagline}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[rgba(255,255,255,0.03)] rounded-full border border-[rgba(255,255,255,0.05)] mb-8 flex-shrink-0 self-start">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-5 py-2 rounded-full text-sm font-sans transition-all ${
              tab === t.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="overlay-tab"
                className="absolute inset-0 bg-[rgba(255,255,255,0.08)] rounded-full border border-[rgba(255,255,255,0.08)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content (scrollable) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.08)] pr-2 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'overview' && (
              <div className="font-sans text-gray-400 leading-relaxed space-y-4">
                {safeAbout.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {tab === 'stack' && (
              <div className="flex flex-col gap-2">
                {safeTechStack.map(tech => (
                  <div
                    key={tech}
                    className="flex items-center gap-4 px-4 py-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.accentColor }} />
                    <span className="font-mono text-sm text-white tracking-widest uppercase">{tech}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'review' && safeReview && (
              <div className="relative pl-5 border-l-2" style={{ borderColor: project.accentColor }}>
                <p className="text-xl font-display italic text-gray-300 leading-relaxed">
                  "{safeReview}"
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTAs — always pinned to bottom */}
      <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)] flex-shrink-0 flex flex-col sm:flex-row gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black text-sm font-bold font-sans rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Live Demo
            <ExternalLinkIcon />
          </a>
        )}

        {project.price > 0 && (
          <button
            onClick={onPurchase}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-bold font-sans rounded-lg transition-colors"
            style={{ background: project.accentColor }}
          >
            Purchase Idea — ${project.price.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Overlay ────────────────────────────────────────────────────────────

export function ProjectDetailOverlay({
  projectId,
  onClose,
}: {
  projectId: string | null
  onClose: () => void
}) {
  const [project, setProject] = useState<FullProject | null>(null)
  const [loading, setLoading] = useState(false)
  const [purchaseOpen, setPurchaseOpen] = useState(false)

  // Fetch full project details when id changes
  useEffect(() => {
    if (!projectId) {
      setProject(null)
      return
    }
    setLoading(true)
    fetch(`/api/projects/${projectId}`)
      .then(r => r.json())
      .then(data => {
        setProject(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [projectId])

  // Esc key closes overlay
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )
  useEffect(() => {
    if (projectId) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [projectId, handleKey])

  const isOpen = !!projectId

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-[201] max-w-[1200px] mx-auto bg-[#0f0f0f] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
              style={{ boxShadow: project ? `0 0 80px 0 ${project.accentColor}18` : undefined }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-[rgba(255,255,255,0.05)] flex-shrink-0">
                <div className="flex items-center gap-3">
                  {project && (
                    <span
                      className="font-mono text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full border"
                      style={{
                        color: project.accentColor,
                        borderColor: `${project.accentColor}30`,
                        background: `${project.accentColor}0d`,
                      }}
                    >
                      Project
                    </span>
                  )}
                  {project && (
                    <span className="font-sans text-sm text-gray-500">
                      {project.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden p-8">
                {loading && (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-2 border-[rgba(255,255,255,0.1)] border-t-white rounded-full animate-spin" />
                      <span className="font-mono text-xs text-gray-600 tracking-widest">LOADING</span>
                    </div>
                  </div>
                )}

                {!loading && project && (
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 h-full">
                    <VisualPanel project={project} />
                    <DetailsPanel project={project} onPurchase={() => setPurchaseOpen(true)} />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Purchase Modal sits above the overlay */}
      {project && (
        <PurchaseModal
          isOpen={purchaseOpen}
          onClose={() => setPurchaseOpen(false)}
          project={{ name: project.name, price: project.price, accentColor: project.accentColor }}
        />
      )}
    </>
  )
}
