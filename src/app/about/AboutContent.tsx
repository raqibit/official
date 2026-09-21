'use client'

/**
 * AboutContent
 * ─────────────────────────────────────────────────────────────────────────────
 * Full about page content: bio, skill proficiency bars, social links (left),
 * and a portrait photo with mouse-driven colour reveal + timeline (right).
 *
 * Data imported from centralised modules. Mouse spotlight uses CSS custom
 * properties for zero-rerender tracking.
 */

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'

import { Container } from '@/components/layout/Container'
import { socialLinks } from '@/data/socials'
import { timeline, skills } from '@/data/about'
import { OWNER_EMAIL } from '@/data/site'
import { MailIcon } from '@/components/icons'

const portraitImage = '/images/portrait.jpg'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export function AboutContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Updates CSS custom properties for the spotlight mask position.
   * Avoids React state re-renders on every mouse pixel.
   */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    containerRef.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    containerRef.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleMouseEnter = useCallback(() => {
    containerRef.current?.style.setProperty('--spot-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    containerRef.current?.style.setProperty('--spot-opacity', '0')
  }, [])

  return (
    <Container className="mt-20 sm:mt-32 pb-24 sm:pb-32 overflow-hidden">
      <div className="grid grid-cols-1 gap-y-24 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16 items-start">

        {/* ── LEFT COL (Text content) ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-5 flex flex-col gap-16 lg:order-first"
        >
          {/* Header & Bio */}
          <div>
            <motion.div variants={item} className="flex items-center gap-4 mb-10">
              <span className="block h-px w-8 bg-gray-700" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
                About Me
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-8 leading-[1.1]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Building software,<br />
              <span className="italic font-normal text-gray-500" style={{ fontFamily: 'var(--font-display)' }}>
                engineering
              </span> systems.
            </motion.h1>

            <motion.div variants={item} className="space-y-6 text-[15px] text-gray-500 leading-[1.7]" style={{ fontFamily: 'var(--font-sans)' }}>
              <p>
                I&apos;m a Lagos-based software engineer and microsoldering specialist. I operate at the intersection of
                AI-driven software development, premium visual design, and hardware-level diagnostics.
              </p>
              <p>
                This multifaceted perspective shapes everything I build. Whether I am tuning an LLM pipeline,
                crafting a pixel-perfect user interface, or restoring a water-damaged logic board under a microscope,
                my approach remains the same: meticulous precision and robust architecture.
              </p>
              <p>
                When I&apos;m not writing code or running board diagnostics, I&apos;m obsessing over typography,
                animation timing, and the micro-interactions that make a great product feel alive.
              </p>
            </motion.div>
          </div>

          {/* Skill Bars */}
          <motion.div variants={item} className="mt-8">
            <h2 className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-700 mb-8" style={{ fontFamily: 'var(--font-mono)' }}>Proficiency</h2>
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-sans)' }}>{skill.name}</span>
                    <span className="text-[10px] font-mono tracking-widest text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>{skill.level}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-[rgba(255,255,255,0.03)] relative overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: skill.color, boxShadow: `0 0 10px ${skill.color}40` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={item}>
            <h2 className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-700 mb-6" style={{ fontFamily: 'var(--font-mono)' }}>Find Me Online</h2>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,229,255,0.4)] transition-all duration-500"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 fill-gray-500 group-hover:fill-[#00e5ff] transition-colors duration-500" />
                </Link>
              ))}
              <Link
                href={`mailto:${OWNER_EMAIL}`}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,229,255,0.4)] transition-all duration-500"
                aria-label="Email"
              >
                <MailIcon className="h-5 w-5 fill-gray-500 group-hover:fill-[#00e5ff] transition-colors duration-500" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT COL (Visuals) ── */}
        <div className="lg:col-span-6 lg:col-start-7 space-y-24">

          {/* Portrait Image — spotlight hover using CSS custom properties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative group overflow-hidden rounded-xl bg-gray-900/5 max-w-[400px] ml-auto lg:mt-12 rotate-2 hover:rotate-0 transition-transform duration-700"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ '--spot-x': '0px', '--spot-y': '0px', '--spot-opacity': '0' } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#00e5ff]/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

            {/* Base Image - B/W */}
            <Image
              src={portraitImage}
              alt="Raqīb Ismāʿīl"
              width={500}
              height={625}
              priority
              sizes="(min-width: 1024px) 20rem, 100vw"
              className="relative aspect-[4/5] w-full object-cover opacity-60 grayscale mix-blend-luminosity pointer-events-none"
            />

            {/* Spotlight Color Reveal Image (CSS-driven, zero re-renders) */}
            <div
              className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: 'var(--spot-opacity)',
                WebkitMaskImage: `radial-gradient(circle 160px at var(--spot-x) var(--spot-y), black 0%, transparent 100%)`,
                maskImage: `radial-gradient(circle 160px at var(--spot-x) var(--spot-y), black 0%, transparent 100%)`,
              }}
            >
              <Image
                src={portraitImage}
                alt="Raqīb Ismāʿīl (Color Reveal)"
                fill
                priority
                className="object-cover pointer-events-none"
                sizes="(min-width: 1024px) 20rem, 100vw"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.03] rounded-xl z-20" />
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-[400px] ml-auto"
          >
            <h2 className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-700 mb-10" style={{ fontFamily: 'var(--font-mono)' }}>Timeline</h2>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-[rgba(255,255,255,0.06)]" />
              <div className="space-y-12">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex gap-6 relative group">
                    <div className="mt-1 w-3 h-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#0a0a0a] shrink-0 relative z-10 group-hover:border-[#00e5ff] transition-colors duration-500">
                      <div className="absolute inset-0 rounded-full bg-[#00e5ff] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="font-mono text-[10px] tracking-widest text-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>{entry.year}</span>
                        <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-sans)' }}>{entry.title}</span>
                      </div>
                      <p className="text-[15px] text-gray-600 leading-[1.7]" style={{ fontFamily: 'var(--font-sans)' }}>{entry.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </Container>
  )
}
