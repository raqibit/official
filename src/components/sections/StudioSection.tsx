'use client'

/**
 * StudioSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Showcases the microsoldering studio side of the business.
 * Left column: amber-toned photo with mouse-driven spotlight colour reveal.
 * Right column: heading, description, stat grid, services list.
 *
 * Performance: Mouse tracking uses CSS custom properties updated via RAF
 * to avoid React re-renders on every pixel of movement.
 */

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useCallback } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'

// ── Studio stats ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '40+', label: 'Successful Repairs' },
  { value: '3yrs', label: 'Precision Experience' },
  { value: '100%', label: 'Data Recovery Rate' },
] as const

// ── Services list ─────────────────────────────────────────────────────────────

const SERVICES = [
  'iPhone & MacBook Logic Board Repair',
  'BGA Chip Reballing & Replacement',
  'Water Damage Diagnosis & Recovery',
  'NAND Flash Data Recovery',
  'Right-to-Repair Advocacy',
] as const

export function StudioSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Updates CSS custom properties for the spotlight mask position.
   * This avoids React state updates (and re-renders) on every mouse pixel.
   */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    containerRef.current.style.setProperty('--spot-x', `${x}px`)
    containerRef.current.style.setProperty('--spot-y', `${y}px`)
  }, [])

  const handleMouseEnter = useCallback(() => {
    containerRef.current?.style.setProperty('--spot-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    containerRef.current?.style.setProperty('--spot-opacity', '0')
  }, [])

  return (
    <section id="studio" className="relative bg-[#080808] py-28 sm:py-36 overflow-hidden">
      {/* Ambient amber glow — top-right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40vw] h-[60vh] bg-amber-500 opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">

        {/* Section label */}
        <SectionLabel color="#f59e0b">The Studio</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT — Studio photo ─────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative h-[420px] lg:h-[520px] w-full order-2 lg:order-1 rounded-2xl overflow-hidden group bg-gray-900/5"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ '--spot-x': '0px', '--spot-y': '0px', '--spot-opacity': '0' } as React.CSSProperties}
          >
            {/* Corner frame markers */}
            <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 opacity-50 z-20 transition-opacity duration-700 group-hover:opacity-10" />
            <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 opacity-50 z-20 transition-opacity duration-700 group-hover:opacity-10" />
            <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 opacity-50 z-20 transition-opacity duration-700 group-hover:opacity-10" />
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 opacity-50 z-20 transition-opacity duration-700 group-hover:opacity-10" />

            {/* Floating label badge */}
            <span
              className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] uppercase text-amber-400 opacity-90 z-20 bg-[#080808]/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-amber-500/20 transition-opacity duration-700 group-hover:opacity-0"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ENGINEERED FOR PRECISION
            </span>

            {/* Base Studio photo — b/w and blended */}
            <Image
              src="/images/studio/photo1.jpg"
              alt="Microsoldering Studio — Raqīb Ismāʿīl"
              fill
              loading="lazy"
              className="object-cover opacity-50 grayscale mix-blend-luminosity pointer-events-none"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Overlay Studio photo — full color revealed by mouse mask (CSS-driven) */}
            <div
              className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: 'var(--spot-opacity)',
                WebkitMaskImage: `radial-gradient(circle 200px at var(--spot-x) var(--spot-y), black 0%, transparent 100%)`,
                maskImage: `radial-gradient(circle 200px at var(--spot-x) var(--spot-y), black 0%, transparent 100%)`,
              }}
            >
              <Image
                src="/images/studio/photo1.jpg"
                alt="Microsoldering Studio — Raqīb Ismāʿīl (Color Reveal)"
                fill
                loading="lazy"
                className="object-cover pointer-events-none"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* ── RIGHT — Copy + stats + services ──────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <h2
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Precision at
              <br />
              <span className="text-amber-400 text-glow-amber">400°C.</span>
            </h2>

            {/* Tagline — italicised display font */}
            <p
              className="text-xl italic text-gray-500 mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <em>Beyond software engineering, I operate an advanced microsoldering laboratory.</em>
            </p>

            {/* Body copy */}
            <p
              className="text-[15px] text-gray-500 leading-[1.7] mb-10 max-w-md"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              I specialize in intricate logic board restorations for iPhones and MacBooks.
              This discipline demands extreme precision—performing deep fault diagnostics via
              advanced schematics, executing component-level rework under a trinocular microscope,
              and conducting mission-critical data recovery on severely water-damaged or physically
              compromised devices. I bring the exact same rigorous problem-solving from the
              codebase directly to the motherboard.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-0 border border-amber-500/15 mb-12">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`p-6 text-center ${i < STATS.length - 1 ? 'border-r border-amber-500/15' : ''}`}
                >
                  <div
                    className="text-2xl font-bold text-amber-400 text-glow-amber mb-1"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] tracking-widest uppercase text-gray-600"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Services list */}
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 text-sm text-gray-400"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span className="block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
