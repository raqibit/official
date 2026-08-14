'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  const [label, setLabel] = useState('')
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) {
      setIsTouchDevice(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
      if (!isVisible) setIsVisible(true)
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)
    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    // Detect interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor], input, textarea, select')
      if (interactive) {
        const cursor = interactive.getAttribute('data-cursor') || ''
        setLabel(cursor)
        setIsHovering(true)
      } else {
        setIsHovering(false)
        setLabel('')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseover', onOver)
    }
  }, [mouseX, mouseY, isVisible])

  if (isTouchDevice) return null

  return (
    <>
      {/* Dot — tracks exactly */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ willChange: 'left, top' }}
      >
        <motion.div
          animate={{
            width: isHovering ? 6 : isClicking ? 3 : 5,
            height: isHovering ? 6 : isClicking ? 3 : 5,
            opacity: isVisible ? 1 : 0,
            backgroundColor: isHovering ? '#00e5ff' : '#fff',
          }}
          transition={{ duration: 0.12 }}
          className="rounded-full"
        />
      </div>

      {/* Ring — spring-lagged */}
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ left: ringX, top: ringY, willChange: 'transform' }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : isClicking ? 28 : 36,
            height: isHovering ? 56 : isClicking ? 28 : 36,
            opacity: isVisible ? 1 : 0,
            borderColor: isHovering ? 'rgba(0,229,255,0.6)' : 'rgba(255,255,255,0.25)',
            backgroundColor: isHovering ? 'rgba(0,229,255,0.06)' : 'transparent',
            boxShadow: isHovering ? '0 0 20px rgba(0,229,255,0.2)' : 'none',
          }}
          transition={{ type: 'spring', damping: 18, stiffness: 180 }}
          className="rounded-full border"
        >
          <AnimatePresence>
            {label && isHovering && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="absolute text-[8px] font-mono tracking-widest text-[#00e5ff] uppercase whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  )
}
