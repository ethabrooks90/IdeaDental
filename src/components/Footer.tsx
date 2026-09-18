import { business, hours, nav } from '../data/content'

// Breaks a time value onto two lines — on " – " for a range, or before the
// last word for a standalone phrase like "By appointment only" — so nothing
// in the narrow time column ever runs past the dotted leader on one line.
function splitTimeLines(time: string) {
  if (time.includes(' – ')) return time.split(' – ')
  const lastSpace = time.lastIndexOf(' ')
  return lastSpace === -1 ? [time] : [time.slice(0, lastSpace), time.slice(lastSpace + 1)]
}

// Real hours from `hours` above, just relabeled with short day names and
// merged where two adjacent days are genuinely identical (Tue/Wed) — no
// values invented, only the grouping is a display choice.
const hourGroups = [
  { label: 'Mon', time: hours[0].time, note: hours[0].note },
  { label: 'Tue – Wed', time: hours[1].time, note: hours[1].note },
  { label: 'Thu', time: hours[3].time, note: hours[3].note },
  { label: 'Fri', time: hours[4].time, note: hours[4].note },
  { label: 'Sat', time: hours[5].time, note: hours[5].note },
  { label: 'Sun', time: hours[6].time, note: hours[6].note },
]

export default function Footer() {
  return (
    // Solid bg + shadow, sitting above the sticky Contact section in
    // stacking order — as the page scrolls, this whole footer rises up and
    // covers Contact like a curtain, which stays steady underneath (see the
    // `sticky` note in Contact.tsx). The gradient stops are fully opaque (no
    // alpha) so it actually covers Contact instead of letting it show
    // through — and square corners (no rounding) so it covers edge to edge
    // with zero gap once fully risen; a rounded corner on a full-bleed panel
    // always leaves a sliver of whatever's behind it peeking through.
    // min-h-screen: since Footer is the last thing on the page, the page
    // can't scroll any further once Footer's own bottom hits the viewport
    // bottom — if Footer's natural content is shorter than the viewport,
    // that happens before its top ever reaches 0, so the curtain can never
    // finish rising (confirmed: a real, not just cosmetic, gap). Forcing
    // Footer to be at least one viewport tall guarantees it always has
    // enough travel room to fully cover, regardless of content length.
    <footer className="relative z-10 flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-cream-deep via-cream to-cream-deep shadow-[0_-30px_60px_rgba(0,0,0,0.12)]">
      {/* Decorative watermark of the real brand name — oversized and faint,
          purely typographic, clipped by the footer's own bounds. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.12em] left-1/2 -translate-x-1/2 font-display text-[26vw] leading-none font-bold whitespace-nowrap text-ink/[0.04] select-none"
      >
        IDEA DENTAL
      </p>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 pt-20 pb-10 lg:px-10 lg:pt-24">
        {/* 2 columns below lg instead of one long stack — brand+nav paired
            with hours, address+contact spanning the full second row — cuts
            the mobile scroll length roughly in half without hiding or
            trimming any of the real content. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 lg:gap-14 lg:divide-x lg:divide-line">
          <div className="lg:pr-12">
            <p className="font-display text-3xl font-bold tracking-tight text-ink">{business.name.toUpperCase()}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              General, cosmetic, restorative, and orthodontic care for the whole family, delivered with a
              patient-first philosophy, in a practice built around your comfort.
            </p>

            <ul className="mt-10 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-base text-ink transition-colors hover:text-sapphire">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:px-12">
            <p className="text-xs font-semibold tracking-widest text-ink-soft uppercase">Opening hours</p>
            {/* Dotted leader between day and time (classic table-of-contents
                style) so the eye can track straight across a row instead of
                guessing which time belongs to which day — and a time range
                splits onto two lines instead of "10:00 AM – 6:00 PM" running
                together on one. */}
            <dl className="mt-4 space-y-3">
              {hourGroups.map((h) => (
                <div key={h.label} className="flex items-center gap-2 text-sm">
                  <dt className="shrink-0 text-ink-soft">{h.label}</dt>
                  <span aria-hidden="true" className="h-px flex-1 border-b border-dotted border-line" />
                  <dd className="shrink-0 text-right leading-snug font-medium text-ink">
                    {splitTimeLines(h.time).map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Folded into a short note instead of its own labeled block —
                the phone number it would repeat is already one column over,
                under Contact. */}
            <p className="mt-4 max-w-xs text-xs text-ink-soft">
              Emergency dental care is available for patients of all ages.
            </p>
          </div>

          <div className="col-span-2 lg:col-span-1 lg:pl-12">
            <p className="text-xs font-semibold tracking-widest text-ink-soft uppercase">Address</p>
            <p className="mt-4 text-sm leading-relaxed text-ink">
              {business.address.line1}
              <br />
              {business.address.line2}
            </p>

            <p className="mt-10 text-xs font-semibold tracking-widest text-ink-soft uppercase">Contact</p>
            <a href={business.phoneHref} className="mt-4 block text-sm text-ink hover:text-sapphire">
              {business.phone}
            </a>

            <div className="mt-6 flex gap-3">
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Idea Dental on Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft transition-colors hover:border-ink-soft/50 hover:text-ink"
              >
                f
              </a>
              <a
                href={business.social.yelp}
                target="_blank"
                rel="noreferrer"
                aria-label="Idea Dental on Yelp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft transition-colors hover:border-ink-soft/50 hover:text-ink"
              >
                Y
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className="relative mt-16 border-t border-line">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-cream"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink-soft/50" />
            </span>
          </div>

          {/* Just two items now — "Houston, TX" dropped, since the Address
              block above already says "Houston, TX 77076". */}
          <div className="mt-8 flex flex-col divide-y divide-line text-center text-xs text-ink-soft/80 sm:flex-row sm:divide-x sm:divide-y-0">
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 hover:text-ink sm:flex-1 sm:py-0 sm:pr-6"
            >
              Find us on Google Maps
            </a>
            <p className="py-3 sm:flex-1 sm:py-0 sm:pl-6">© {new Date().getFullYear()} Idea Dental. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
