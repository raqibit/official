import Link from 'next/link'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/layout/SocialIcons'
import { ContainerOuter, ContainerInner } from '@/components/layout/Container'

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
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-800 pb-16 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              {/* Copyright */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-zinc-400">
                  &copy; {new Date().getFullYear()} Roqeeb Ismail. All rights reserved.
                </p>
                <p className="text-xs text-zinc-600 font-mono">
                  Software · Design · Hardware
                </p>
              </div>

              {/* Nav links */}
              <nav className="flex flex-wrap justify-center gap-6">
                {pageLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Social icons */}
              <div className="flex gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-[#00e5ff]/40 hover:bg-[#00e5ff]/5 transition-all"
                  >
                    <Icon className="h-4 w-4 fill-zinc-500 group-hover:fill-[#00e5ff] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
