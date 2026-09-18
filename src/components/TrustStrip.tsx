import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'
import { business } from '../data/content'

const PX_PER_SECOND = 32

const items = [
  { label: 'Google', href: business.mapsUrl },
  { label: 'Yelp', href: business.social.yelp },
  { label: 'Facebook', href: business.social.facebook },
  { label: 'We Accept All Insurance Plans', badge: true },
  { label: 'Hablamos Español', badge: true },
]

/** Continuously drifting logo/trust-badge marquee — the grayscale brand row
 * that sits directly below the hero, matching the reference recording's
 * always-running strip (linear, independent of scroll). */
export default function TrustStrip() {
  const reduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [loopWidth, setLoopWidth] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    function measure() {
      if (trackRef.current) setLoopWidth(trackRef.current.scrollWidth / 2)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || paused.current || !loopWidth) return
    const next = x.get() - (PX_PER_SECOND * delta) / 1000
    x.set(next <= -loopWidth ? next + loopWidth : next)
  })

  const track = [...items, ...items]

  return (
    <section className="overflow-hidden border-y border-line/70 bg-cream-deep/50 py-6">
      <div
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        className="w-max"
      >
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-10 will-change-transform">
          {track.map((item, i) =>
            item.badge ? (
              <span
                key={`${item.label}-${i}`}
                className="whitespace-nowrap rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink-soft/80"
              >
                {item.label}
              </span>
            ) : (
              <a
                key={`${item.label}-${i}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap font-display text-lg font-bold text-ink-soft/70 grayscale transition-all hover:text-ink hover:grayscale-0"
              >
                {item.label}
              </a>
            ),
          )}
        </motion.div>
      </div>
    </section>
  )
}
