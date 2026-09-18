import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { aboutCopy, features } from '../data/content'
import officePhoto from '../assets/images/about-office.jpg'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Linearly maps `p` from [inMin, inMax] to [outMin, outMax], clamped at both ends. */
function lerp(p: number, [inMin, inMax]: [number, number], [outMin, outMax]: [number, number]) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

// Real, verifiable facts only — no invented patient counts or satisfaction
// percentages (the live site publishes neither).
const stats = [
  { value: '4', label: 'Specialty areas' },
  { value: '2', label: 'Doctors on staff' },
  { value: 'ES / EN', label: 'Bilingual care' },
]

// Phase map — fractions of this section's own scroll-through. Mirrors the
// choreography analyzed from about.mp4: text reveal, then the about layer
// exits as the thumbnail grows to full-bleed (overlapping, not sequential),
// then cards arrive and the horizontal carousel runs through to the end.
const REVEAL_END = 0.28
const EXIT_START = 0.24
const EXIT_END = 0.36
const MORPH_START = 0.26
const MORPH_END = 0.42
const CARDS_IN_START = 0.34
const CARDS_IN_END = 0.46
const CAROUSEL_START = 0.46
// The last card reaches full white/active by this point, leaving real dwell
// time (CAROUSEL_END → 1) where it just sits fully lit before the section
// unpins — otherwise it would only ever hit "fully active" on the single
// frame right as the pin releases, which reads as never landing on it at all.
const CAROUSEL_END = 0.88

const START_INSET = { top: 10, right: 72, bottom: 66, left: 6, radius: 24 }

// Manual line breaks (same words as aboutCopy.intro) so each line can reveal
// as its own unit, karaoke-style, instead of one clip line sweeping across
// every wrapped line at once.
const REVEAL_LINES = [
  'Idea Dental is a leading provider',
  'of general, cosmetic, restorative,',
  'and orthodontic services with a',
  'clinic conveniently located in',
  'Houston, Texas, treating',
  'patients of all ages.',
]

function AboutMedia({ clipPath }: { clipPath: string }) {
  return (
    <div style={{ clipPath }} className="absolute inset-0">
      <img
        src={officePhoto}
        alt="A consultation room inside the Idea Dental practice"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'grayscale(55%) contrast(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/40 to-forest/10" />
    </div>
  )
}

/** Scroll-driven variant: headline text-color reveal → thumbnail-to-full-bleed
 * morph → pinned horizontal card carousel, all inside one continuous pin so
 * nothing scrolls fully off-screen between phases (see about.mp4 analysis). */
