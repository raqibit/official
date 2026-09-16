'use client'

/**
 * FeaturedProjects
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders featured projects in a bento grid layout on the home page:
 *  - First project: full 3-column width (featured)
 *  - Next two: split across 1 + 2 columns
 *
 * Uses shared icons, SectionLabel, and TechTag components.
 * Opens ProjectDetailOverlay on card click.
 */

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { type Project } from '@/lib/mdx'
import { ProjectDetailOverlay } from '@/components/overlays/ProjectDetailOverlay'
import { ArrowIcon } from '@/components/icons'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TechTag } from '@/components/ui/TechTag'

// ── Section header (shared between empty + live states) ───────────────────────

function SectionHeader({ showAllLink }: { showAllLink?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
      <div>
        <SectionLabel className="mb-4">Selected Work</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-4xl sm:text-5xl font-bold text-white"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Things I&apos;ve built.
        </motion.h2>
      </div>

      {showAllLink && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
          >
            ALL PROJECTS
            <ArrowIcon />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  className = '',
  index,
  onClick,
}: {
  project: Project
  className?: string
  index: number
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative flex flex-col justify-between bg-[#111] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500 overflow-hidden cursor-pointer ${className}`}
    >
      {/* Hover video background — muted autoplay */}
      <AnimatePresence>
        {isHovered && project.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <video
              src={project.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accent glow line at top on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${project.accentColor}, transparent)` }}
      />

      {/* Corner accent dot */}
      <div
        className="absolute top-6 right-6 w-2 h-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
        style={{ background: project.accentColor }}
      />

      {/* Card content */}
      <div className="p-8 z-10 relative">
        <h3
          className="text-xl font-bold text-white mb-3 transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-sans)',
            color: isHovered ? project.accentColor : 'white',
          }}
        >
          {project.name}
        </h3>
        <p
          className="text-sm text-gray-500 leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {project.tagline}
        </p>
      </div>

      {/* Card footer: tech stack + VIEW arrow */}
      <div className="p-8 pt-0 flex items-center justify-between z-10 relative">
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tag) => (
            <TechTag key={tag} label={tag} accentColor={project.accentColor} />
          ))}
        </div>
        <div
          className="flex items-center gap-1.5 text-xs text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          VIEW <ArrowIcon />
        </div>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (!projects || projects.length === 0) return null

  const p1 = projects[0]
  const p2 = projects[1]
  const p3 = projects[2]

  return (
    <section id="projects" className="py-28 sm:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">
        <SectionHeader showAllLink />

        {/* Bento grid for 3 items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.04]">
          {p1 && (
            <ProjectCard
              project={p1}
              className="lg:col-span-3"
              index={0}
              onClick={() => setSelectedProject(p1)}
            />
          )}
          {p2 && (
            <ProjectCard
              project={p2}
              className="lg:col-span-1"
              index={1}
              onClick={() => setSelectedProject(p2)}
            />
          )}
          {p3 && (
            <ProjectCard
              project={p3}
              className="lg:col-span-2"
              index={2}
              onClick={() => setSelectedProject(p3)}
            />
          )}
        </div>
      </div>

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailOverlay
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
