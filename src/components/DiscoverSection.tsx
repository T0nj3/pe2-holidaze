import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getPopularVenues, type Venue } from "../api/venues"

type DiscoverImage = {
  url: string
  alt: string
}

function extractImages(venues: Venue[]): DiscoverImage[] {
  return venues
    .map((venue) => {
      const img = venue.media?.[0]
      if (!img?.url) return null
      return {
        url: img.url,
        alt: img.alt || venue.name,
      }
    })
    .filter(Boolean) as DiscoverImage[]
}

export default function DiscoverSection() {
  const [images, setImages] = useState<DiscoverImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await getPopularVenues()
        if (ignore) return

        const extracted = extractImages(data)
        setImages(extracted)
      } catch {
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % images.length),
      3000
    )
    return () => clearInterval(id)
  }, [images])

  const activeImage = images[currentIndex]

  return (
    <section className="relative w-full h-[420px] sm:h-[480px] md:h-[550px] lg:h-[650px] overflow-hidden bg-[#111] mt-0">
      {activeImage?.url && (
        <img
          src={activeImage.url}
          alt={activeImage.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      )}

      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-snug drop-shadow-xl">
          Discover hidden gems<br className="hidden sm:block" /> across the world
        </h2>

        <button
          onClick={() => navigate("/venues")}
          className="mt-8 px-10 md:px-12 py-3 md:py-4 rounded-xl bg-olive text-lg md:text-xl font-medium shadow-lg hover:bg-olive/80 transition"
        >
          Explore venues
        </button>
      </div>
    </section>
  )
}