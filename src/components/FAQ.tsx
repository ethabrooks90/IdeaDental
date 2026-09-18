import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { business, faqs } from '../data/content'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// Preserves the order categories first appear in `faqs`, rather than an
// alphabetical resort, so "General" (the broadest, most-asked group) leads.
const CATEGORIES = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))]
const PAGE_SIZE = 5

export default function FAQ() {
  const [category, setCategory] = useState('All')
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0].question)
  const [showAll, setShowAll] = useState(false)

  const visible = category === 'All' ? faqs : faqs.filter((f) => f.category === category)
  const displayed = showAll ? visible : visible.slice(0, PAGE_SIZE)
  const hasMore = visible.length > PAGE_SIZE

  function selectCategory(c: string) {
    setCategory(c)
    setShowAll(false)
  }

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-sapphire" />
            FAQ
          </p>
          <h2 className="font-display text-4xl leading-tight font-semibold text-ink lg:text-5xl">
            Common
            <br />
            questions.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-ink-soft">
            Can't find what you're looking for? Call us — we'll answer in plain language, no pressure.
          </p>
          <a
            href={business.phoneHref}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-sapphire"
          >
            Ask us directly
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream/15">↗</span>
          </a>

          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => selectCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                  category === c
                    ? 'border-ink bg-ink text-cream'
                    : 'border-line text-ink-soft hover:border-ink-soft/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
          className="border-t border-line"
        >
          {displayed.map((faq) => {
            const isOpen = openQuestion === faq.question
            return (
              <div key={faq.question} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-medium text-ink">{faq.question}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition-colors ${
                      isOpen ? 'border-sapphire text-sapphire' : 'border-line text-ink-soft'
                    }`}
                  >
                    {isOpen ? '↓' : '↗'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-deep/50"
              >
                {showAll ? 'Show less' : `See more (${visible.length - PAGE_SIZE})`}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
