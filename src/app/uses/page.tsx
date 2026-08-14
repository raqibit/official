import { type Metadata } from 'next'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Uses',
  description: 'The tools, hardware, and software I use to build, design, and repair things.',
}

type ToolProps = {
  title: string
  href?: string
  children: React.ReactNode
}

function Tool({ title, href, children }: ToolProps) {
  return (
    <li className="group relative flex gap-6 py-6 border-b border-zinc-800 last:border-0">
      {/* Left accent bar */}
      <div className="mt-1 shrink-0">
        <div className="h-full w-px bg-[#00e5ff]/20 group-hover:bg-[#00e5ff]/60 transition-colors" style={{ minHeight: '1rem' }} />
      </div>
      <div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#00e5ff] transition-colors text-sm"
          >
            {title}
            <svg className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <p className="font-semibold text-white text-sm">{title}</p>
        )}
        <p className="mt-1 text-sm text-zinc-500 leading-relaxed">{children}</p>
      </div>
    </li>
  )
}

type SectionProps = {
  title: string
  children: React.ReactNode
}

function ToolsSection({ title, children }: SectionProps) {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <span className="block h-px w-8 bg-[#00e5ff]" />
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">{title}</h2>
      </div>
      <ul className="divide-y divide-zinc-800 border-t border-zinc-800">{children}</ul>
    </section>
  )
}

export default function Uses() {
  return (
    <Container className="mt-16 sm:mt-32 pb-24 sm:pb-32">
      <div className="max-w-2xl">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="block h-px w-8 bg-[#00e5ff]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">My Gear</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Tools I use to build<br />
          <span className="text-[#00e5ff]">things that matter.</span>
        </h1>
        <p className="text-gray-400 text-[15px] leading-relaxed mb-20">
          I get asked a lot about the tools I use to build software, repair hardware, and design interfaces.
          Here is a comprehensive list of everything I rely on — from my main machine to the fine-tipped
          soldering iron on my desk.
        </p>

        <ToolsSection title="Workstation">
          <Tool title="MacBook Pro 14-inch (M3, 2024)" href="https://www.apple.com/macbook-pro/">
            My primary machine for development and design. The M3 chip handles compilation,
            Figma rendering, and Three.js scenes without breaking a sweat. 16 GB unified memory
            is plenty for my workflow.
          </Tool>
          <Tool title="LG 27UK850-W 4K Monitor">
            A 27-inch 4K IPS panel with excellent color accuracy. Perfect for both design work
            and late-night debugging sessions where pixel-level detail matters.
          </Tool>
          <Tool title="Logitech MX Keys S">
            Low-profile, tactile, and battery-efficient. The adaptive backlight and multi-device
            switching keep my desk clean. Pairs perfectly with the MX Master 3S mouse.
          </Tool>
          <Tool title="Logitech MX Master 3S">
            The MagSpeed electromagnetic scroll wheel is genuinely life-changing for long code
            reviews and design files. Barely any effort to scroll through 3,000-line files.
          </Tool>
          <Tool title="AirPods Pro (2nd gen)">
            Active noise cancellation while soldering, Transparency mode when someone walks in.
            The personalized spatial audio makes music actually sound good.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Development">
          <Tool title="Visual Studio Code" href="https://code.visualstudio.com/">
            My primary editor. I use the One Dark Pro theme, JetBrains Mono font, and a minimal
            set of extensions — ESLint, Prettier, Tailwind IntelliSense, and GitLens.
          </Tool>
          <Tool title="Warp Terminal" href="https://www.warp.dev/">
            A GPU-accelerated terminal with AI-powered command suggestions. The block-based output
            makes it far easier to navigate long build logs.
          </Tool>
          <Tool title="Next.js" href="https://nextjs.org/">
            My framework of choice for everything from portfolios to full-stack applications.
            The App Router and Turbopack make the development experience feel instant.
          </Tool>
          <Tool title="Prisma ORM" href="https://www.prisma.io/">
            The type-safe database toolkit that makes working with PostgreSQL feel like working
            with TypeScript objects. Schema migrations are painless and introspectable.
          </Tool>
          <Tool title="Framer Motion" href="https://www.framer.com/motion/">
            The gold standard for React animations. Every micro-interaction on this site is
            powered by Framer Motion — from the hero entrance to the scroll-driven header.
          </Tool>
          <Tool title="Three.js / React Three Fiber" href="https://threejs.org/">
            For the interactive 3D scenes. React Three Fiber makes it feel like writing React
            components instead of low-level WebGL calls.
          </Tool>
          <Tool title="Vercel" href="https://vercel.com/">
            Zero-config deployments, edge functions, and built-in analytics. If it&apos;s Next.js,
            it belongs on Vercel.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Design">
          <Tool title="Figma" href="https://www.figma.com/">
            Everything from wireframes to production-ready component specs. The Variables system
            combined with my own design token library has streamlined handoff significantly.
          </Tool>
          <Tool title="Spline" href="https://spline.design/">
            When I need to prototype 3D interactions without dropping into raw Three.js code.
            Export to React is clean enough to use in production prototypes.
          </Tool>
          <Tool title="Pixelmator Pro">
            My go-to for image editing and photo retouching on macOS. Faster than Photoshop
            for 95% of tasks and native Apple Silicon performance.
          </Tool>
          <Tool title="Ray.so / Carbon" href="https://ray.so/">
            For beautiful code screenshots. I use these constantly for social posts
            and design documentation.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Hardware & Microsoldering">
          <Tool title="QUICK 861DW Hot Air Station">
            A precision hot-air rework station for BGA chip removal and SMD component work.
            Temperature control is critical — a 10°C swing can mean the difference between
            a repaired board and a destroyed one.
          </Tool>
          <Tool title="JBC CD-2BB Soldering Station">
            The JBC stations are industry-standard for a reason. Instant heat recovery means
            the tip temperature stays stable even on thermal-heavy ground pads.
          </Tool>
          <Tool title="Trinocular Stereo Microscope (7–45×)">
            You cannot do chip-level rework without proper magnification. I work at 20–30×
            for most SMD work and push to 45× for chip-scale packages and BGA inspection.
          </Tool>
          <Tool title="Fluke 87V Multimeter" href="https://www.fluke.com/">
            The most reliable DMM I have ever owned. Used daily for continuity checks,
            diode-mode fault finding, and voltage mapping on logic boards.
          </Tool>
          <Tool title="FNIRSI DSO-TC3 Oscilloscope">
            A compact but capable scope for checking clock signals, PMIC rails, and data bus
            activity on mobile logic boards during fault diagnosis.
          </Tool>
          <Tool title="Isopropyl Alcohol (99%) + Ultrasonic Cleaner">
            Every board that comes through the studio gets cleaned. The ultrasonic cleaner
            removes flux residue from tight BGA underfills that isopropyl alone can&apos;t reach.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Productivity">
          <Tool title="Notion" href="https://notion.so/">
            My second brain. Client repair logs, project specs, code snippets, reading notes —
            everything lives in Notion. The database views are genuinely powerful.
          </Tool>
          <Tool title="Linear" href="https://linear.app/">
            Issue tracking for software projects. The keyboard-centric design and speed make
            it the only project management tool I actually enjoy using.
          </Tool>
          <Tool title="Raycast" href="https://raycast.com/">
            A supercharged Spotlight replacement. Custom scripts, clipboard history, window
            management, and AI commands all in one ⌘Space shortcut.
          </Tool>
        </ToolsSection>
      </div>
    </Container>
  )
}
