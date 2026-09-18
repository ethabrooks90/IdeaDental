import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { nav } from '../data/content'
import { HERO_SETTLED, HERO_UNPIN_FRACTION, HERO_WRAPPER_VH } from '../lib/hero'
import { ABOUT_HEADER_REAPPEAR, ABOUT_WRAPPER_VH } from '../lib/about'
import logo from '../assets/images/logo.png'

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    // The hero is a dark, full-bleed section — the header should stay in its
    // transparent/light-on-dark mode for as long as that dark hero occupies
    // the top of the viewport. That's exactly until the sticky hero detaches
    // (HERO_UNPIN_FRACTION of its scroll range); with the reduced-motion
    // static hero it's just its own 100vh.
    function onScroll() {
      const vh = window.innerHeight
      const unpinY = vh * HERO_WRAPPER_VH * HERO_UNPIN_FRACTION
      const scrolledThreshold = reduceMotion ? vh * 0.85 : unpinY
      setScrolled(window.scrollY > scrolledThreshold)

      // Stay hidden during the small-card intro — only appear once the hero
      // has fully settled (image expanded, text at 100% opacity), while still
      // comfortably pinned. Reduced motion skips the intro entirely.
      const revealThreshold = vh * HERO_WRAPPER_VH * HERO_SETTLED
      // The hero's own wrapper (and its dark image) doesn't actually finish
      // scrolling away until HERO_WRAPPER_VH, a full viewport-height *after*
      // the sticky child detaches at unpinY — the header should stay in its
      // normal dark-hero styling for that whole stretch (still "in the hero
      // section", nothing mismatched about it yet) and only start dipping out
      // right as About's own, lighter content actually begins, not before.
      // It then stays hidden through About's headline-reveal and image-morph
      // phases, only reappearing once About has settled into its steadier
      // card-carousel phase (ABOUT_HEADER_REAPPEAR) — otherwise it'd pop back
      // in over content that's still transitioning.
      const aboutStart = vh * HERO_WRAPPER_VH
      const dipStart = aboutStart
      const dipEnd = aboutStart + vh * ABOUT_WRAPPER_VH * ABOUT_HEADER_REAPPEAR
      const inDip = !reduceMotion && window.scrollY > dipStart && window.scrollY < dipEnd
      setRevealed((reduceMotion || window.scrollY > revealThreshold) && !inDip)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion])

  const dark = !scrolled && !open
  // The standalone Contact button covers this already — no need to repeat it in the pill.
  const pillNav = nav.filter((item) => item.label !== 'Contact')

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[opacity,transform] duration-500 ${
        open ? 'border-line/70 bg-cream' : 'border-transparent bg-transparent'
      } ${revealed ? 'opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" onClick={() => setOpen(false)}>
          <img src={logo} alt="Idea Dental" className="h-10 w-auto" />
        </a>

        <nav
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md transition-colors lg:flex ${
            dark ? 'border-cream/15 bg-cream/10' : 'border-line/60 bg-cream-deep/50'
          }`}
        >
          {pillNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                dark ? 'text-cream/80 hover:bg-cream/10 hover:text-cream' : 'text-ink-soft hover:bg-white hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="#contact"
            className={`inline-flex items-center gap-3 rounded-full py-1.5 pr-1.5 pl-5 text-sm font-semibold transition-colors ${
              dark ? 'bg-cream text-ink hover:bg-white' : 'bg-ink text-cream hover:bg-sapphire'
            }`}
          >
            Contact
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full ${dark ? 'bg-ink text-cream' : 'bg-cream text-ink'}`}
            >
              <ArrowIcon />
            </span>
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className={`h-0.5 w-6 rounded-full transition-colors ${dark ? 'bg-cream' : 'bg-ink'}`}
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className={`h-0.5 w-6 rounded-full transition-colors ${dark ? 'bg-cream' : 'bg-ink'}`}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className={`h-0.5 w-6 rounded-full transition-colors ${dark ? 'bg-cream' : 'bg-ink'}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-line/70 bg-cream lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ink-soft hover:bg-cream-deep hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-ink py-3 pr-2 pl-5 text-center text-sm font-semibold text-cream"
              >
                Contact
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-ink">
                  <ArrowIcon />
                </span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
