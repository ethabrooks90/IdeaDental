import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { business } from '../data/content'
import { HERO_EXPAND_END, HERO_SETTLED, HERO_UNPIN_FRACTION } from '../lib/hero'
import heroBg from '../assets/images/hero-bg.jpg'
import teethZoom from '../assets/images/hero-teeth-zoom.jpg'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Linearly maps `p` from [inMin, inMax] to [outMin, outMax], clamped at both ends. */
function lerp(p: number, [inMin, inMax]: [number, number], [outMin, outMax]: [number, number]) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

function HeroMedia({
  clipPath,
  imageX,
  imageY,
  blur = 0,
}: {
  clipPath: string
  imageX: ReturnType<typeof useTransform<number, number>> | number
  imageY: ReturnType<typeof useTransform<number, number>> | number
  blur?: number
}) {
  return (
    <div style={{ clipPath }} className="absolute inset-0">
      <motion.img
        style={{
          x: imageX,
          y: imageY,
          filter: `blur(${blur}px)`,
        }}
        src={heroBg}
        alt="A patient smiling during a dental exam"
        className="absolute inset-0 h-full w-full scale-110 object-cover object-[52%_45%] sm:object-[82%_48%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/25 to-forest/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/20 to-transparent" />
    </div>
  )
}

function HeroContent({ contentOpacity, contentY }: { contentOpacity: number; contentY: number }) {
  return (
    <div style={{ opacity: contentOpacity, transform: `translateY(${contentY}px)` }} className="max-w-xl">
      {/* Client-approved copy (Ihna). */}
      <h1 className="font-display text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-cream sm:text-6xl lg:text-[3.4rem]">
        Dentist &amp; Orthodontist in Houston, TX
      </h1>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/75">
        Idea Dental provides general, cosmetic, preventive, emergency, and orthodontic care for
        patients of all ages at our Houston dental office.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <a
          href="#contact"
          className="rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-sapphire hover:text-cream"
        >
          Request an Appointment
        </a>
        <a
          href="#services"
          className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-cream/70"
        >
          Explore Services
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-cream/70">
        <span className="font-display font-semibold text-cream">Hablamos Español</span>
        <span className="h-1 w-1 rounded-full bg-cream/40" />
        <span>We accept all insurance plans</span>
      </div>
    </div>
  )
}

/** Scroll-driven variant: a small, wordmark-topped card is pinned in place and
 * grows into the full-bleed hero image as the visitor scrolls past it.
 *
 * Driven by a single `progress` number (0-1) read off scrollYProgress and
 * turned into plain interpolated values in render — deliberately not a chain
 * of independent useTransform() calls, several of which were found to apply
 * each other's values to the wrong element in this Framer Motion version. */
function ScrollHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 60, damping: 20 })
  const springY = useSpring(y, { stiffness: 60, damping: 20 })
  const imageX = useTransform(springX, [-0.5, 0.5], [-14, 14])
  const imageY = useTransform(springY, [-0.5, 0.5], [-10, 10])

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v))

  const insetX = lerp(progress, [0, HERO_EXPAND_END], [23, 0])
  const insetY = lerp(progress, [0, HERO_EXPAND_END], [18, 0])
  const radius = lerp(progress, [0, HERO_EXPAND_END], [40, 0])
  const clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`

  const wordmarkOpacity = lerp(progress, [0, 0.12], [1, 0])
  const scrollHintOpacity = lerp(progress, [0, 0.07], [1, 0])
  // Content must be fully opaque (and stay that way) well before the section
  // unpins — otherwise it only reaches 100% clarity while already scrolling
  // away, never while genuinely "staying" in the pinned hero.
  const contentOpacity = lerp(progress, [0.25, HERO_SETTLED], [0, 1])
  const contentY = lerp(progress, [0.25, HERO_SETTLED], [24, 0])
  // Fades back out before the section unpins (unlike the magnifier below,
  // which is meant to still be growing at that point) — otherwise it stays
  // fully visible while the sticky stage scrolls away underneath it, which
  // reads as the chip lingering on top of the next section instead of
  // leaving with the rest of the hero.
  const chipOpacity = Math.min(
    lerp(progress, [HERO_EXPAND_END + 0.05, HERO_SETTLED + 0.07], [0, 1]),
    lerp(progress, [HERO_SETTLED + 0.1, HERO_UNPIN_FRACTION - 0.01], [1, 0]),
  )
  const chipY = lerp(progress, [HERO_EXPAND_END + 0.05, HERO_SETTLED + 0.07], [16, 0])

  // Once the headline has settled, a square lens zooms in on the smile and
  // keeps growing for as long as the visitor keeps scrolling — but it must
  // finish growing *before* the section unpins, or its biggest size only
  // ever appears while already scrolling out of view.
  const growthEnd = HERO_UNPIN_FRACTION - 0.01
  const magnifierOpacity = lerp(progress, [HERO_SETTLED + 0.02, HERO_SETTLED + 0.06], [0, 1])
  const magnifierScale = lerp(progress, [HERO_SETTLED + 0.02, growthEnd], [0.3, 2.2])
  const bgBlur = lerp(progress, [HERO_SETTLED + 0.02, growthEnd], [0, 9])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!stickyRef.current) return
    const rect = stickyRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    // h-[320vh] must match HERO_WRAPPER_VH in ../lib/hero
    <div ref={wrapperRef} className="relative h-[320vh]">
      <div
        ref={stickyRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-[#FFFFFF] lg:items-center"
      >
        <HeroMedia clipPath={clipPath} imageX={imageX} imageY={imageY} blur={bgBlur} />

        <p
          style={{ opacity: wordmarkOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[27%] px-4 text-center font-display text-lg font-semibold tracking-[0.15em] text-cream/90 uppercase sm:text-2xl sm:tracking-[0.35em] lg:text-3xl"
        >
          Idea Dental
        </p>

        <div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 text-ink/70"
        >
          <span className="text-xs font-semibold tracking-[0.25em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-6 w-px bg-ink/40"
          />
        </div>

        <div
          style={{
            opacity: magnifierOpacity,
            transform: `translate(-50%, -50%) scale(${magnifierScale})`,
          }}
          aria-hidden="true"
          className="absolute top-[49%] left-[62%] hidden h-48 w-32 overflow-hidden rounded-xl shadow-2xl sm:block lg:h-64 lg:w-44"
        >
          <img src={teethZoom} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10 lg:pb-0">
          <HeroContent contentOpacity={contentOpacity} contentY={contentY} />
        </div>

        <div
          style={{ opacity: chipOpacity, transform: `translateY(${chipY}px)` }}
          className="absolute right-6 bottom-8 hidden max-w-[13rem] rounded-2xl border border-cream/15 bg-forest/60 p-4 backdrop-blur-md sm:block lg:right-10"
        >
          <p className="font-display text-xl font-bold text-cream">iTero®</p>
          <p className="mt-1 text-xs text-cream/70">
            Digital scanning for precise, comfortable treatment planning
          </p>
        </div>
      </div>
    </div>
  )
}

/** Reduced-motion / no-scroll-choreography variant: the settled full-bleed hero,
 * shown immediately with no pinned scroll distance. */
function StaticHero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-[#FFFFFF] lg:items-center">
      <HeroMedia clipPath="inset(0% 0% 0% 0% round 0px)" imageX={0} imageY={0} />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10 lg:pb-0">
        <HeroContent contentOpacity={1} contentY={0} />
      </div>
      <div className="absolute right-6 bottom-8 hidden max-w-[13rem] rounded-2xl border border-cream/15 bg-forest/60 p-4 backdrop-blur-md sm:block lg:right-10">
        <p className="font-display text-xl font-bold text-cream">iTero®</p>
        <p className="mt-1 text-xs text-cream/70">Digital scanning for precise, comfortable treatment planning</p>
      </div>
    </section>
  )
}

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="relative">
      {reduceMotion ? <StaticHero /> : <ScrollHero />}
      <p className="sr-only">
        {business.name} is located at {business.address.line1}, {business.address.line2}. Call{' '}
        {business.phone} to request an appointment.
      </p>
    </section>
  )
}
