import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { results } from '../data/content'
import traditionalBraces1 from '../assets/images/results/traditional-braces-1.jpg'
import teethWhitening from '../assets/images/results/teeth-whitening.jpg'
import traditionalBraces2 from '../assets/images/results/traditional-braces-2.jpg'
import teethCleaning from '../assets/images/results/teeth-cleaning.jpg'
import cosmeticBonding from '../assets/images/results/cosmetic-bonding.jpg'
import dentures from '../assets/images/results/dentures.jpg'
import traditionalBraces3 from '../assets/images/results/traditional-braces-3.jpg'
import fillings from '../assets/images/results/fillings.jpg'
import implants from '../assets/images/results/implants.jpg'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const images: Record<string, string> = {
  'traditional-braces-1': traditionalBraces1,
  'teeth-whitening': teethWhitening,
  'traditional-braces-2': traditionalBraces2,
  'teeth-cleaning': teethCleaning,
  'cosmetic-bonding': cosmeticBonding,
  dentures,
  'traditional-braces-3': traditionalBraces3,
  fillings,
  implants,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const FAN_ROTATE_STEP = 14 // deg of tilt per step away from center
const FAN_X_RATIO = 1.25 // horizontal spread per step, relative to card width — >1 leaves a real gap between cards instead of overlapping them
const FAN_Y_RATIO = 0.22 // vertical drop per step, relative to card height — center sits highest
const FAN_SCALE_STEP = 0.06 // shrink per step away from center
const FAN_BLUR_STEP = 3 // px of blur per step away from center — keeps focus reading as the center card
const VISIBLE_RANGE = 1 // cards rendered on each side of the active one
const AUTO_ADVANCE_MS = 4500
const SWIPE_THRESHOLD = 50 // px of drag before it counts as a swipe

/** Interactive variant: a loose fan of photos, like a hand of prints spread
 * across a table — the active result sits centered, upright, and largest,
 * while its neighbors splay out to either side with more tilt, more drop,
 * and a little less scale the further they sit from center. Advances slowly
 * on its own, pausing on hover or drag, and can also be stepped with the
 * arrows, a click on any visible card, or a left/right swipe. */
function FanGallery() {
  const [trackWidth, setTrackWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const isHoveringRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragDeltaRef = useRef(0)

  const count = results.length

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => setTrackWidth(entries[0].contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function step_(direction: 1 | -1) {
    setActiveIndex((prev) => (prev + direction + count) % count)
  }

  function goToIndex(i: number) {
    setActiveIndex(i)
  }

  // Ambient auto-advance, paused the moment a visitor's hand is on it.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (isHoveringRef.current || isDraggingRef.current) return
      setActiveIndex((prev) => (prev + 1) % count)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [count])

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    dragDeltaRef.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return
    dragDeltaRef.current = e.clientX - dragStartXRef.current
  }

  function handlePointerUp() {
    if (Math.abs(dragDeltaRef.current) > SWIPE_THRESHOLD) {
      step_(dragDeltaRef.current < 0 ? 1 : -1)
    }
    isDraggingRef.current = false
    dragDeltaRef.current = 0
  }

  const cardWidth = clamp(trackWidth * 0.3, 220, 340)
  const cardHeight = cardWidth * 1.3

  // Each result's shortest signed distance from the active card (e.g. with
  // 9 results, the card 5 slots ahead is really 4 slots behind) — that's
  // what lets the fan wrap seamlessly past either end instead of the last
  // and first cards ever meeting at a hard edge.
  const visible = results
    .map((result, i) => {
      let offset = i - activeIndex
      if (offset > count / 2) offset -= count
      if (offset < -count / 2) offset += count
      return { result, i, offset }
    })
    .filter((item) => Math.abs(item.offset) <= VISIBLE_RANGE)

  const progress = count > 1 ? activeIndex / (count - 1) : 1

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sapphire" />
              Real results
            </p>
            <h2 className="font-display text-3xl leading-snug font-semibold text-ink lg:text-4xl">
              See the difference for yourself.
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="h-1 w-28 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-sapphire"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </div>
              <span className="font-display text-sm font-semibold text-ink tabular-nums">
                {Math.round(progress * 100)}%
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => step_(-1)}
                aria-label="Previous result"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream-deep/50"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step_(1)}
                aria-label="Next result"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream-deep/50"
              >
                →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Patient before and after results"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step_(-1)
          if (e.key === 'ArrowRight') step_(1)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => {
          isHoveringRef.current = true
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false
        }}
        className="relative mx-auto h-[440px] max-w-5xl touch-pan-y px-6 outline-none select-none sm:h-[520px] lg:h-[620px] lg:px-10"
      >
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            {visible.map(({ result, i, offset }) => {
              const abs = Math.abs(offset)
              const isActive = offset === 0
              const dir = offset === 0 ? 1 : Math.sign(offset)
              const x = offset * cardWidth * FAN_X_RATIO
              const y = abs * cardHeight * FAN_Y_RATIO
              const rotate = offset * FAN_ROTATE_STEP
              const scale = 1 - abs * FAN_SCALE_STEP
              // Blurs everything but the active card, so focus reads as
              // landing on the center one instead of all three competing.
              const blur = `blur(${abs * FAN_BLUR_STEP}px)`
              // Cards enter/exit the visible window one step further out and
              // faded, so joining or leaving the fan reads as a slide, never
              // a pop.
              const edge = { x: x + dir * cardWidth * 0.8, y, rotate, scale: scale * 0.85, opacity: 0, filter: blur }

              return (
                <motion.button
                  key={result.key}
                  type="button"
                  onClick={() => goToIndex(i)}
                  aria-label={result.label}
                  aria-current={isActive}
                  tabIndex={isActive ? 0 : -1}
                  initial={edge}
                  animate={{ x, y, rotate, scale, opacity: 1, filter: blur }}
                  exit={edge}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    marginLeft: -cardWidth / 2,
                    marginTop: -cardHeight / 2,
                    zIndex: 100 - abs,
                  }}
                  className="absolute top-1/2 left-1/2 overflow-hidden rounded-2xl bg-ink shadow-[0_20px_45px_rgba(32,31,27,0.25)]"
                >
                  <img
                    src={images[result.key]}
                    alt={result.label}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Title lives below the fan, not stamped over the photo — swaps with
          a quick fade whenever the active result changes. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={results[activeIndex].key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="mt-8 text-center font-display text-lg font-semibold text-ink lg:text-xl"
        >
          {results[activeIndex].label}
        </motion.p>
      </AnimatePresence>
    </>
  )
}

/** Reduced-motion variant: no auto-advancing fan — an ordinary,
 * horizontally-scrollable row of result cards. */
function StaticGallery() {
  const trackRef = useRef<HTMLDivElement>(null)

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('[data-card]') as HTMLElement | null
    const step = (card?.offsetWidth ?? 280) + 20
    track.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sapphire" />
              Real results
            </p>
            <h2 className="font-display text-3xl leading-snug font-semibold text-ink lg:text-4xl">
              See the difference for yourself.
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous result"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream-deep/50"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next result"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream-deep/50"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] lg:px-10 [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {results.map((result) => (
          <div
            key={result.key}
            data-card
            className="w-64 shrink-0 overflow-hidden rounded-2xl border border-line sm:w-72"
            style={{ scrollSnapAlign: 'start' }}
          >
            <img src={images[result.key]} alt={result.label} className="aspect-[2/3] w-full object-cover" />
          </div>
        ))}
      </div>
    </>
  )
}

export default function Gallery() {
  const reduceMotion = useReducedMotion()

  return (
    // Floating card matching Doctors above: same side margins and white
    // background, square top sitting flush against Doctors' square bottom
    // (zero gap) — together the two read as one continuous connected rounded
    // box, only rounded at the very top (Doctors) and very bottom (here).
    <section
      id="gallery"
      className="mx-4 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-r from-cream-deep via-white via-35% to-cream-deep py-24 sm:mx-6 lg:mx-10 lg:py-32"
    >
      {reduceMotion ? <StaticGallery /> : <FanGallery />}
    </section>
  )
}
