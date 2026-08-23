'use client'

/**
 * SkillsSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Three-column bento grid of disciplines: Software, Visual Design, Hardware.
 * Each card has a hover accent line, numbered heading, tagline, description,
 * and skill tag pills.
 *
 * Discipline data lives in @/data/disciplines for easy updates.
 */

import { motion } from 'framer-motion'
import { disciplines } from '@/data/disciplines'

export function SkillsSection() {
  return (
    <section id="skills" className="py-28 sm:py-36 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">

        {/* ── Section label ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="block h-px w-8 bg-gray-700" />
          <span
            className="font-mono text-xs tracking-[0.2em] uppercase text-gray-600"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            What I Do
          </span>
        </motion.div>

        {/* ── Section heading ───────────────────────────────── */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Disciplines
          <br />
          <span
            className="italic font-normal text-gray-500"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The rare combination.
          </span>
        </motion.h2>

        {/* ── Discipline cards ──────────────────────────────── */}
        {/* gap-px with bg color on the grid creates hairline dividers */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {disciplines.map((d, i) => (
            <motion.div
              key={d.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative flex flex-col bg-[#0a0a0a] p-10 lg:p-12 hover:bg-[#0f0f0f] transition-colors duration-500"
            >
              {/* Hover accent line at top of card */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to right, transparent, ${d.color}, transparent)` }}
              />

              {/* Large faded discipline number */}
              <div
                className="text-6xl font-bold leading-none mb-8 select-none transition-opacity duration-300"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: d.color,
                  opacity: 0.15,
                }}
              >
                {d.number}
              </div>

              {/* Discipline title */}
              <h3
                className="text-xl font-bold text-white mb-2 leading-tight"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {d.title}
              </h3>

              {/* Italic tagline in discipline accent colour */}
              <p
                className="text-base italic mb-6"
                style={{ fontFamily: 'var(--font-display)', color: d.color }}
              >
                {d.tagline}
              </p>

              {/* Description */}
              <p
                className="text-sm text-gray-500 leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {d.desc}
              </p>

              {/* Skill tag pills — pushed to bottom by mt-auto */}
              <div className="mt-auto flex flex-wrap gap-2">
                {d.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1 rounded-none border"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: d.color,
                      borderColor: d.colorBorder,
                      background: d.colorDim,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
