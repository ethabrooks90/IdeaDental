import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { business } from '../data/content'
import { HERO_WRAPPER_VH } from '../lib/hero'

// Persistent mobile-only conversion bar — on a small screen the header's
// own Contact button scrolls out of reach immediately, so booking or
// calling needs to stay one tap away for as long as the visitor is still on
// the hero. Styled as frosted glass over the hero's dark photo, then faded
// out once the scroll carries past the hero into About's own, lighter
// content — a translucent bar reads fine over the photo but would just look
// washed out floating over the rest of the page. lg:hidden: past that
// breakpoint the header's Contact button is always visible in place, so
// this would just duplicate it.
export default function MobileActionBar() {
  const [visible, setVisible] = useState(true)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    function onScroll() {
      const vh = window.innerHeight
      // Reduced motion skips Hero's pinned scroll-jack entirely — it's just
      // its own 100svh, so "past the hero" is one viewport down instead of
      // the full HERO_WRAPPER_VH scroll range.
      const aboutStart = reduceMotion ? vh : vh * HERO_WRAPPER_VH
      setVisible(window.scrollY < aboutStart)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion])

  return (
    <div
      className={`fixed inset-x-4 z-40 flex gap-3 rounded-3xl border border-white/40 bg-white/20 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[opacity,transform] duration-500 lg:hidden ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <a
        href="#contact"
        className="flex-1 rounded-full bg-ink py-3 text-center text-sm font-semibold text-cream transition-colors hover:bg-sapphire"
      >
        Book
      </a>
      <a
        href={business.phoneHref}
        className="flex-1 rounded-full py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#ED1C24' }}
      >
        Call
      </a>
    </div>
  )
}
