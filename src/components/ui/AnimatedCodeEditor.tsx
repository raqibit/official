'use client'

/**
 * AnimatedCodeEditor
 * ─────────────────────────────────────────────────────────────────────────────
 * Standalone typewriter-style code editor widget.
 * Used as the "Code" mode in the HeroSection toggle.
 * Scenes are sourced from @/data/codeScenes for DRY sharing with GlassTerminal.
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CODE_SCENES } from '@/data/codeScenes'

export function AnimatedCodeEditor() {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [typedChars, setTypedChars] = useState(0)
  const isTypingRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scene = CODE_SCENES[sceneIdx]
  const totalChars = scene.tokens.reduce((a, t) => a + t.text.length, 0)

  useEffect(() => {
    // Reset typing state on scene change
    isTypingRef.current = false
    if (timerRef.current) clearTimeout(timerRef.current)
    isTypingRef.current = true
    setTypedChars(0)
    let current = 0

    const type = () => {
      if (!isTypingRef.current) return
      if (current < totalChars) {
        current++
        setTypedChars(current)
        const delay = Math.random() * 25 + 8 + (Math.random() < 0.04 ? 120 : 0)
        timerRef.current = setTimeout(type, delay)
      } else {
        // Auto-advance to next scene after a pause
        timerRef.current = setTimeout(() => {
          if (!isTypingRef.current) return
          setSceneIdx((i) => (i + 1) % CODE_SCENES.length)
        }, 3000)
      }
    }

    timerRef.current = setTimeout(type, 400)
    return () => {
      isTypingRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [sceneIdx, totalChars])

  // Slice token stream to typed character count
  let remaining = typedChars
  const renderedTokens: { text: string; color: string; id: number }[] = []
  for (let i = 0; i < scene.tokens.length; i++) {
    if (remaining <= 0) break
    const tok = scene.tokens[i]
    if (remaining >= tok.text.length) {
      renderedTokens.push({ ...tok, id: i })
      remaining -= tok.text.length
    } else {
      renderedTokens.push({ text: tok.text.slice(0, remaining), color: tok.color, id: i })
      remaining = 0
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-xl bg-[#0d1117] border border-white/[0.08] shadow-2xl"
    >
      {/* ── Title bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-white/[0.05]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 text-center font-mono text-[10px] text-gray-500 tracking-wider truncate px-4">
          {scene.file}
        </div>
      </div>

      {/* ── Scene tabs ────────────────────────────────────────────────── */}
      <div className="flex border-b border-white/[0.05] bg-[#161b22]">
        {CODE_SCENES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setSceneIdx(i)}
            className={`px-4 py-2 text-[10px] font-mono tracking-wider transition-colors ${
              i === sceneIdx
                ? 'text-[#00e5ff] border-b border-[#00e5ff] bg-[#0d1117]'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Code view ─────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto">
        {/* Line numbers */}
        <div className="select-none px-4 py-6 text-right shrink-0" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="font-mono text-xs text-gray-700 leading-relaxed">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code area */}
        <div className="flex-1 px-4 py-6 overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.pre
              key={sceneIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs sm:text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <code>
                {renderedTokens.map((tok) => (
                  <span key={tok.id} className={tok.color}>
                    {tok.text}
                  </span>
                ))}
                {/* Blinking cursor */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-[2px] h-[14px] ml-0.5 align-middle bg-[#00e5ff]"
                />
              </code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Status bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#00e5ff] text-black text-[9px] font-mono tracking-widest">
        <span>PRIME WORKSPACE · ROQEEB ISMAIL</span>
        <span>TypeScript · UTF-8</span>
      </div>
    </motion.div>
  )
}
