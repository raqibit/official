'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectDetailOverlay } from '@/components/overlays/ProjectDetailOverlay'

type ProjectSummary = {
  id: string
  name: string
  tagline: string
  videoUrl: string
  images?: string[]
  techStack: string[]
  accentColor: string
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: ProjectSummary
  index: number
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const mainImage = project.images && project.images.length > 0 ? project.images[0] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative flex flex-col justify-end bg-[#111] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-all duration-500 overflow-hidden cursor-pointer min-h-[350px] rounded-2xl"
    >
      {/* Background Image */}
      {mainImage ? (
        <div className="absolute inset-0 z-0">
          <img src={mainImage} alt={project.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#0d0d0d] flex items-center justify-center opacity-60 group-hover:opacity-20 transition-opacity duration-500">
          <span className="font-mono text-xs text-gray-700 tracking-widest">NO IMAGE</span>
        </div>
      )}

      {/* Video background on hover */}
      <AnimatePresence>
        {isHovered && project.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
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

      {/* Bottom Gradient for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0" />

      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${project.accentColor}, transparent)` }}
      />
      {/* Corner dot */}
      <div
        className="absolute top-6 right-6 w-2 h-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
        style={{ background: project.accentColor }}
      />

      {/* Content */}
      <motion.div 
        className="p-8 z-10 relative flex flex-col justify-end h-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3
          className="text-2xl font-bold mb-3 transition-colors duration-300"
          style={{ fontFamily: 'var(--font-sans)', color: project.accentColor }}
        >
          {project.name}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
          {project.tagline}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 border"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: project.accentColor,
                  borderColor: `${project.accentColor}30`,
                  background: `${project.accentColor}0a`,
                  letterSpacing: '0.05em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="flex items-center gap-1.5 text-xs text-white transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            VIEW <ArrowIcon />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-28">
      {/* Overlay */}
      <ProjectDetailOverlay
        projectId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">

        {/* Page Header */}
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
            Things I've built.
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedId(project.id)}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
