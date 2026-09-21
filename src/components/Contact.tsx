import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { business } from '../data/content'
import contactPortrait from '../assets/images/contact-portrait.jpg'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// Real Idea Dental service categories (see `serviceCategories` above) —
// "Consultation" is the generic first-visit default, the other three are
// shorthand for real treatments: Whitening (General Dentistry), Implants
// (Restorative), Aligners (Invisalign, offered under both Cosmetic and
// Orthodontic Services).
const SERVICES = ['Consultation', 'Whitening', 'Implants', 'Aligners']

export default function Contact() {
  const [service, setService] = useState(SERVICES[0])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // There's no booking backend behind this re-skin — the site's real process
  // (per the appointments page) is that a request is always confirmed by a
  // follow-up phone call anyway, so the honest action here is to place that
  // call directly rather than pretend to submit somewhere.
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    window.location.href = business.phoneHref
  }

  return (
    // sticky + a lower stacking order than the Footer below it — the Footer's
    // solid, rounded-top panel rises up the page and covers this one like a
    // curtain, while this section stays put ("steady") underneath (see the
    // matching `z-10`/rounded-top/shadow note in Footer.tsx). The #contact
    // anchor lives on the wrapping div in App.tsx instead of here — see that
    // comment for why.
    <section className="sticky top-0 z-0 overflow-hidden bg-cream">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-[680px]">
          <img
            src={contactPortrait}
            alt="A smiling Idea Dental patient"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '58% center' }}
          />
          {/* Fades the photo into the form panel's cream background instead
              of cutting hard at the column boundary — only meaningful once
              lg: actually places the form beside it, not stacked below. */}
          <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-transparent lg:from-55% lg:to-cream" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-0"
        >
          <h2 className="font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl lg:text-5xl">
            Ready for your best smile?
            <br />
            <span className="text-ink-soft">Book a call.</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-10 max-w-xl">
            <fieldset>
              <legend className="mb-3 text-sm text-ink-soft">Choose your service:</legend>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {SERVICES.map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        service === s ? 'border-ink' : 'border-line'
                      }`}
                    >
                      {service === s && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </span>
                    <input
                      type="radio"
                      name="service"
                      value={s}
                      checked={service === s}
                      onChange={() => setService(s)}
                      className="sr-only"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                aria-label="Name"
                className="w-full rounded-2xl border border-line px-5 py-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                aria-label="Phone number"
                className="w-full rounded-2xl border border-line px-5 py-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
              />
            </div>

            <div className="mt-4 flex items-stretch gap-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                aria-label="Message"
                rows={2}
                className="w-full resize-none rounded-2xl border border-line px-5 py-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Call to book"
                className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-ink text-lg text-cream transition-colors hover:bg-sapphire"
              >
                ↗
              </button>
            </div>

            <p className="mt-4 text-xs text-ink-soft">
              We'll call to confirm your appointment — or reach us directly at{' '}
              <a href={business.phoneHref} className="font-medium text-ink hover:text-sapphire">
                {business.phone}
              </a>
              .
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
