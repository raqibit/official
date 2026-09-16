'use client'

/**
 * ProjectDetailOverlay
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen bottom-sheet overlay showing project details: image gallery,
 * title, about text, tech stack, review quote, and CTA buttons
 * (live preview, GitHub, purchase).
 *
 * Uses shared icons and TechTag components for consistency.
 */

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { type Project } from '@/lib/mdx'
import { PurchaseModal } from '@/components/overlays/PurchaseModal'
import { CloseIcon, ExternalLinkIcon, GitHubMark, ChevronIcon } from '@/components/icons'
import { TechTag } from '@/components/ui/TechTag'

// ── Image Gallery ─────────────────────────────────────────────────────────────

function ImageGallery({ images, name, accentColor }: { images: string[]; name: string; accentColor: string }) {
  const [activeIdx, setActiveIdx] = useState(0)

  const prev = useCallback(() =>
    setActiveIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() =>
    setActiveIdx(i => (i + 1) % images.length), [images.length])

  if (images.length === 0) return null

  return (
    <div className="relative w-full aspect-video bg-[#0a0a0a] overflow-hidden rounded-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <Image
            src={images[activeIdx]}
            alt={`${name} — screenshot ${activeIdx + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={activeIdx === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows — only if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <ChevronIcon direction="right" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i === activeIdx ? accentColor : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
        </>
      )}

      {/* Top accent glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}80, transparent)` }}
      />
    </div>
  )
}

// ── Main Overlay ──────────────────────────────────────────────────────────────

export function ProjectDetailOverlay({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
  const hasImages = project.images && project.images.length > 0

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [])

  // Parse newline-separated about text into paragraphs
  const aboutParagraphs = project.about
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-md"
        aria-label="Close overlay"
      />

      {/* ── Panel ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: '4%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '3%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-[91] flex flex-col bg-[#0f0f0f] border-t border-white/[0.06] overflow-hidden"
        style={{ height: '92vh', maxHeight: '92vh' }}
        aria-modal="true"
        role="dialog"
        aria-label={project.name}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${project.accentColor}, transparent)` }}
        />

        {/* ── Header bar ──────────────────────────────────── */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3">
            <span
              className="block w-2 h-2 rounded-full"
              style={{ background: project.accentColor, boxShadow: `0 0 8px ${project.accentColor}80` }}
            />
            <span
              className="font-mono text-xs tracking-[0.2em] uppercase"
              style={{ color: project.accentColor }}
            >
              Project Detail
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 transition-all"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable body ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 xl:px-16 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">

              {/* LEFT: Media (images / video) */}
              <div className="flex flex-col gap-4">
                {hasImages ? (
                  <ImageGallery
                    images={project.images}
                    name={project.name}
                    accentColor={project.accentColor}
                  />
                ) : project.videoUrl ? (
                  <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-none overflow-hidden">
                    <video
                      src={project.videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
                      style={{ background: `linear-gradient(to right, transparent, ${project.accentColor}80, transparent)` }}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-[#111] flex items-center justify-center rounded-none border border-white/[0.04]">
                    <span className="font-mono text-xs text-gray-700 tracking-widest">NO MEDIA</span>
                  </div>
                )}

                {/* Tech stack — desktop: under image */}
                <div className="hidden lg:flex flex-wrap gap-2 pt-2">
                  {project.techStack.map(tag => (
                    <TechTag key={tag} label={tag} accentColor={project.accentColor} />
                  ))}
                </div>
              </div>

              {/* RIGHT: Info panel */}
              <div className="flex flex-col gap-8">

                {/* Title + tagline */}
                <div>
                  <h2
                    className="text-3xl md:text-4xl font-bold leading-tight mb-3"
                    style={{ fontFamily: 'var(--font-sans)', color: project.accentColor }}
                  >
                    {project.name}
                  </h2>
                  <p
                    className="text-base text-gray-400 leading-relaxed italic"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {project.tagline}
                  </p>
                </div>

                {/* About text */}
                <div className="flex flex-col gap-4">
                  {aboutParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm text-gray-500 leading-relaxed"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Tech stack — mobile: under about text */}
                <div className="flex lg:hidden flex-wrap gap-2">
                  {project.techStack.map(tag => (
                    <TechTag key={tag} label={tag} accentColor={project.accentColor} />
                  ))}
                </div>

                {/* Review / testimonial */}
                {project.review && (
                  <blockquote
                    className="border-l-2 pl-5 py-1"
                    style={{ borderColor: `${project.accentColor}50` }}
                  >
                    <p
                      className="text-sm italic text-gray-400 leading-relaxed"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      &ldquo;{project.review}&rdquo;
                    </p>
                  </blockquote>
                )}

                {/* Divider */}
                <div className="h-px bg-white/[0.05]" />

                {/* CTA buttons */}
                <div className="flex flex-col gap-3">
                  {project.price > 0 && (
                    <button
                      onClick={() => setIsPurchaseOpen(true)}
                      className="group w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-black transition-all duration-300"
                      style={{ background: project.accentColor }}
                    >
                      <span className="font-mono tracking-widest uppercase text-xs">
                        Purchase Idea
                      </span>
                      <span className="font-mono font-bold text-base">
                        ${project.price.toLocaleString()}
                      </span>
                    </button>
                  )}

                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase border border-white/[0.1] text-white hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Live Preview <ExternalLinkIcon />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase border border-white/[0.1] text-white hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
                        style={{ fontFamily: 'var(--font-mono)' }}
                        aria-label="View source on GitHub"
                      >
                        <GitHubMark className="w-4 h-4" />
                        {!project.liveUrl && <span>GitHub</span>}
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        project={{
          name: project.name,
          price: project.price,
          accentColor: project.accentColor,
        }}
      />
    </>
  )
}
