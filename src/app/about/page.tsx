import { type Metadata } from 'next'
import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description:
    'I am Raqīb Ismāʿīl — a Lagos-based software engineer, microsoldering specialist, and visual designer. I operate at the intersection of AI-driven development, pixel-perfect UI, and hardware diagnostics.',
  openGraph: {
    title: 'About — Raqīb Ismāʿīl',
    description:
      'Lagos-based software engineer, microsoldering specialist, and visual designer. AI-driven development meets pixel-perfect UI.',
  },
  twitter: {
    title: 'About — Raqīb Ismāʿīl',
    description:
      'Lagos-based software engineer, microsoldering specialist, and visual designer.',
  },
}

export default function About() {
  return <AboutContent />
}
