import { useState } from 'react'
import { motion } from 'framer-motion'
import { serviceCategories } from '../data/content'
import generalImg from '../assets/images/services/general-dentistry.jpg'
import restorativeImg from '../assets/images/services/dental-implants.jpg'
import cosmeticImg from '../assets/images/services/cosmetic-dentistry.jpg'
import orthodonticImg from '../assets/images/services/orthodontics.jpg'
import teethWhiteningImg from '../assets/images/services/teeth-whitening.jpg'
import rootCanalsImg from '../assets/images/services/root-canals.jpg'
import veneersImg from '../assets/images/services/veneers.jpg'
import denturesImg from '../assets/images/services/dentures.jpg'
import traditionalBracesImg from '../assets/images/services/traditional-braces.jpg'
import clearBracesImg from '../assets/images/services/clear-braces.jpg'
import bracesForTeensImg from '../assets/images/services/braces-for-teens.jpg'
import invisalignImg from '../assets/images/services/invisalign.jpg'
import invisalignForTeensImg from '../assets/images/services/invisalign-for-teens.jpg'
import retentionImg from '../assets/images/services/retention.jpg'
import iteroScannerImg from '../assets/images/services/itero-scanner.jpg'
import earlyTreatmentImg from '../assets/images/services/early-treatment.jpg'
import adultTreatmentImg from '../assets/images/services/adult-treatment.jpg'

const categoryImages = {
  general: generalImg,
  restorative: restorativeImg,
  cosmetic: cosmeticImg,
  orthodontic: orthodonticImg,
} as const

// Every treatment now has its own dedicated real photo — no two tags share
// an image.
const treatmentImages: Partial<Record<string, string>> = {
  'Teeth Whitening': teethWhiteningImg,
  'Root Canals': rootCanalsImg,
  Veneers: veneersImg,
  Dentures: denturesImg,
  'Dental Implants': restorativeImg,
  'Traditional Braces': traditionalBracesImg,
  'Clear Braces': clearBracesImg,
  'Braces for Teens': bracesForTeensImg,
  Invisalign: invisalignImg,
  'Invisalign for Teens': invisalignForTeensImg,
  Retention: retentionImg,
  'iTero Intraoral Scanner': iteroScannerImg,
  'Early Treatment': earlyTreatmentImg,
  'Adult Treatment': adultTreatmentImg,
}

// Motion tokens derived from the Services .mp4 frame-by-frame analysis in
// services-motion/analysis/ — see easing.md for why these four curves (and
// no springs) cover the whole system.
const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN = [0.7, 0, 1, 1] as const
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

function GeneralIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3c-2.2 0-3.4 1.3-4.5 1.3S5.8 3.6 4.7 4.4C3.3 5.4 3 7.3 3.4 9.4c.4 2.1 1.4 4.8 2.1 6.9.5 1.5.9 2.7 1.8 2.7.9 0 1-1.4 1.3-3 .3-1.5.6-2.9 1.4-2.9s1.1 1.4 1.4 2.9c.3 1.6.4 3 1.3 3 .9 0 1.3-1.2 1.8-2.7.7-2.1 1.7-4.8 2.1-6.9.4-2.1.1-4-1.3-5-1.1-.8-1.6.9-2.6.9S14.2 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RestorativeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 3v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 5.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9.5 9h5l-1 10.5c-.1 1-.9 1.5-1.5 1.5s-1.4-.5-1.5-1.5L9.5 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M10.2 12h3.6M10.5 15h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function CosmeticIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3.5c.4 2.6 1.1 4.3 2 5.2.9.9 2.6 1.6 5.2 2-2.6.4-4.3 1.1-5.2 2-.9.9-1.6 2.6-2 5.2-.4-2.6-1.1-4.3-2-5.2-.9-.9-2.6-1.6-5.2-2 2.6-.4 4.3-1.1 5.2-2 .9-.9 1.6-2.6 2-5.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function OrthodonticIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 10c2.5 3 5 4.5 8 4.5s5.5-1.5 8-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="7" cy="10.8" r="1" fill="currentColor" />
      <circle cx="12" cy="13.2" r="1" fill="currentColor" />
      <circle cx="17" cy="10.8" r="1" fill="currentColor" />
    </svg>
  )
}

const icons = {
  general: GeneralIcon,
  restorative: RestorativeIcon,
  cosmetic: CosmeticIcon,
  orthodontic: OrthodonticIcon,
} as const