function ScrollAbout() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [trackShift, setTrackShift] = useState(0)

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v))

  useEffect(() => {
    function measure() {
      const track = trackRef.current
      const stage = stageRef.current
      if (!track || !stage) return
      setTrackShift(track.scrollWidth - stage.clientWidth + 96)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const insetTop = lerp(progress, [MORPH_START, MORPH_END], [START_INSET.top, 0])
  const insetRight = lerp(progress, [MORPH_START, MORPH_END], [START_INSET.right, 0])
  const insetBottom = lerp(progress, [MORPH_START, MORPH_END], [START_INSET.bottom, 0])
  const insetLeft = lerp(progress, [MORPH_START, MORPH_END], [START_INSET.left, 0])
  const radius = lerp(progress, [MORPH_START, MORPH_END], [START_INSET.radius, 0])
  const clipPath = `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}% round ${radius}px)`

  const aboutOpacity = lerp(progress, [EXIT_START, EXIT_END], [1, 0])
  const aboutY = lerp(progress, [EXIT_START, EXIT_END], [0, -60])

  const cardsOpacity = lerp(progress, [CARDS_IN_START, CARDS_IN_END], [0, 1])
  const cardsY = lerp(progress, [CARDS_IN_START, CARDS_IN_END], [60, 0])

  const carouselLocal = clamp((progress - CAROUSEL_START) / (CAROUSEL_END - CAROUSEL_START), 0, 1)
  const raw = carouselLocal * (features.length - 1)
  const trackX = -trackShift * carouselLocal

  return (
    // h-[580vh]: room to read the headline, watch the morph, and dwell on
    // every card in the carousel without any phase feeling rushed.
    <div ref={wrapperRef} className="relative h-[580vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[640px] w-full overflow-hidden bg-cream-deep"
      >
        <AboutMedia clipPath={clipPath} />

        {/* Phase 1: headline reveal + stats. The thumbnail sits top-left
            early in the scroll (see START_INSET) — desktop clears it with
            ml-[36%] pushing text right, but that push doesn't exist below
            lg:, so mobile instead anchors content to the bottom of the stage
            to clear the thumbnail vertically. */}
        <div
          style={{ opacity: aboutOpacity, transform: `translateY(${aboutY}px)` }}
          className="absolute inset-0 flex flex-col justify-end gap-10 px-6 py-16 lg:justify-center lg:px-16"
        >
          <div className="relative max-w-[620px] lg:ml-[36%]">
            {/* ml-[34%] on mobile only: the thumbnail sits top-left up to
                ~28% wide (see START_INSET), so without this the eyebrow row
                lands right under it instead of clear of it. lg: pushes the
                whole block past the thumbnail already, so this reverts to 0
                there. */}
            <p className="mb-5 ml-[34%] flex items-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase lg:ml-0">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire" />
              About Idea Dental
            </p>
            <div className="flex flex-col gap-1 font-display text-[1.4rem] leading-snug font-semibold lg:text-[2.2rem]">
              {REVEAL_LINES.map((line, i) => {
                const lineWindow = REVEAL_END / REVEAL_LINES.length
                const lineStart = i * lineWindow
                const lineEnd = lineStart + lineWindow
                const lineInsetRight = lerp(progress, [lineStart, lineEnd], [100, 0])
                return (
                  <div key={line} className="relative grid">
                    <span className="text-ink-soft/45 [grid-area:1/1]">{line}</span>
                    <span
                      style={{ clipPath: `inset(0 ${lineInsetRight}% 0 0)` }}
                      className="text-ink [grid-area:1/1]"
                    >
                      {line}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-8 lg:ml-[36%]">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 3: horizontal card carousel */}
        <div
          style={{ opacity: cardsOpacity, transform: `translateY(${cardsY}px)` }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            ref={trackRef}
            style={{ transform: `translateX(${trackX}px)` }}
            className="absolute bottom-[8vh] left-[4vw] flex gap-6"
          >
            {features.map((feature, i) => {
              const t = Math.max(0, 1 - Math.abs(i - raw))
              return (
                <div
                  key={feature.title}
                  style={{ '--active': t } as CSSProperties}
                  className="about-card w-[clamp(260px,22vw,340px)] flex-none rounded-t-[28px] rounded-b-xl px-6 pt-7 pb-8"
                >
                  <p className="about-card__index mb-3 text-sm italic opacity-70">
                    ({String(i + 1).padStart(2, '0')})
                  </p>
                  <h3 className="about-card__title mb-10 font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="about-card__desc max-w-[30ch] text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Reduced-motion variant: no scroll-jacking — the settled content and an
 * ordinary horizontally-scrollable card row. */
function StaticAbout() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem]">
            <img
              src={officePhoto}
              alt="A consultation room inside the Idea Dental practice"
              className="h-full w-full object-cover"
              style={{ filter: 'grayscale(55%) contrast(1.05)' }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-semibold tracking-widest text-sapphire uppercase">About</p>
          <p className="font-display text-3xl leading-snug font-semibold text-ink lg:text-4xl">
            {aboutCopy.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg leading-relaxed text-ink-soft">{aboutCopy.philosophy}</p>
        </div>
      </div>

      <div className="mt-16 -mx-6 flex gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="w-72 flex-none rounded-2xl border border-line bg-cream-deep/40 p-6"
          >
            <p className="font-display text-lg font-semibold text-ink">{feature.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function About() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="about" className="relative">
      {reduceMotion ? <StaticAbout /> : <ScrollAbout />}
    </section>
  )
}
