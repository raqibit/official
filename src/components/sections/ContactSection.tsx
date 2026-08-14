'use client'

/**
 * ContactSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Two-column editorial contact layout:
 *  - Left: large heading, email CTA, resume download button
 *  - Right: social links list + location indicator
 */

import Link from 'next/link'
import { motion } from 'framer-motion'

export function ContactSection() {
  return (
    <section className="py-28 sm:py-36 bg-[#080808] relative overflow-hidden">

      {/* Subtle purple glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40vw] h-[50vh] bg-[#7c3aed] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left — Editorial */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="block h-px w-8 bg-gray-700" />
              <span
                className="font-mono text-xs tracking-[0.2em] uppercase text-gray-600"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Get in Touch
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl font-bold text-white leading-none mb-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Let's build
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
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500 leading-relaxed max-w-md mb-12"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Whether it's a complex web application, a critical hardware repair,
              or a design system — I bring precision and dedication to every
              project. Let's talk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-start gap-10"
            >
              <a
                href="mailto:rq.ismaeel@gmail.com"
                className="group inline-flex items-center gap-3 text-2xl font-bold text-white hover:text-[#00e5ff] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                rq.ismaeel@gmail.com
                <svg
                  className="h-6 w-6 transition-transform group-hover:translate-x-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <a
                href="/rq-ismail-resume.pdf"
                download="Roqeeb_Ismail_Resume.pdf"
                className="group inline-flex items-center justify-center gap-3 w-fit px-8 py-4 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/20 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.2)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span className="text-xs uppercase tracking-widest font-bold">Download Resume</span>
                <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Right — Info + Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
              <div className="flex flex-col gap-4">
                {[
                  { label: 'GitHub', handle: '@rq-ismail', href: 'https://github.com/rq-ismail', color: '#00e5ff' },
                  { label: 'LinkedIn', handle: '/in/roqeebismail', href: 'https://linkedin.com/in/roqeebismail', color: '#00e5ff' },
                  { label: 'X (Twitter)', handle: '@prime3it', href: 'https://x.com/prime3it', color: '#7c3aed' },
                  { label: 'Instagram', handle: '@rq_ismail', href: 'https://instagram.com/rq_ismail', color: '#7c3aed' },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-4 hover:border-[rgba(0,229,255,0.2)] transition-colors"
                  >
                    <span
                      className="text-xs uppercase tracking-widest text-gray-600"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {social.label}
                    </span>
                    <span
                      className="text-sm text-gray-400 group-hover:text-white transition-colors"
                      style={{ fontFamily: 'var(--font-mono)', color: social.color, opacity: 0.7 }}
                    >
                      {social.handle}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Location */}
            <div
              className="flex items-center gap-3 text-sm text-gray-600"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
              Lagos, Nigeria · UTC+1
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