function IconCircle({ Icon, active }: { Icon: () => React.JSX.Element; active: boolean }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, ease: EASE_IN_OUT }}
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.07)] ${
        active ? 'h-20 w-20' : 'h-12 w-12'
      }`}
    >
      <Icon />
      <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
        {/* Rotates the arc+dot around the ring as the row activates/collapses,
            rather than snapping to a new spot (per the reference: the dot
            travels from the top of the ring to the bottom-left when expanded). */}
        <motion.g
          animate={{ rotate: active ? 230 : 0 }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT }}
          style={{ transformBox: 'view-box', transformOrigin: '50px 50px' }}
        >
          <path
            d="M 6 62 A 47 47 0 0 1 38 8"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="38" cy="8" r="3" fill="currentColor" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

function ServiceRow({
  category,
  index,
  active,
  onActivate,
}: {
  category: (typeof serviceCategories)[number]
  index: number
  active: boolean
  onActivate: () => void
}) {
  const Icon = icons[category.key as keyof typeof icons]
  const label = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      layout
      onClick={onActivate}
      transition={{ layout: { duration: active ? 0.2 : 0.14, ease: active ? EASE_OUT : EASE_IN } }}
      className={`relative cursor-pointer overflow-hidden rounded-2xl border border-line/70 px-6 transition-colors ${
        active ? 'bg-cream-deep/60 py-6' : 'bg-transparent py-4 hover:bg-cream-deep/30'
      }`}
    >
      {/* flex-col on mobile when active: stacking the icon above the text
          instead of beside it is what actually frees up the width — with
          the icon (80px) AND the chevron both sitting in the same row as a
          narrow card's text, the description was only left ~110px to wrap
          in. sm:flex-row restores the original side-by-side layout once
          there's room for it. The chevron itself moves to an absolute
          corner on mobile (pr-12 clears space for it) for the same reason,
          then rejoins the row normally at sm: via sm:static. */}
      <motion.div
        layout="position"
        className={`flex gap-4 pr-12 sm:gap-6 sm:pr-0 ${active ? 'flex-col items-start sm:flex-row' : 'flex-row items-center'}`}
      >
        {!active && <span className="w-6 shrink-0 text-sm text-ink-soft/70">{label}</span>}

        {active && (
          <motion.div
            key="image-active"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
            className="hidden h-24 w-40 shrink-0 overflow-hidden rounded-xl sm:block lg:h-28 lg:w-52"
          >
            <img
              src={categoryImages[category.key as keyof typeof categoryImages]}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}

        <IconCircle Icon={Icon} active={active} />

        {active ? (
          <motion.div
            key="content-active"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT, delay: 0.05 } }}
            className="min-w-0 flex-1"
          >
            <h3 className="font-display text-2xl leading-tight font-semibold text-ink lg:text-3xl">
              {category.label}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{category.description}</p>

            <ul className="mt-3 flex max-w-lg flex-wrap gap-2">
              {category.treatments.map((treatment) => {
                const img = treatmentImages[treatment]
                return (
                  <li
                    key={treatment}
                    className={`flex items-center gap-1.5 rounded-full border border-line bg-cream text-xs font-medium text-ink-soft ${
                      img ? 'py-1 pr-3 pl-1' : 'px-3 py-1'
                    }`}
                  >
                    {img && <img src={img} alt="" className="h-5 w-5 rounded-full object-cover" />}
                    {treatment}
                  </li>
                )
              })}
            </ul>

            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-sm font-semibold text-cream transition-colors hover:bg-sapphire"
            >
              Book now
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-ink"
              >
                ↗
              </span>
            </a>
          </motion.div>
        ) : (
          <motion.h3
            key="title-collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } }}
            className="min-w-0 flex-1 text-base font-medium text-ink"
          >
            {category.label}
          </motion.h3>
        )}

        <motion.span
          layout
          aria-hidden="true"
          className={`absolute flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft sm:static ${
            active ? 'top-6 right-6' : 'top-1/2 right-6 -translate-y-1/2 sm:translate-y-0'
          }`}
        >
          {active ? '↓' : '↗'}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  const [active, setActive] = useState(0)

  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10"
      >
        <div>
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-sapphire" />
            What we offer
          </p>
          <h2 className="font-display text-3xl leading-snug font-semibold text-ink lg:text-4xl">
            General, cosmetic, restorative, and orthodontic care — all under one roof.
          </h2>
        </div>
        <p className="self-end text-lg leading-relaxed text-ink-soft">
          From routine checkups to full-arch restorations, our team provides a complete range of
          procedures for patients of all ages.
        </p>
      </motion.div>

      <div className="flex flex-col gap-2">
        {serviceCategories.map((category, i) => (
          <ServiceRow key={category.key} category={category} index={i} active={active === i} onActivate={() => setActive(i)} />
        ))}
      </div>
    </section>
  )
}
