import { type Metadata } from 'next'
import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description:
    'I am Raqīb Ismāʿīl. I live in Lagos, Nigeria, where I build software and design visuals.',
}

export default function About() {
  return <AboutContent />
}
