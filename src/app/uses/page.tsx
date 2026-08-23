import { type Metadata } from 'next'
import { UsesContent } from './UsesContent'

export const metadata: Metadata = {
  title: 'Uses | Roqeeb Ismail',
  description: 'The tools, hardware, and software I use to build, design, and repair things.',
}

export default function Uses() {
  return <UsesContent />
}
