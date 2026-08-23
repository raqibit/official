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
    tagline: 'Modern, scalable web development.',
    color: '#00e5ff',
    colorDim: 'rgba(0,229,255,0.08)',
    colorBorder: 'rgba(0,229,255,0.25)',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Prompt Engineering', 'LLM Integration', 'Agentic AI / RAG', 'Architecture'],
    desc: 'I build high-performance, full-stack web applications using the modern ecosystem. By synthesizing traditional engineering with AI thread skills — like prompt engineering and agentic workflows — I create intelligent, scalable solutions.',
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
    tagline: 'Precision under the scope.',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.25)',
    skills: ['Logic Board Repair', 'Data Recovery', 'BGA Reballing', 'Schematic Reading', 'Trace Repair', 'Troubleshooting'],
    desc: 'Beyond code, I repair complex logic board faults at the component level on iPhones and MacBooks, requiring extreme precision.',
  },
]
