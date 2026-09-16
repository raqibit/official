// ─────────────────────────────────────────────────────────────────────────────
// About page data — timeline & skill proficiency bars
// ─────────────────────────────────────────────────────────────────────────────
// Extracted from AboutContent.tsx so the component stays lean and data is
// easy to update without touching rendering logic.

/** A milestone in the professional timeline */
export type TimelineEntry = {
  year: string
  title: string
  desc: string
}

/** A skill proficiency bar */
export type SkillBar = {
  name: string
  /** Proficiency percentage (0–100) */
  level: number
  /** Accent colour for the filled bar */
  color: string
}

export const timeline: TimelineEntry[] = [
  {
    year: '2017',
    title: 'Hardware Repair Technician',
    desc: 'Entered the world of precision electronics; began iPhone and Android board-level repair.',
  },
  {
    year: '2019',
    title: 'Started Programming',
    desc: 'Began exploring software development, writing basic scripts and learning algorithms.',
  },
  {
    year: '2020',
    title: 'Frontend Engineering',
    desc: 'Pivoted into web development; first shipped production React applications.',
  },
  {
    year: '2022',
    title: 'Visual Design & UI/UX',
    desc: 'Blended engineering with aesthetics — began crafting premium UI systems from scratch.',
  },
  {
    year: '2024',
    title: 'Full-Stack & Systems',
    desc: 'Integrated AI, databases, and scalable architectures into production-grade applications.',
  },
  {
    year: '2025',
    title: 'Prime Studio',
    desc: 'Launched Prime — a portfolio showcasing top-tier software engineering and design.',
  },
]

export const skills: SkillBar[] = [
  { name: 'React / Next.js', level: 99, color: '#00e5ff' },
  { name: 'Node.js / Express', level: 95, color: '#7c3aed' },
  { name: 'MongoDB / Supabase', level: 90, color: '#00e5ff' },
  { name: 'Microsoldering', level: 95, color: '#f59e0b' },
  { name: 'Visual Design', level: 92, color: '#7c3aed' },
  { name: 'Prompt Engineering', level: 88, color: '#00e5ff' },
]
