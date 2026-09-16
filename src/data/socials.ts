// ─────────────────────────────────────────────────────────────────────────────
// Social link data — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
// Imported by HeroSection, ContactSection, Footer, and AboutContent so that
// any URL or label change propagates everywhere automatically.

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/layout/SocialIcons'

/** Shape of a social link entry */
export type SocialLink = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  /** Optional accent colour override (defaults to brand cyan) */
  color?: string
}

/** All social profiles in display order */
export const socialLinks: SocialLink[] = [
  {
    href: 'https://x.com/prime3it',
    icon: XIcon,
    label: 'X / Twitter',
    color: '#7c3aed',
  },
  {
    href: 'https://instagram.com/rq_ismail',
    icon: InstagramIcon,
    label: 'Instagram',
    color: '#7c3aed',
  },
  {
    href: 'https://github.com/rq-ismail',
    icon: GitHubIcon,
    label: 'GitHub',
    color: '#00e5ff',
  },
  {
    href: 'https://linkedin.com/in/roqeebismail',
    icon: LinkedInIcon,
    label: 'LinkedIn',
    color: '#00e5ff',
  },
]
