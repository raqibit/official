'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations'

export default function NotFound() {
  return (
    <section className="relative min-h-[80dvh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #00e5ff 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/4 w-[300px] h-[300px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />

      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center text-center px-6 max-w-lg"
      >
        {/* Giant faded numeral */}
        <motion.div
          variants={FADE_IN_UP}
          className="select-none font-bold leading-none pointer-events-none mb-2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(7rem, 20vw, 14rem)',
            color: '#00e5ff',
            opacity: 0.07,
            lineHeight: 1,
          }}
        >
          404
        </motion.div>

        {/* Label layered over the numeral */}
        <motion.div variants={FADE_IN_UP} className="-mt-10 mb-6">
          <span
            className="font-mono text-xs tracking-[0.25em] uppercase text-[#00e5ff]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Page Not Found
          </span>
        </motion.div>

        <motion.h1
          variants={FADE_IN_UP}
          className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          You&apos;ve hit the void.
        </motion.h1>

        <motion.p
          variants={FADE_IN_UP}
          className="text-[15px] text-gray-500 leading-relaxed mb-10"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          This page doesn&apos;t exist — or was moved. Let&apos;s get you back somewhere real.
        </motion.p>

        <motion.div variants={FADE_IN_UP} className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/20 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] text-xs font-mono tracking-widest uppercase"
          >
            ← Go Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-gray-500 hover:text-white border border-white/[0.06] hover:border-white/20 rounded-full transition-all duration-300 text-xs font-mono tracking-widest uppercase"
          >
            View Projects
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
