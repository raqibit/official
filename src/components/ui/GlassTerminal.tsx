'use client'

/**
 * GlassTerminal
 * ─────────────────────────────────────────────────────────────────────────────
 * A glass-morphic OS-style code terminal used in the Hero right column.
 *
 * Features:
 *  • 3-panel layout: file tabs | animated code | git-log sidebar
 *  • Character-by-character typewriter animation per scene
 *  • Blinking cursor + syntax-highlighted tokens
 *  • Live fake git-log panel (right side)
 *  • VS Code–style cyan status bar (bottom)
 *  • macOS-style traffic lights + title bar (top)
 *  • Spring-physics 3D tilt on mouse move (GPU-composited via will-change)
 *  • Click file tabs to jump scenes instantly
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CODE_SCENES } from '@/data/codeScenes'

// ── Git log entries ────────────────────────────────────────────────────────────
// Fake but realistic commit history shown in the right panel.
const GIT_LOG = [
  { hash: 'a3f1c9e', msg: 'feat: add GlassTerminal widget', color: '#00e5ff' },
  { hash: 'b82d4f1', msg: 'fix: scroll reveal on mobile', color: '#10b981' },
  { hash: 'c91e3a7', msg: 'perf: lazy load studio photo', color: '#10b981' },
  { hash: 'd04b2c8', msg: 'refactor: extract code scenes', color: '#7c3aed' },
  { hash: 'e15f9d2', msg: 'style: amber duotone blend', color: '#f59e0b' },
  { hash: 'f26a0b3', msg: 'chore: delete 14 dead files', color: '#6b7280' },
  { hash: '037c1e4', msg: 'feat: BookQuote + Newsletter', color: '#00e5ff' },
]

// ── Glass panel primitive ──────────────────────────────────────────────────────
function GlassPanel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden ${className}`}
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtle glass highlight at top */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent" />
      {children}
    </div>
  )
}

// ── Traffic light dots (macOS chrome) ─────────────────────────────────────────
function TrafficLights() {
  return (
    <div className="flex gap-1.5 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
    </div>
  )
}

// ── Animated typewriter code panel ────────────────────────────────────────────
function CodePanel({ sceneIdx }: { sceneIdx: number }) {
  const scene = CODE_SCENES[sceneIdx]
  const totalChars = scene.tokens.reduce((a, t) => a + t.text.length, 0)
  const [typedChars, setTypedChars] = useState(0)
  const isTypingRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Reset and restart typing animation when scene changes
    isTypingRef.current = false
    if (timerRef.current) clearTimeout(timerRef.current)
    setTypedChars(0)
    isTypingRef.current = true
    let current = 0

    const type = () => {
      if (!isTypingRef.current) return
      if (current < totalChars) {
        current++
        setTypedChars(current)
        // Slight random delay variation + occasional pause for realism
        const delay = Math.random() * 20 + 6 + (Math.random() < 0.04 ? 100 : 0)
        timerRef.current = setTimeout(type, delay)
      }
    }

    timerRef.current = setTimeout(type, 200)
    return () => {
      isTypingRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [sceneIdx, totalChars])

  // Slice the token stream to `typedChars` characters
  let remaining = typedChars
  const rendered: { text: string; color: string; id: number }[] = []
  for (let i = 0; i < scene.tokens.length; i++) {
    if (remaining <= 0) break
    const tok = scene.tokens[i]
    if (remaining >= tok.text.length) {
      rendered.push({ ...tok, id: i })
      remaining -= tok.text.length
    } else {
      rendered.push({ text: tok.text.slice(0, remaining), color: tok.color, id: i })
      break
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Line numbers */}
      <div
        className="select-none shrink-0 px-3 py-5 text-right border-r border-white/[0.04]"
        aria-hidden
      >
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} className="font-mono text-[10px] text-zinc-700 leading-[1.65rem]">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code area */}
      <div className="flex-1 px-4 py-5 overflow-auto scrollbar-hide">
        <pre
          className="font-mono text-[11px] leading-[1.65rem] whitespace-pre-wrap break-words"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <code>
            {rendered.map((tok) => (
              <span key={tok.id} className={tok.color}>
                {tok.text}
              </span>
            ))}
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-[2px] h-[13px] ml-px align-middle bg-[#00e5ff]"
            />
          </code>
        </pre>
      </div>
    </div>
  )
}

// ── Git log sidebar ────────────────────────────────────────────────────────────
function GitLogPanel() {
  return (
    <div className="w-[155px] border-l border-white/[0.05] flex flex-col shrink-0">
      <div className="px-3 py-2 border-b border-white/[0.04]">
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          git log
        </span>
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-auto scrollbar-hide">
        {GIT_LOG.map((commit) => (
          <div key={commit.hash} className="flex flex-col gap-0.5">
            <span className="font-mono text-[8px] text-zinc-700">{commit.hash}</span>
            <span
              className="font-mono text-[9px] leading-tight"
              style={{ color: commit.color, opacity: 0.7 }}
            >
              {commit.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main GlassTerminal component ──────────────────────────────────────────────
export function GlassTerminal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sceneIdx, setSceneIdx] = useState(0)

  // Spring-physics 3D tilt values — GPU-composited via will-change: transform
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [5, -5]), { stiffness: 80, damping: 22 })
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-5, 5]), { stiffness: 80, damping: 22 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        willChange: 'transform', // GPU compositing for buttery tilt
      }}
      className="relative w-full max-w-[600px] select-none"
    >
      {/* Ambient glow behind the terminal */}
      <div className="absolute -inset-6 bg-[#00e5ff] opacity-[0.025] rounded-3xl blur-3xl pointer-events-none" />

      <GlassPanel>
        {/* ── Title bar ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.05]">
          <TrafficLights />
          <span className="flex-1 text-center font-mono text-[9px] text-zinc-600 tracking-widest truncate">
            PRIME WORKSPACE · {CODE_SCENES[sceneIdx].file}
          </span>
          {/* Live dot indicator */}
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse shrink-0" />
        </div>

        {/* ── File tabs ─────────────────────────────────────── */}
        <div className="flex border-b border-white/[0.05] bg-black/20">
          {CODE_SCENES.map((scene, i) => (
            <button
              key={scene.label}
              onClick={() => setSceneIdx(i)}
              className={`px-4 py-2 text-[9px] font-mono tracking-wider transition-all border-b-2 ${
                i === sceneIdx
                  ? 'text-[#00e5ff] border-[#00e5ff] bg-white/[0.03]'
                  : 'text-zinc-600 border-transparent hover:text-zinc-400 hover:bg-white/[0.02]'
              }`}
            >
              {scene.label}
            </button>
          ))}
        </div>

        {/* ── Code + Git log ────────────────────────────────── */}
        <div className="flex" style={{ height: 280 }}>
          <CodePanel sceneIdx={sceneIdx} />
          <GitLogPanel />
        </div>

        {/* ── VS Code–style status bar ──────────────────────── */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#00e5ff] text-black">
          <div className="flex items-center gap-3">
            {/* Branch indicator */}
            <span className="font-mono text-[8px] tracking-widest font-bold">
              ⎇ main
            </span>
            <span className="font-mono text-[8px] tracking-widest opacity-70">
              PRIME WORKSPACE
            </span>
          </div>
          <span className="font-mono text-[8px] tracking-widest">
            TypeScript · UTF-8 · ROQEEB ISMAIL
          </span>
        </div>
      </GlassPanel>
    </motion.div>
  )
}
