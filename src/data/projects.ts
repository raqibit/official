// ─────────────────────────────────────────────────────────────────────────────
// Static Projects Data
// To add/edit a project, update this file directly.
// ─────────────────────────────────────────────────────────────────────────────

export type Project = {
  id: string
  name: string
  tagline: string
  about: string
  videoUrl: string
  images: string[]
  liveUrl: string
  githubUrl: string
  techStack: string[]
  review: string
  price: number
  accentColor: string
}

export const PROJECTS: Project[] = [
  {
    id: 'prime-portfolio',
    name: 'Prime Portfolio',
    tagline: 'A top-tier, cinematic personal portfolio built with Next.js and Framer Motion.',
    about:
      'Prime is my personal portfolio showcasing software engineering, visual design, and microsoldering expertise. Built with Next.js App Router, Framer Motion, and a fully custom design system — featuring spotlight effects, animated typography, and a cinematic dark aesthetic.',
    videoUrl: '',
    images: [],
    liveUrl: 'https://prime3it.vercel.app',
    githubUrl: 'https://github.com/rq-ismail/prime',
    techStack: ['Next.js', 'TypeScript', 'Framer Motion', 'TailwindCSS', 'Prisma'],
    review: '',
    price: 3500,
    accentColor: '#00e5ff',
  },
  {
    id: 'microsoldering-lab',
    name: 'Microsoldering Lab',
    tagline: 'Advanced iPhone & MacBook logic board repair and NAND data recovery service.',
    about:
      'A professional microsoldering laboratory offering component-level repair for iPhones, MacBooks, and Android devices. Specializing in BGA reballing, water damage recovery, and NAND flash data extraction using trinocular microscopes and hot air rework stations.',
    videoUrl: '',
    images: [],
    liveUrl: '',
    githubUrl: '',
    techStack: ['Microsoldering', 'BGA Reballing', 'NAND Recovery', 'Schematic Reading'],
    review: 'Roqeeb recovered data from my completely water-damaged MacBook when Apple said it was impossible. Absolute wizard with a soldering iron.',
    price: 2500,
    accentColor: '#f59e0b',
  },
  {
    id: 'nexter',
    name: 'Nexter',
    tagline: 'A luxury real estate landing page — your home, your freedom.',
    about:
      'Nexter is a premium real estate web experience built entirely with CSS Grid and vanilla HTML/CSS. The layout features a cinematic dark hero, a curated property gallery, top realtor profiles, and a stunning 14-image CSS Grid gallery section — all demonstrating advanced CSS layout mastery without a single line of JavaScript framework code.\n\nKey sections include a full-bleed hero with media logo strip (BBC, Forbes, TechCrunch, Business Insider), six featured luxury property cards spanning USA, Canada, UK, Portugal, Germany, and Italy, a testimonial story section with overlapping image composition, and a dense 14-image masonry-style gallery. The entire layout is powered by a carefully architected CSS Grid system.',
    videoUrl: '',
    images: [
      'https://nexter.netlify.app/img/gal-1.jpeg',
      'https://nexter.netlify.app/img/gal-2.jpeg',
      'https://nexter.netlify.app/img/house-1.jpeg',
      'https://nexter.netlify.app/img/house-2.jpeg',
      'https://nexter.netlify.app/img/story-2.jpeg',
    ],
    liveUrl: 'https://nexter.netlify.app/',
    githubUrl: '',
    techStack: ['HTML5', 'CSS Grid', 'Sass/SCSS', 'Responsive Design', 'BEM Methodology'],
    review: '',
    price: 1500,
    accentColor: '#c69963',
  },
]
