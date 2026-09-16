'use client'

import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// SectionLabel — reusable "line + mono label" pattern
// ─────────────────────────────────────────────────────────────────────────────
// Used at the top of every major section (Skills, Studio, Projects, Contact,
// Booking, Newsletter, About, Uses). Provides consistent entrance animation.

type SectionLabelProps = {
  children: React.ReactNode
  /** Colour of the leading line and text (defaults to gray-700 / gray-600) */
  color?: string
  /** Center-align the label (used in Newsletter section) */
  centered?: boolean
  /** Bottom margin class override */
  className?: string
}

export function SectionLabel({
  children,
  color,
  centered = false,
  className = 'mb-16',
}: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`flex items-center gap-4 ${centered ? 'justify-center' : ''} ${className}`}
    >
      <span
        className="block h-px w-8"
        style={{ backgroundColor: color || 'rgb(55, 65, 81)' }}
      />
      <span
        className="font-mono text-xs tracking-[0.2em] uppercase"
        style={{
          fontFamily: 'var(--font-mono)',
          color: color || 'rgb(75, 85, 99)',
        }}
      >
        {children}
      </span>
      {/* Trailing line for centered labels (Newsletter style) */}
      {centered && (
        <span
          className="block h-px w-8"
          style={{ backgroundColor: color || 'rgb(55, 65, 81)' }}
        />
      )}
    </motion.div>
  )
}
