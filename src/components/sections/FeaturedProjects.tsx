'use client'

/**
 * FeaturedProjects
 * ─────────────────────────────────────────────────────────────────────────────
 * Homepage bento grid — first 3 projects from static PROJECTS data.
 * Cards show full-bleed project images with editorial overlay text.
 * Clicking opens ProjectDetailOverlay.
 */

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { type Project } from '@/lib/mdx'
import { ProjectDetailOverlay } from '@/components/overlays/ProjectDetailOverlay'
import { ArrowIcon } from '@/components/icons'

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ showAllLink }: { showAllLink?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-center gap-4 mb-4"
        >
          <span className="block h-px w-8 bg-gray-700" />
          <span
            className="font-mono text-xs tracking-[0.2em] uppercase text-gray-600"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Selected Work
          </span>
        </motion.div>
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
            className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-300"
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

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  className = '',
  index,
  featured = false,
  onClick,
}: {
  project: Project
  className?: string
  index: number
  featured?: boolean
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const mainImage = project.images.length > 0 ? project.images[0] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative overflow-hidden cursor-pointer bg-[#111] ${className}`}
      style={{ minHeight: featured ? '420px' : '280px' }}
    >
      {/* ── Full-bleed image background ────────────────────── */}
      {mainImage && (
        <>
          <Image
            src={mainImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          {/* Base dark overlay so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
        </>
      )}

      {/* Hover video overlay */}
      <AnimatePresence>
        {isHovered && project.videoUrl && (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            src={project.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Accent glow line at top */}
      <div
        className="absolute top-0 inset-x-0 h-[1px] pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(to right, transparent, ${project.accentColor}, transparent)`,
        }}
      />

      {/* Corner accent dot */}
      <div
        className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-500"
        style={{
          background: project.accentColor,
          opacity: isHovered ? 1 : 0.5,
          boxShadow: isHovered ? `0 0 8px ${project.accentColor}` : 'none',
        }}
      />

      {/* Hover dim enhancement */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ opacity: isHovered ? 1 : 0, background: 'rgba(0,0,0,0.25)' }}
      />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col gap-3 z-10">
        {/* Index number — editorial detail */}
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase transition-colors duration-300"
          style={{ color: `${project.accentColor}80` }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Project name */}
        <h3
          className="font-bold leading-tight transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: featured ? '1.5rem' : '1.1rem',
            color: project.accentColor,
          }}
        >
          {project.name}
        </h3>

        {/* Tagline — revealed on hover */}
        <motion.p
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
          transition={{ duration: 0.22 }}
          className="text-xs text-gray-300 leading-relaxed line-clamp-2 max-w-lg"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {project.tagline}
        </motion.p>

        {/* Footer row: tech tags + VIEW */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, featured ? 4 : 2).map(tag => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 border rounded-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: project.accentColor,
                  borderColor: `${project.accentColor}45`,
                  background: `${project.accentColor}12`,
                  letterSpacing: '0.06em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <motion.span
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-[10px] text-white/70 shrink-0"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            VIEW <ArrowIcon className="h-3 w-3" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  if (!projects || projects.length === 0) return null

  const [p1, p2, p3] = projects

  return (
    <section id="projects" className="py-28 sm:py-36 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">
        <SectionHeader showAllLink />

        {/* Bento grid — full-bleed image cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.04]">
          {p1 && (
            <ProjectCard
              project={p1}
              className="lg:col-span-3"
              index={0}
              featured
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
