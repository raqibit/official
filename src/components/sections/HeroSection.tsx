'use client'

/**
 * HeroSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-viewport intro with staggered text animation and a desaturated image
 * mosaic on the right. Images reveal full colour on hover.
 *
 * Uses Next.js <Image> for automatic optimisation (WebP/AVIF, responsive
 * srcset, lazy loading). Social links imported from centralised data module.
 */

import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { socialLinks } from '@/data/socials'

// ── Animation variants ────────────────────────────────────────────────────────

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const imageVariant: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
}

// ── Social link button ────────────────────────────────────────────────────────

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
      className="group flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.07] hover:border-white/20 transition-colors duration-300"
    >
      <Icon className="h-3.5 w-3.5 fill-gray-600 transition group-hover:fill-white" />
    </Link>
  )
}

// ── Hero image card (DRY helper) ──────────────────────────────────────────────

function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative group overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={alt}
        width={176}
        height={264}
        className="aspect-[2/3] w-full bg-gray-900/5 object-cover opacity-50 grayscale mix-blend-luminosity group-hover:opacity-100 group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-700 ease-out"
        sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 176px"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.03]" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      {/* Subtle radial glow behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-32 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #00e5ff 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">

          {/* ── LEFT: Text content ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl flex flex-col gap-0"
          >
            <motion.div variants={item} className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-white/20" />
              <p className="text-xs text-gray-400 font-mono tracking-[0.2em] uppercase">
                Raqīb Ismāʿīl
              </p>
            </motion.div>

            <motion.header variants={item} className="mb-8">
              <h1 className="text-[clamp(3rem,7vw,5rem)] font-light leading-[1] tracking-tighter text-white">
                Software<br />
                &nbsp; Engineer<span className="text-[#00e5ff]">.</span>
              </h1>
            </motion.header>

            <motion.div variants={item} className="mb-12">
              <p className="text-lg text-gray-400 font-light leading-relaxed max-w-xl">
                Architecting resilient backend systems and building high-performance, 
                pixel-perfect interfaces for the modern web.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap items-center gap-6 mb-16">
              <Link
                href="/projects"
                data-cursor="VIEW"
                className="group inline-flex items-center gap-3 px-6 sm:px-8 py-4 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-black bg-white hover:bg-[#00e5ff] transition-all duration-500"
              >
                View My Work
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

              <a
                href="/rq-ismail-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="VIEW"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-4 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 border border-white/[0.05] hover:border-white/20 hover:text-white transition-all duration-500"
              >
                View CV
              </a>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-5">
              {socialLinks.map((social) => (
                <SocialLink
                  key={social.label}
                  href={social.href}
                  icon={social.icon}
                  label={social.label}
                />
              ))}
            </motion.div>

            {/* Stat card — years & projects */}
            <motion.div
              variants={item}
              className="mt-16 flex items-center gap-10"
            >
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-light text-white tracking-tighter">3+</div>
                <div className="text-[10px] tracking-[0.25em] text-gray-500 uppercase">Years Eng.</div>
              </div>
              <div className="h-10 w-px bg-white/[0.05]" />
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-light text-white tracking-tighter">40+</div>
                <div className="text-[10px] tracking-[0.25em] text-gray-500 uppercase">Features</div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Staggered Image Grid ── */}
          <motion.div
            variants={imageVariant}
            initial="hidden"
            animate="show"
            className="mt-14 hidden sm:flex justify-center gap-3 sm:-mt-44 sm:justify-start sm:gap-6 sm:pl-20 lg:mt-0 lg:pl-0 relative"
          >
            {/* Floating CV Link */}
            <div className="absolute -top-12 right-0 hidden lg:block">
              <a
                href="/rq-ismail-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 hover:text-white transition-colors"
              >
                View CV
                <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>

            <div className="w-24 sm:w-32 lg:w-44 flex-none space-y-4 sm:space-y-6 pt-16 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80">
              <HeroImage src="/images/hero_software.jpg" alt="Code editor showing a software project" />
            </div>
            <div className="w-24 sm:w-32 lg:w-44 flex-none space-y-4 sm:space-y-6 sm:pt-52 lg:pt-36">
              <HeroImage src="/images/hero_hardware.jpg" alt="Microsoldering station with microscope" />
              <HeroImage src="/images/hero_design.jpg" alt="Visual design work in progress" />
            </div>
            <div className="w-24 sm:w-32 lg:w-44 flex-none space-y-4 sm:space-y-6 pt-16 sm:pt-0">
              <HeroImage src="/images/hero_workspace.jpg" alt="Developer workspace with dual monitors" />
              <HeroImage src="/images/projects/motion-reel.jpg" alt="Motion design reel preview" />
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
