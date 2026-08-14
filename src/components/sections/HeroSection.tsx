'use client'

/**
 * HeroSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Homepage hero: left column has name, tagline, stats, CTAs, socials.
 * Right column shows a toggleable GlassTerminal (default) or AnimatedCodeEditor.
 *
 * Animation: framer-motion stagger container/item pattern for the left column.
 */

import Link from 'next/link'
import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/layout/SocialIcons'
import { Container } from '@/components/layout/Container'
import { GlassTerminal } from '@/components/ui/GlassTerminal'
import { AnimatedCodeEditor } from '@/components/ui/AnimatedCodeEditor'

// ── Social link pill ──────────────────────────────────────────────────────────
function SocialLink({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="VIEW"
      className="group relative flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all duration-300"
    >
      <Icon className="h-4 w-4 fill-gray-500 transition group-hover:fill-[#00e5ff]" />
    </Link>
  )
}

// ── Framer Motion variants ─────────────────────────────────────────────────────
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

// ── Hero stats ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: '3+', label: 'Years Engineering' },
  { value: '40+', label: 'Features Shipped' },
]

// ── Toggle tabs ────────────────────────────────────────────────────────────────
const TABS = ['Terminal', 'Code'] as const
type Tab = (typeof TABS)[number]

// ── Component ─────────────────────────────────────────────────────────────────
export function HeroSection() {
  // 'Terminal' = GlassTerminal (default), 'Code' = AnimatedCodeEditor
  const [activeTab, setActiveTab] = useState<Tab>('Terminal')

  return (
    <Container className="mt-9 sm:mt-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_48%] gap-12 lg:gap-8 py-12">

        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 md:pr-8 lg:pr-16"
        >
          {/* Name */}
          <motion.div variants={item}>
            <h1
              className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white"
              style={{ fontWeight: 700 }}
            >
              Roqeeb
              <br />
              <span className="text-[#00e5ff] text-glow-cyan">Ismail.</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.div variants={item}>
            <p className="text-xl sm:text-2xl text-gray-400 italic leading-snug font-display">
              <em>Where software meets&nbsp;the&nbsp;silicon.</em>
            </p>
          </motion.div>

          {/* Descriptor */}
          <motion.div variants={item}>
            <p className="max-w-lg text-base text-gray-500 leading-relaxed">
              Frontend engineer building high-performance interfaces.
              Visual designer crafting experiences that feel alive.
              Microsoldering specialist repairing circuits at the component level.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={item} className="flex flex-wrap gap-8 pt-2">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-3xl font-bold text-glow-cyan font-mono"
                  style={{ color: '#00e5ff' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 tracking-widest uppercase mt-1 font-mono">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/projects"
              data-cursor="VIEW"
              className="group inline-flex items-center gap-2 rounded-none border border-[#00e5ff] bg-transparent px-7 py-3.5 text-sm font-semibold text-[#00e5ff] transition-all duration-300 hover:bg-[#00e5ff] hover:text-black"
              style={{ letterSpacing: '0.05em' }}
            >
              VIEW MY WORK
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <Link
              href="/about"
              data-cursor="VIEW"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-gray-400 transition hover:text-white"
              style={{ letterSpacing: '0.05em' }}
            >
              ABOUT ME
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="flex gap-5 pt-2">
            <SocialLink href="https://x.com/prime3it" icon={XIcon} label="X / Twitter" />
            <SocialLink href="https://instagram.com/rq_ismail" icon={InstagramIcon} label="Instagram" />
            <SocialLink href="https://github.com/rq-ismail" icon={GitHubIcon} label="GitHub" />
            <SocialLink href="https://linkedin.com/in/roqeebismail" icon={LinkedInIcon} label="LinkedIn" />
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN — Terminal / Code editor ────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full flex flex-col items-center justify-center gap-4 lg:pl-6"
        >
          {/* Toggle pill: Terminal ↔ Code */}
          <div className="flex items-center gap-1 self-end rounded-full border border-white/[0.06] bg-white/[0.02] p-0.5 backdrop-blur-md">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-cursor=""
                className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all ${
                  activeTab === tab
                    ? 'bg-[#00e5ff] text-black font-bold'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Conditional widget render */}
          {activeTab === 'Terminal' ? <GlassTerminal /> : <AnimatedCodeEditor />}
        </motion.div>

      </div>
    </Container>
  )
}
