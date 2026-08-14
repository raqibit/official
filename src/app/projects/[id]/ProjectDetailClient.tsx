'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PurchaseModal } from '@/components/overlays/PurchaseModal'

type Project = {
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

export function ProjectDetailClient({ project }: { project: Project }) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'stack' | 'review'>('overview')
  const [isHoveringVisual, setIsHoveringVisual] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stack', label: 'Tech Stack' },
    ...(project.review ? [{ id: 'review', label: 'Client Review' }] : [])
  ] as const

  const hasImages = project.images && project.images.length > 0
  const mainVisual = hasImages ? project.images![activeImageIndex] : null

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-20 overflow-hidden relative">
      <PurchaseModal 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)} 
        project={project} 
      />

      {/* Background ambient glow */}
      <div 
        className="fixed top-0 right-0 w-[60vw] h-[60vh] opacity-[0.04] blur-[150px] rounded-full pointer-events-none z-0"
        style={{ background: project.accentColor }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-16">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK
          </Link>
          
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] mb-6">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: project.accentColor }} />
            <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Project Case Study</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold font-sans text-white mb-6">
            {project.name}.
          </h1>
          <p className="text-2xl italic text-gray-400 font-display max-w-2xl">
            {project.tagline}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 p-1.5 bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-full">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-sans transition-all duration-300 relative ${
                  activeTab === tab.id ? 'text-white font-medium' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[rgba(255,255,255,0.08)] rounded-full border border-[rgba(255,255,255,0.05)] z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Split Layout: Visuals (Left) + Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left: Visual Area */}
          <div className="space-y-6">
            <div 
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#111] border border-[rgba(255,255,255,0.05)] group cursor-pointer"
              onMouseEnter={() => setIsHoveringVisual(true)}
              onMouseLeave={() => setIsHoveringVisual(false)}
            >
              {/* Image Layer */}
              {mainVisual && (
                <img 
                  src={mainVisual} 
                  alt={project.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHoveringVisual && project.videoUrl ? 'opacity-0' : 'opacity-100'}`}
                />
              )}

              {/* Video Layer (Plays on hover) */}
              {project.videoUrl && (
                <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isHoveringVisual ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <video
                    src={project.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              )}

              {/* Fallback if no media */}
              {!mainVisual && !project.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-600 font-mono text-sm">NO MEDIA PROVIDED</span>
                </div>
              )}

              {/* Hover instruction overlay */}
              {project.videoUrl && !isHoveringVisual && (
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded border border-[rgba(255,255,255,0.1)] text-[10px] font-mono text-white tracking-widest flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  HOVER TO PLAY VIDEO
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasImages && project.images!.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {project.images!.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${activeImageIndex === idx ? 'border-white opacity-100' : 'border-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details Area */}
          <div className="flex flex-col h-full justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-[250px]"
              >
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-3xl font-bold font-sans text-white mb-6">
                      Project Details
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none font-sans text-gray-400 leading-relaxed mb-10">
                      {project.about.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'stack' && (
                  <div>
                    <h2 className="text-3xl font-bold font-sans text-white mb-6">
                      Architecture & Stack
                    </h2>
                    <p className="text-gray-400 mb-8 font-sans">
                      This project was built using the following core technologies, chosen for their performance and developer experience.
                    </p>
                    <div className="flex flex-col gap-3">
                      {project.techStack.map(tech => (
                        <div key={tech} className="flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-4 rounded-lg">
                          <div className="w-2 h-2 rounded-full" style={{ background: project.accentColor }} />
                          <span className="font-mono text-white text-sm tracking-widest uppercase">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'review' && (
                  <div>
                    <h2 className="text-3xl font-bold font-sans text-white mb-6">
                      Client Feedback
                    </h2>
                    <div className="relative">
                      <span className="absolute -top-6 -left-4 text-6xl text-[rgba(255,255,255,0.05)] font-serif">"</span>
                      <p className="text-2xl font-display italic text-gray-300 leading-snug relative z-10 pl-4 border-l-2" style={{ borderColor: project.accentColor }}>
                        {project.review}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons (Always visible) */}
            <div className="mt-12 pt-12 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex flex-col sm:flex-row gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-white text-black text-center text-sm font-bold font-sans hover:bg-gray-200 transition-colors rounded-lg flex items-center justify-center gap-2"
                  >
                    View Live Demo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}
                
                {project.price > 0 && (
                  <button 
                    onClick={() => setIsPurchaseModalOpen(true)}
                    className="flex-1 px-6 py-4 text-white text-center text-sm font-bold font-sans transition-colors rounded-lg flex items-center justify-center gap-2"
                    style={{ background: project.accentColor }}
                  >
                    Purchase Idea — ${project.price.toLocaleString()}
                  </button>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

