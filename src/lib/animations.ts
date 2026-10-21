import { Variants } from 'framer-motion'

/**
 * Shared Easing Curves
 * ─────────────────────────────────────────────────────────────────────────────
 * A custom cubic bezier that provides a snappy, premium "Apple-like" feel.
 * Fast acceleration, smooth deceleration.
 */
export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Shared Framer Motion Variants
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const FADE_IN_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: EASE } 
  },
}

export const FADE_IN_SCALE: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.8, ease: EASE } 
  },
}

export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.1 
    },
  },
}
