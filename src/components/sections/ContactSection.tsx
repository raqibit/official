'use client'

/**
 * ContactSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Two-column editorial contact layout:
 *  - Left: large heading, email CTA, resume download button
 *  - Right: social links list + location indicator
 *
 * Social links imported from centralised @/data/socials module.
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { socialLinks } from '@/data/socials'
import { LOCATION, TIMEZONE } from '@/data/site'
import { ContactModal } from '@/components/ui/ContactModal'
import { SectionLabel } from '@/components/ui/SectionLabel'

export function ContactSection() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <section className="py-28 sm:py-36 bg-[#080808] relative overflow-hidden">

      {/* Subtle purple glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40vw] h-[50vh] bg-[#7c3aed] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left — Editorial */}
          <div>
            <SectionLabel className="mb-10">Get in Touch</SectionLabel>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-5xl sm:text-6xl font-bold text-white leading-none mb-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Let&apos;s build
              <br />
              <span
                className="italic font-normal text-gray-500"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                something
              </span>
              <br />
              together.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500 leading-relaxed max-w-md mb-12"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Whether it&apos;s a complex web application, a critical hardware repair,
              or a design system — I bring precision and dedication to every
              project. Let&apos;s talk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-start gap-10"
            >
              <button
                onClick={() => setIsContactOpen(true)}
                className="group inline-flex items-center justify-center gap-3 w-fit px-8 py-4 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/20 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.2)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="text-xs uppercase tracking-widest font-bold">Contact Me</span>
                <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Right — Info + Socials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-10 pt-4 lg:pt-24"
          >
            {/* Socials */}
            <div>
              <h3
                className="text-xs tracking-[0.2em] uppercase text-gray-700 mb-6"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Elsewhere
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,229,255,0.4)] transition-all"
                  >
                    <social.icon className="h-5 w-5 fill-gray-500 group-hover:fill-[#00e5ff] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Location */}
            <div
              className="flex items-center gap-3 text-sm text-gray-600 mb-8"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
              {LOCATION} · {TIMEZONE}
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Contact Modal Overlay */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  )
}
