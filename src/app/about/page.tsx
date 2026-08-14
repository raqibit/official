import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/layout/SocialIcons'

const portraitImage = '/images/portrait.jpg'

export const metadata: Metadata = {
  title: 'About',
  description:
    'I am Roqeeb Ismail. I live in Lagos, Nigeria, where I build software and design visuals.',
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

const timeline = [
  { year: '2019', title: 'Started Microsoldering', desc: 'Began repairing logic boards, learning schematics and board-level diagnostics.' },
  { year: '2020', title: 'Frontend Engineering', desc: 'Pivoted into web development; first shipped production React applications.' },
  { year: '2022', title: 'Visual Design', desc: 'Blended engineering with aesthetics — began crafting premium UI systems from scratch.' },
  { year: '2024', title: 'Full-Stack & AI', desc: 'Integrated AI, databases, and serverless APIs into production-grade Next.js applications.' },
  { year: '2025', title: 'Prime Studio', desc: 'Launched Prime — a multi-discipline portfolio merging software, hardware, and design.' },
]

const skills = [
  { name: 'React / Next.js', level: 92, color: '#00e5ff' },
  { name: 'TypeScript', level: 87, color: '#00e5ff' },
  { name: 'Microsoldering', level: 95, color: '#f59e0b' },
  { name: 'Three.js / WebGL', level: 74, color: '#7c3aed' },
  { name: 'Visual Design', level: 85, color: '#7c3aed' },
  { name: 'Prisma / PostgreSQL', level: 80, color: '#00e5ff' },
]

const socials = [
  { href: 'https://x.com/prime3it', icon: XIcon, label: 'X / Twitter', handle: '@prime3it' },
  { href: 'https://instagram.com/rq_ismail', icon: InstagramIcon, label: 'Instagram', handle: '@rq_ismail' },
  { href: 'https://github.com/rq-ismail', icon: GitHubIcon, label: 'GitHub', handle: 'rq-ismail' },
  { href: 'https://linkedin.com/in/roqeebismail', icon: LinkedInIcon, label: 'LinkedIn', handle: 'roqeebismail' },
]

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32 pb-24 sm:pb-32">
      <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-16">

        {/* ── LEFT COL ── */}
        <div className="lg:order-first">
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-px w-8 bg-[#00e5ff]" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">About Me</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
            Building software,<br />
            <span className="text-[#00e5ff]">repairing silicon.</span>
          </h1>

          <div className="space-y-5 text-[15px] text-gray-400 leading-relaxed mb-12">
            <p>
              I&apos;m a Lagos-based software engineer with a rare triple expertise: frontend development,
              visual design, and professional-grade microsoldering. While most engineers live only
              in the digital realm, I also work at the physical layer — diagnosing and repairing
              logic boards at the component level under a trinocular microscope.
            </p>
            <p>
              This dual perspective shapes everything I build. I understand technology from
              transistors to user interfaces, and I apply that depth to every project I touch.
              My software is robust under the hood and visually striking on the surface.
            </p>
            <p>
              When I&apos;m not writing code or soldering chips, I&apos;m obsessing over typography,
              animation timing, and the micro-interactions that make a great product feel alive.
            </p>
          </div>

          {/* Skill Bars */}
          <div className="mb-12">
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Proficiency</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-300 font-mono">{skill.name}</span>
                    <span className="text-xs text-gray-600 font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-px w-full bg-[rgba(255,255,255,0.05)]">
                    <div
                      className="h-full"
                      style={{ width: `${skill.level}%`, background: skill.color, boxShadow: `0 0 8px ${skill.color}80` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-5">Find Me Online</h2>
            <ul className="space-y-3">
              {socials.map(({ href, icon: Icon, label, handle }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] group-hover:border-[#00e5ff] group-hover:bg-[#00e5ff]/10 transition-all">
                      <Icon className="h-4 w-4 fill-gray-500 group-hover:fill-[#00e5ff] transition-colors" />
                    </span>
                    <span>{label} <span className="text-gray-600 ml-1">{handle}</span></span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 mt-2 border-t border-[rgba(255,255,255,0.05)]">
                <Link
                  href="mailto:rq.ismaeel@gmail.com"
                  className="group flex items-center gap-4 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] group-hover:border-[#00e5ff] group-hover:bg-[#00e5ff]/10 transition-all">
                    <MailIcon className="h-4 w-4 fill-gray-500 group-hover:fill-[#00e5ff] transition-colors" />
                  </span>
                  <span>Email <span className="text-gray-600 ml-1">rq.ismaeel@gmail.com</span></span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── RIGHT COL ── */}
        <div className="space-y-12">
          {/* Portrait with glow */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#00e5ff]/10 to-[#7c3aed]/10 blur-2xl pointer-events-none" />
            <Image
              src={portraitImage}
              alt="Roqeeb Ismail"
              width={800}
              height={800}
              sizes="(min-width: 1024px) 32rem, 100vw"
              className="relative aspect-square rounded-2xl object-cover ring-1 ring-[rgba(255,255,255,0.08)]"
            />
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-gray-500 mb-8">Timeline</h2>
            <div className="relative">
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="mt-1 w-3.5 h-3.5 rounded-full border-2 border-[#00e5ff] bg-[#0a0a0a] shrink-0 relative z-10" />
                    <div>
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-mono text-xs text-[#00e5ff]">{item.year}</span>
                        <span className="font-semibold text-white text-sm">{item.title}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Container>
  )
}
