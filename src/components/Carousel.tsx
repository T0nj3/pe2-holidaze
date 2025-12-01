// src/components/Carousel.tsx
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa"
import { useFavorites } from "../context/FavoritesContext"
import type { Venue } from "../api/venues"

type CarouselProps = {
  title: string
  venues: Venue[]
  loading: boolean
}

export default function Carousel({ title, venues, loading }: CarouselProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)

  const hasVenues = venues.length > 0
  const infiniteList = hasVenues ? [...venues, ...venues, ...venues] : []

  useEffect(() => {
    if (!containerRef.current || !hasVenues) return

    const slider = containerRef.current
    const itemWidth = slider.scrollWidth / infiniteList.length
    const startIndex = venues.length

    slider.scrollLeft = startIndex * itemWidth
    setReady(true)

    const handleScroll = () => {
      const maxScroll = itemWidth * infiniteList.length
      const current = slider.scrollLeft

      if (current < itemWidth * 0.5) {
        slider.scrollLeft = current + itemWidth * venues.length
      }

      if (current > maxScroll - itemWidth * 1.5) {
        slider.scrollLeft = current - itemWidth * venues.length
      }
    }

    slider.addEventListener("scroll", handleScroll)
    return () => slider.removeEventListener("scroll", handleScroll)
  }, [hasVenues, infiniteList.length, venues.length])

  const scrollByAmount = (amount: number) => {
    const slider = containerRef.current
    if (!slider) return
    slider.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section className="bg-section text-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-serif text-4xl md:mb-10 md:text-5xl">
          {title}
        </h2>

        {/* MOBILE GRID */}
        <div className="grid grid-cols-2 gap-6 md:hidden">
          {loading && !hasVenues &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-xl bg-[#353D64]/60 p-3 animate-pulse"
              >
                <div className="mb-4 h-20 rounded-lg bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/15" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
              </div>
            ))}

          {!loading && hasVenues &&
            venues.slice(0, 6).map((venue) => {
              const image = venue.media?.[0]
              const location = [
                venue.location?.city,
                venue.location?.country,
              ]
                .filter(Boolean)
                .join(", ")
              const isFav = favorites.includes(venue.id)

              return (
                <Link
                  key={venue.id}
                  to={`/venues/${venue.id}`}
                  className="flex flex-col justify-between rounded-xl bg-base p-3 transition hover:-translate-y-1 hover:bg-section/80"
                >
                  <div className="relative mb-3 h-24 overflow-hidden rounded-lg bg-white/10">
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={image.alt || venue.name}
                        className="h-full w-full object-cover"
                      />
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(venue)
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 hover:bg-black/70"
                    >
                      {isFav ? (
                        <FaHeart className="text-red-400 text-sm" />
                      ) : (
                        <FaRegHeart className="text-white text-sm" />
                      )}
                    </button>
                  </div>

                  <div>
                    <p className="mt-1 line-clamp-1 font-serif text-lg">
                      {venue.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70 line-clamp-1">
                      {location || "Unknown location"}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <FaStar className="text-[0.8rem]" />
                        {venue.rating ?? 4.0}
                      </span>
                      <span className="text-white/80">
                        ${venue.price} / night
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

          {!loading && !hasVenues &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-xl bg-[#353D64] p-3 opacity-70"
              >
                <div className="flex justify-end">
                  <span className="text-xl">♡</span>
                </div>
                <div>
                  <p className="mt-3 font-serif text-lg">PLACE</p>
                  <p className="text-sm tracking-[0.35em]">★★★★★</p>
                </div>
              </div>
            ))}
        </div>

        {/* DESKTOP CAROUSEL */}
        <div className="relative mt-10 hidden md:block">
          <button
            onClick={() => scrollByAmount(-320)}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-sm hover:bg-black/60"
          >
            ←
          </button>

          <button
            onClick={() => scrollByAmount(320)}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-sm hover:bg-black/60"
          >
            →
          </button>

          <div
            ref={containerRef}
            className="flex h-full items-center gap-8 overflow-x-scroll scroll-smooth pb-4
                       snap-x snap-mandatory scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700"
            style={{ scrollBehavior: ready ? "smooth" : "auto" }}
          >
            {loading && !hasVenues &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-64 shrink-0 snap-center flex-col items-center rounded-xl bg-[#333333] p-4 animate-pulse"
                >
                  <div className="mb-4 h-40 w-full rounded-lg bg-white/10" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-white/15" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
              ))}

            {!loading && hasVenues &&
              infiniteList.map((venue, index) => {
                const image = venue.media?.[0]
                const location = [
                  venue.location?.city,
                  venue.location?.country,
                ]
                  .filter(Boolean)
                  .join(", ")
                const isFav = favorites.includes(venue.id)

                return (
                  <div
                    key={`${venue.id}-${index}`}
                    className="flex w-64 shrink-0 snap-center flex-col overflow-hidden rounded-xl bg-[#333333] transition hover:-translate-y-1 hover:bg-[#404040]"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-[#E3E3E3]">
                      {image?.url && (
                        <Link to={`/venues/${venue.id}`}>
                          <img
                            src={image.url}
                            alt={image.alt || venue.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(venue)
                        }}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 hover:bg-black/80"
                      >
                        {isFav ? (
                          <FaHeart className="text-red-400" />
                        ) : (
                          <FaRegHeart className="text-white" />
                        )}
                      </button>
                    </div>

                    <Link to={`/venues/${venue.id}`} className="block p-4">
                      <p className="line-clamp-1 text-xl tracking-wide">
                        {venue.name}
                      </p>
                      <p className="mt-1 text-sm uppercase tracking-[0.25em] text-white/70 line-clamp-1">
                        {location || "Unknown location"}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <FaStar />
                          {venue.rating ?? 4.0}
                        </span>
                        <span className="text-white">
                          ${venue.price} / night
                        </span>
                      </div>
                    </Link>
                  </div>
                )
              })}

            {!loading && !hasVenues &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-64 shrink-0 snap-center flex-col items-center"
                >
                  <div className="h-64 w-full rounded-sm bg-[#E3E3E3]" />
                  <p className="mt-4 text-xl tracking-wide">PLACE</p>
                  <p className="mt-1 text-sm tracking-[0.35em]">★★★★★</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}