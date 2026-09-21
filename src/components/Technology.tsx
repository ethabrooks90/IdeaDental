import { motion } from 'framer-motion'
import { technology } from '../data/content'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export default function Technology() {
  return (
    // sticky + a lower stacking order than Doctors below it — Doctors' solid,
    // rounded-top section rises up the page and covers this one like a
    // curtain, while this section itself stays put ("steady") underneath.
    // The #technology anchor lives on the wrapping div in App.tsx instead of
    // here — see that comment for why.
    <section className="sticky top-0 z-0 bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-12 max-w-2xl"
        >
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-widest text-sapphire uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-sapphire" />
            Technology
          </p>
          <h2 className="font-display text-3xl leading-snug font-semibold text-ink lg:text-4xl">
            We have the newest technology.
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {technology.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl border border-line/70 bg-cream-deep/30"
            >
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${item.youtubeId}`}
                  title={item.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
