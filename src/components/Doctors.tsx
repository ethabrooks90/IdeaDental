import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { business, doctors } from '../data/content'
import drVuPhoto from '../assets/images/stephanie-vu.jpg'
import drRathiPhoto from '../assets/images/nukul-rathi.jpg'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const photos: Record<string, string> = {
  vu: drVuPhoto,
  rathi: drRathiPhoto,
}

const [city, stateZip] = business.address.line2.split(', ')
const cityState = `${city}, ${stateZip?.split(' ')[0]}`

export default function Doctors() {
  const [active, setActive] = useState(0)
  const doctor = doctors[active]

  return (
    // Solid bg + rounded top + shadow, sitting above the sticky Technology
    // section in stacking order — as the page scrolls, this whole section
    // rises up and covers Technology like a curtain, which stays steady
    // underneath (see the `sticky` note in Technology.tsx). Floating card
    // (inset side margins kept) with only the top corners rounded — its
    // square bottom sits flush, zero gap, against Gallery's square top right
    // below, and both share the same white background and side margins, so
    // together they read as one continuous connected rounded box.
    <section
      id="doctors"
      className="relative z-10 mx-4 min-h-[560px] overflow-hidden rounded-t-[2.5rem] bg-white shadow-[0_-30px_60px_rgba(0,0,0,0.12)] sm:mx-6 lg:mx-10 lg:min-h-[700px]"
    >
      {/* Portrait is the section itself — full-bleed, no padding or frame
          around it. Only the curtain's rounded top corners remain. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={doctor.key}
          src={photos[doctor.key]}
          alt={doctor.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
      </AnimatePresence>

      {/* Legibility scrims — darker bottom (for the info bar) and left
          (for the heading), clear over the center-right where the face sits. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" />

      <div className="relative mx-auto flex h-full min-h-[560px] max-w-7xl flex-col justify-between px-6 py-12 lg:min-h-[700px] lg:px-10 lg:py-16">
            <div className="flex items-start justify-between gap-8">
              <h2 className="max-w-[16rem] font-display text-2xl leading-snug font-semibold text-white lg:max-w-sm lg:text-3xl">
                {business.name.toUpperCase()} is the
                <br />
                doctors you trust
                <br />
                with your smile.
              </h2>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={doctor.key}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay: 0.1 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="hidden max-w-[15rem] text-right text-sm leading-relaxed text-white/80 sm:block"
                >
                  {doctor.bio[0]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  {doctors.map((d, i) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show ${d.name}`}
                      aria-current={active === i}
                      className={`h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 transition-colors ${
                        active === i ? 'border-white' : 'border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photos[d.key]} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={doctor.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="text-sm font-medium text-white"
                  >
                    {doctor.name}
                  </motion.p>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={doctor.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="text-sm text-white/70"
                >
                  {doctor.credentials}
                </motion.p>
              </AnimatePresence>

              <p className="text-sm text-white/70">{cityState}</p>
            </div>
          </div>
    </section>
  )
}
