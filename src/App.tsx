import Header from './components/Header'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import About from './components/About'
import Services from './components/Services'
import Technology from './components/Technology'
import Doctors from './components/Doctors'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import MobileActionBar from './components/MobileActionBar'

function App() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        {/* Wrapper bounds Technology's sticky range to just this pair — it
            stays pinned only while Doctors rises over it, then scrolls away
            normally instead of bleeding under Gallery and everything after.
            id lives here, not on the sticky Technology section itself —
            browsers resolve #anchor jumps to a `position: sticky` element
            inconsistently (landing scrolled past it, or not scrolling at
            all), since a stable ordinary block gives native hash navigation
            a predictable target. */}
        <div className="relative" id="technology">
          <Technology />
          <Doctors />
        </div>
        <Gallery />
        <Testimonials />
        <FAQ />
      </main>
      {/* Wrapper bounds Contact's sticky range to just this pair — Contact
          stays steady while the Footer rises up and covers it like a
          curtain, the same technique used for Technology/Doctors above.
          id lives here rather than on the sticky Contact section — see the
          #technology comment above for why. */}
      <div className="relative" id="contact">
        <Contact />
        <Footer />
      </div>
      <MobileActionBar />
    </div>
  )
}

export default App
