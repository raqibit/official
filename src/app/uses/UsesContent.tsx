'use client'

import { motion, type Variants } from 'framer-motion'
import { Container } from '@/components/layout/Container'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

type ToolProps = {
  title: string
  href?: string
  children: React.ReactNode
}

function Tool({ title, href, children }: ToolProps) {
  return (
    <motion.li 
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
      } as Variants}
      className="group relative flex flex-col sm:flex-row gap-6 py-10 border-b border-[rgba(255,255,255,0.05)] last:border-0"
    >
      <div className="flex-1">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-2 text-white hover:text-[#00e5ff] transition-colors"
          >
            <span className="font-semibold text-lg" style={{ fontFamily: 'var(--font-sans)' }}>{title}</span>
            <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        ) : (
          <h3 className="font-semibold text-white text-lg" style={{ fontFamily: 'var(--font-sans)' }}>{title}</h3>
        )}
        <p className="mt-4 text-[15px] text-gray-500 leading-[1.7] max-w-2xl" style={{ fontFamily: 'var(--font-sans)' }}>{children}</p>
      </div>
    </motion.li>
  )
}

const CATEGORIES = [
  {
    title: 'Workstation',
    tools: [
      {
        title: 'MacBook Pro 14-inch (M3, 2024)',
        href: 'https://www.apple.com/macbook-pro/',
        desc: 'My primary machine for development and design. The M3 chip handles compilation, Figma rendering, and Three.js scenes without breaking a sweat. 16 GB unified memory is plenty for my workflow.'
      },
      {
        title: 'LG 27UK850-W 4K Monitor',
        desc: 'A 27-inch 4K IPS panel with excellent color accuracy. Perfect for both design work and late-night debugging sessions where pixel-level detail matters.'
      },
      {
        title: 'Logitech MX Keys S',
        desc: 'Low-profile, tactile, and battery-efficient. The adaptive backlight and multi-device switching keep my desk clean. Pairs perfectly with the MX Master 3S mouse.'
      },
      {
        title: 'Logitech MX Master 3S',
        desc: 'The MagSpeed electromagnetic scroll wheel is genuinely life-changing for long code reviews and design files. Barely any effort to scroll through 3,000-line files.'
      },
      {
        title: 'AirPods Pro (2nd gen)',
        desc: 'Active noise cancellation while soldering, Transparency mode when someone walks in. The personalized spatial audio makes music actually sound good.'
      }
    ]
  },
  {
    title: 'Development',
    tools: [
      {
        title: 'Visual Studio Code',
        href: 'https://code.visualstudio.com/',
        desc: 'My primary editor. I use the One Dark Pro theme, JetBrains Mono font, and a minimal set of extensions — ESLint, Prettier, Tailwind IntelliSense, and GitLens.'
      },
      {
        title: 'Warp Terminal',
        href: 'https://www.warp.dev/',
        desc: 'A GPU-accelerated terminal with AI-powered command suggestions. The block-based output makes it far easier to navigate long build logs.'
      },
      {
        title: 'Next.js',
        href: 'https://nextjs.org/',
        desc: 'My framework of choice for everything from portfolios to full-stack applications. The App Router and Turbopack make the development experience feel instant.'
      },
      {
        title: 'Prisma ORM',
        href: 'https://www.prisma.io/',
        desc: 'The type-safe database toolkit that makes working with PostgreSQL feel like working with TypeScript objects. Schema migrations are painless and introspectable.'
      },
      {
        title: 'Framer Motion',
        href: 'https://www.framer.com/motion/',
        desc: 'The gold standard for React animations. Every micro-interaction on this site is powered by Framer Motion — from the hero entrance to the scroll-driven header.'
      },
      {
        title: 'Three.js / React Three Fiber',
        href: 'https://threejs.org/',
        desc: 'For the interactive 3D scenes. React Three Fiber makes it feel like writing React components instead of low-level WebGL calls.'
      },
      {
        title: 'Vercel',
        href: 'https://vercel.com/',
        desc: 'Zero-config deployments, edge functions, and built-in analytics. If it\'s Next.js, it belongs on Vercel.'
      }
    ]
  },
  {
    title: 'Design',
    tools: [
      {
        title: 'Figma',
        href: 'https://www.figma.com/',
        desc: 'Everything from wireframes to production-ready component specs. The Variables system combined with my own design token library has streamlined handoff significantly.'
      },
      {
        title: 'Spline',
        href: 'https://spline.design/',
        desc: 'When I need to prototype 3D interactions without dropping into raw Three.js code. Export to React is clean enough to use in production prototypes.'
      },
      {
        title: 'Pixelmator Pro',
        desc: 'My go-to for image editing and photo retouching on macOS. Faster than Photoshop for 95% of tasks and native Apple Silicon performance.'
      },
      {
        title: 'Ray.so / Carbon',
        href: 'https://ray.so/',
        desc: 'For beautiful code screenshots. I use these constantly for social posts and design documentation.'
      }
    ]
  },
  {
    title: 'Productivity',
    tools: [
      {
        title: 'Notion',
        href: 'https://notion.so/',
        desc: 'My second brain. Client repair logs, project specs, code snippets, reading notes — everything lives in Notion. The database views are genuinely powerful.'
      },
      {
        title: 'Linear',
        href: 'https://linear.app/',
        desc: 'Issue tracking for software projects. The keyboard-centric design and speed make it the only project management tool I actually enjoy using.'
      },
      {
        title: 'Raycast',
        href: 'https://raycast.com/',
        desc: 'A supercharged Spotlight replacement. Custom scripts, clipboard history, window management, and AI commands all in one ⌘Space shortcut.'
      }
    ]
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }
}

export function UsesContent() {
  return (
    <Container className="mt-20 sm:mt-32 pb-24 sm:pb-32 overflow-hidden">
      
      {/* ── Page Header ── */}
      <motion.div 
        variants={headerVariants}
        initial="hidden"
        animate="show"
        className="max-w-2xl mb-24 lg:mb-32"
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="block h-px w-8 bg-gray-700" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
            My Gear
          </span>
        </div>
        
        <h1 
          className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-8 leading-[1.1]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Tools I use to build<br />
          <span className="italic font-normal text-gray-500" style={{ fontFamily: 'var(--font-display)' }}>
            things
          </span> that matter.
        </h1>
        
        <p className="text-[15px] text-gray-500 leading-[1.7]" style={{ fontFamily: 'var(--font-sans)' }}>
          I get asked a lot about the tools I use to build software, architect systems, and design interfaces.
          Here is a comprehensive list of everything I rely on — from my main machine to the development environments
          and services that power my daily workflows.
        </p>
      </motion.div>

      {/* ── Two-Column Tool Categories ── */}
      <div className="space-y-32">
        {CATEGORIES.map((category) => (
          <section key={category.title} className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 items-start">
            
            {/* Sticky Section Header */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 lg:sticky lg:top-32"
            >
              <h2 
                className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-700"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {category.title}
              </h2>
              <div className="hidden lg:block h-px w-full bg-[rgba(255,255,255,0.03)] mt-6" />
            </motion.div>

            {/* List of Tools */}
            <div className="lg:col-span-8 lg:col-start-5">
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col"
              >
                {category.tools.map((tool) => (
                  <Tool key={tool.title} title={tool.title} href={tool.href}>
                    {tool.desc}
                  </Tool>
                ))}
              </motion.ul>
            </div>
          </section>
        ))}
      </div>

    </Container>
  )
}
