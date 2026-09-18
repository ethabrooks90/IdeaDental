import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { testimonials } from '../data/content'
import teethCleaningBefore from '../assets/images/stories/teeth-cleaning-before.jpg'
import teethCleaningAfter from '../assets/images/stories/teeth-cleaning-after.jpg'
import implantsBefore from '../assets/images/stories/implants-before.jpg'
import implantsAfter from '../assets/images/stories/implants-after.jpg'
import cosmeticBondingBefore from '../assets/images/stories/cosmetic-bonding-before.jpg'
import cosmeticBondingAfter from '../assets/images/stories/cosmetic-bonding-after.jpg'
import denturesBefore from '../assets/images/stories/dentures-before.jpg'
import denturesAfter from '../assets/images/stories/dentures-after.jpg'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const beforeImages: Record<string, string> = {
  'teeth-cleaning': teethCleaningBefore,
  implants: implantsBefore,
  'cosmetic-bonding': cosmeticBondingBefore,
  dentures: denturesBefore,
}

const afterImages: Record<string, string> = {
  'teeth-cleaning': teethCleaningAfter,
  implants: implantsAfter,
  'cosmetic-bonding': cosmeticBondingAfter,
  dentures: denturesAfter,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Linearly maps `p` from [inMin, inMax] to [outMin, outMax], clamped at both ends. */
function lerp(p: number, [inMin, inMax]: [number, number], [outMin, outMax]: [number, number]) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

/** Drag (or tap-and-drag) left/right to reveal more of the before or after
 * photo — a real interactive comparison, not a static split image. */
function BeforeAfterSlider({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string }) {
  const [pct, setPct] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  function updateFromClientX(clientX: number) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPct(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100))
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    isDraggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return
    updateFromClientX(e.clientX)
  }

  function handlePointerUp() {
    isDraggingRef.current = false
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="slider"
      aria-label="Drag to compare before and after"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPct((p) => clamp(p - 5, 0, 100))
        if (e.key === 'ArrowRight') setPct((p) => clamp(p + 5, 0, 100))
      }}
      className="relative h-full w-full touch-none [cursor:ew-resize] select-none"
    >
      <img src={afterSrc} alt="After" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <img src={beforeSrc} alt="Before" draggable={false} className="h-full w-full object-cover" />
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold tracking-widest text-white uppercase backdrop-blur-sm">
        Before
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold tracking-widest text-white uppercase backdrop-blur-sm">
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pct}%` }}>
        <div className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white/90" />
        <div className="absolute top-1/2 left-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg">
          ⇄
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const count = testimonials.length
  const testimonial = testimonials[active]

  // Tracks this block's own scroll-through: 0 as it first appears at the
  // bottom of the viewport, 1 once it has scrolled up to sit centered — not
  // a one-shot trigger, so the two panels pan in lockstep with the scroll
  // itself instead of playing a fixed-length animation once.
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start end', 'center center'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v))

  const panX = lerp(progress, [0, 1], [100, 0]) // % — 100 = fully off to its own side, 0 = closed

  function go(direction: 1 | -1) {
    setActive((prev) => (prev + direction + count) % count)
  }

  return (
    // overflow-x-hidden: the two panels sit fully off-screen (±100% pan) at
    // scroll progress 0 — i.e. whenever this section hasn't been scrolled
    // into yet, including right at page load — and that transform-driven
    // offset otherwise leaks into the page's own horizontal scrollable width
    // (confirmed: it's real overflow, not just a visual/clipped effect).
    <section id="testimonials" className="overflow-x-hidden bg-white py-24 lg:py-32">
      <div ref={wrapperRef} className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-12 text-center"
        >
          <p className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-sapphire" />
            Patient experience
          </p>
          <h2 className="font-display text-3xl font-semibold text-ink lg:text-4xl">What our patients say.</h2>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            // Two separate cut shapes, not one fused card: the photo (left)
            // is a narrower rectangle, the text panel (right) is a true
            // square (its width pinned to the shared row height via
            // aspect-square) — the square is the bigger of the two. Fluid
            // proportional sizing from md: (768px) keeps this from overflowing
            // through lg: (the max-w-6xl container isn't reliably wide enough
            // for the exact pixel sizes below ~1134px); the fixed 460px width
            // only pins in at xl: (1280px+), comfortably past that point.
            // justify-center: once both are pinned to fixed pixel widths at
            // xl:, their combined width no longer fills the row, so without
            // this they'd default to hugging the left edge instead of
            // sitting centered in the section.
            className="flex flex-col gap-4 md:h-[260px] md:flex-row md:justify-center md:gap-6 xl:h-[400px]"
          >
            <div
              style={{ '--pan-x': `${-panX}%` } as CSSProperties}
              className="relative aspect-square overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(32,31,27,0.10)] sm:aspect-[4/3] md:aspect-auto md:h-full md:flex-1 md:[transform:translateX(var(--pan-x))] xl:w-[460px] xl:flex-none"
            >
              <BeforeAfterSlider
                beforeSrc={beforeImages[testimonial.resultKey]}
                afterSrc={afterImages[testimonial.resultKey]}
              />
            </div>

            <div
              style={{ '--pan-x': `${panX}%` } as CSSProperties}
              className="flex shrink-0 flex-col justify-center gap-4 overflow-hidden rounded-[2rem] bg-cream p-8 shadow-[0_20px_50px_rgba(32,31,27,0.10)] md:aspect-square md:h-full md:[transform:translateX(var(--pan-x))] lg:p-10">
              <span className="w-fit rounded-full border border-line px-4 py-1.5 text-xs font-semibold tracking-widest text-ink-soft uppercase">
                {testimonial.treatment}
              </span>
              <h3 className="font-display text-2xl leading-snug font-semibold text-ink">{testimonial.headline}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{testimonial.body}</p>
              <p className="text-sm font-semibold tracking-wide text-ink-soft">— {testimonial.name}</p>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show story from ${t.name}`}
                      aria-current={active === i}
                      className={`h-2 rounded-full transition-all ${
                        active === i ? 'w-6 bg-sapphire' : 'w-2 bg-line hover:bg-ink-soft/40'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous story"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream-deep/50"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next story"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-cream-deep/50"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
