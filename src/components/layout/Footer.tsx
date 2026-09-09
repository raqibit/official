import Link from 'next/link'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/layout/SocialIcons'

const pageLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/uses', label: 'Uses' },
]

const socialLinks = [
  { href: 'https://x.com/prime3it', icon: XIcon, label: 'X' },
  { href: 'https://instagram.com/rq_ismail', icon: InstagramIcon, label: 'Instagram' },
  { href: 'https://github.com/rq-ismail', icon: GitHubIcon, label: 'GitHub' },
  { href: 'https://linkedin.com/in/roqeebismail', icon: LinkedInIcon, label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="relative mt-auto flex-none border-t border-white/[0.04] bg-[#080808]">
      {/* Subtle top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,229,255,0.12), transparent)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20 py-12">

        {/* Top row: brand + nav + socials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-1">
            <span
              className="text-white font-bold tracking-tight text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Roqeeb Ismail
            </span>
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-700"
            >
              Software · Design · Hardware
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {pageLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-gray-600 hover:text-white transition-colors duration-300 tracking-wide"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-2.5">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.06] hover:border-[#00e5ff]/40 hover:bg-[#00e5ff]/5 transition-all duration-300"
              >
                <Icon className="h-3.5 w-3.5 fill-gray-600 group-hover:fill-[#00e5ff] transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.04] mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p
            className="text-[11px] text-gray-700 font-mono tracking-wide"
          >
            &copy; 2025 Roqeeb Ismail. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
            <span
              className="text-[11px] text-gray-700 font-mono tracking-wide"
            >
              Lagos, Nigeria · UTC+1
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}
