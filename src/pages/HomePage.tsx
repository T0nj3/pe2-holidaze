import { useEffect, useState } from "react"
import Header from "../components/Header"
import heroVideo from "../assets/hero.mp4"
import Carousel from "../components/Carousel"
import WhyBookSection from "../components/WhyBookSection"
import DiscoverSection from "../components/DiscoverSection"
import Footer from "../components/Footer"
import FindStaySection from "../components/FindStaySection"
import { getPopularVenues, type Venue } from "../api/venues"

export default function HomePage() {
  const [popularVenues, setPopularVenues] = useState<Venue[]>([])
  const [popularLoading, setPopularLoading] = useState(false)
  const [popularError, setPopularError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setPopularLoading(true)
        setPopularError(null)
        const data = await getPopularVenues()
        if (!ignore) setPopularVenues(data)
      } catch (error: any) {
        if (!ignore) {
          setPopularError(error?.message || "Could not load popular stays")
        }
      } finally {
        if (!ignore) setPopularLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="w-full">
      <Header variant="landing" />

      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={heroVideo}
        />

        <div className="absolute inset-0 z-0 bg-black/40" />

        <div className="relative z-10 flex h-full items-end pb-10 md:pb-16">
          <FindStaySection variant="overlay" />
        </div>
      </section>

      <FindStaySection />

      {popularError && (
        <div className="mx-auto mt-8 max-w-6xl rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
          {popularError}
        </div>
      )}

      <Carousel
        title="Popular stays"
        venues={popularVenues}
        loading={popularLoading}
      />

      <WhyBookSection />
      <DiscoverSection />
      <Footer />
    </div>
  )
}