'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { type Project as ProjectType } from '@/lib/mdx'
import { ProjectDetailOverlay } from '@/components/overlays/ProjectDetailOverlay'
import { ArrowIcon } from '@/components/icons'

// ── Shuffle (client-only, SSR-safe) ───────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── ProjectCard ───────────────────────────────────────────────────────────────

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: ProjectType
  index: number
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mainImage = project.images.length > 0 ? project.images[0] : null

  // Play/pause video on hover (only when no static image)
  useEffect(() => {
    const video = videoRef.current
    if (!video || mainImage) return
    if (isHovered) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isHovered, mainImage])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      className={`group relative overflow-hidden cursor-pointer rounded-2xl bg-[#111] ${
        project.wide 
          ? 'sm:col-span-2 aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/9]' 
          : 'col-span-1 aspect-[4/3]'
      }`}
    >
      {/* ── Full-bleed media layer (always covers 100% of card) ─── */}
      {mainImage ? (
        <Image
          src={mainImage}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : project.videoUrl ? (
        <video
          ref={videoRef}
          src={project.videoUrl}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: `${project.accentColor}40` }}
          >
            {project.name.toUpperCase()}
          </span>
        </div>
      )}

      {/* ── Hover video overlay (when static image exists) ────────── */}
      <AnimatePresence>
        {isHovered && project.videoUrl && mainImage && (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={project.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── Permanent gradient — darkens bottom so text is always readable ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/0 pointer-events-none" />

      {/* ── Hover dim — darkens whole card slightly on hover ─────── */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* ── Accent top-border glow on hover ──────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(to right, transparent, ${project.accentColor}, transparent)`,
        }}
      />

      {/* ── Accent corner dot ─────────────────────────────────────── */}
      <div
        className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: project.accentColor,
          opacity: isHovered ? 1 : 0.5,
          boxShadow: isHovered ? `0 0 8px ${project.accentColor}` : 'none',
        }}
      />

      {/* ── Text content — always pinned to bottom ────────────────── */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col gap-2">

        {/* Project name — always visible */}
        <h3
          className="text-base md:text-lg font-bold leading-snug tracking-tight"
          style={{ fontFamily: 'var(--font-sans)', color: project.accentColor }}
        >
          {project.name}
        </h3>

        {/* Tagline + tech + VIEW — revealed on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-col gap-2.5"
          aria-hidden={!isHovered}
        >
          <p
            className="text-[11px] md:text-xs text-gray-300 leading-relaxed line-clamp-2"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {project.tagline}
          </p>

          <div className="flex items-center justify-between">
            {/* Tech tags — up to 3 */}
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[9px] px-1.5 py-0.5 rounded-sm border"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: project.accentColor,
                    borderColor: `${project.accentColor}50`,
                    background: `${project.accentColor}15`,
                    letterSpacing: '0.06em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* VIEW label */}
            <span
              className="flex items-center gap-1 text-[10px] text-white/80"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              OPEN <ArrowIcon className="h-3 w-3" />
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})

// ── ProjectsClient ────────────────────────────────────────────────────────────

export function ProjectsClient({ projects }: { projects: ProjectType[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)

  // SSR-safe shuffle: start with original server-rendered order,
  // shuffle only after client hydration completes (no mismatch).
  const [displayProjects, setDisplayProjects] = useState<ProjectType[]>(projects)
  useEffect(() => {
    setDisplayProjects(shuffle(projects))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">

        {/* ── Page Header ─────────────────────────────── */}
        <div className="mb-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="block h-px w-8 bg-gray-700" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">
              Portfolio Archive
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold font-sans text-white mb-6"
          >
            Things I&apos;ve built.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-display italic"
          >
            A collection of projects spanning frontend UI engineering to full-stack applications.
            Click any card to explore.
          </motion.p>
        </div>

        {/* ── Projects Grid ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 grid-flow-row-dense">
          {displayProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

      </div>

      {/* ── Project Detail Overlay ───────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailOverlay
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
