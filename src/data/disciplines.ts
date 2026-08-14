// ── Disciplines data ─────────────────────────────────────────────────────────
// Centralised so SkillsSection and any future summary cards stay in sync.

export type Discipline = {
  number: string
  title: string
  tagline: string
  color: string
  colorDim: string
  colorBorder: string
  skills: string[]
  desc: string
}

export const disciplines: Discipline[] = [
  {
    number: '01',
    title: 'Software Engineering',
    tagline: 'Interfaces that feel alive.',
    color: '#00e5ff',
    colorDim: 'rgba(0,229,255,0.08)',
    colorBorder: 'rgba(0,229,255,0.25)',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs', 'PostgreSQL', 'Prisma'],
    desc: 'I build high-performance web applications with pixel-perfect attention to motion and interaction design.',
  },
  {
    number: '02',
    title: 'Visual Design',
    tagline: 'Aesthetics with intent.',
    color: '#7c3aed',
    colorDim: 'rgba(124,58,237,0.08)',
    colorBorder: 'rgba(124,58,237,0.25)',
    skills: ['UI/UX Design', 'Typography', 'Color Theory', 'Motion Design', 'Branding', 'Figma'],
    desc: 'Design is never decoration. Every layout, color, and spacing choice carries meaning and guides the user.',
  },
  {
    number: '03',
    title: 'Microsoldering & Hardware',
    tagline: 'Precision at 400°C.',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.25)',
    skills: ['Board-Level Repair', 'Data Recovery', 'iPhone Logic Boards', 'MacBook Repair', 'BGA Reballing', 'Schematics'],
    desc: 'From dead logic boards to corrupted chips — I diagnose and repair hardware at the component level.',
  },
]
