import { type Metadata } from 'next'
import { UsesContent } from './UsesContent'

export const metadata: Metadata = {
  title: 'Uses',
  description:
    'The tools, hardware, and software I depend on to build, design, and repair things — from my M3 MacBook Pro to Figma, Warp, and Raycast.',
  openGraph: {
    title: 'Uses — Raqīb Ismāʿīl',
    description:
      'Gear list: M3 MacBook Pro, Figma, VS Code, Warp Terminal, and the tools that power the workflow.',
  },
  twitter: {
    title: 'Uses — Raqīb Ismāʿīl',
    description:
      'Gear list: M3 MacBook Pro, Figma, VS Code, Warp Terminal, and the tools that power the workflow.',
  },
}

export default function Uses() {
  return <UsesContent />
}
