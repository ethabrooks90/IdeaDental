import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'

/** The small dashed circle + center dot that used to sit in the About section
 * now follows the pointer instead — a site-wide cursor ring, skipped on
 * touch devices and when the visitor prefers reduced motion. Tracks the raw
 * pointer position directly (no spring easing) so it snaps to the cursor
 * with zero perceptible lag instead of trailing behind it. */
export default function CustomCursor() {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    function onChange() {
      setEnabled(query.matches)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return
    function onMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled, x, y])

  if (!enabled || reduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-ink/60">
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
      </span>
    </motion.div>
  )
}
