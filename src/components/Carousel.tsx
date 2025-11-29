import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import type { Venue } from "../api/venues"

type CarouselProps = {
  title: string
  venues: Venue[]
  loading: boolean
}

export default function Carousel({ title, venues, loading }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const items =
    venues.length > 0 ? [...venues, ...venues, ...venues] : Array.from({ length: 6 })

  useEffect(() => {
    const el = containerRef.current
    if (!el || venues.length === 0) return

    const third = el.scrollWidth / 3
    el.scrollLeft = third

    const handleScroll = () => {
      const left = el.scrollLeft
      if (left < third * 0.3) {
        el.scrollLeft = left + third
      } else if (left > third * 1.7) {
        el.scrollLeft = left - third
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [venues.length])

  const scrollByAmount = (amount: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section className="bg-section py-20 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between md:mb-12 md:justify-center">
          <h2 className="text-left text-4xl font-serif md:text-center md:text-5xl">
            {title}
          </h2>

          <button className="text-lg underline md:hidden">View all</button>
        </div>

        {loading && (
          <p className="mb-6 text-sm text-white/70">Loading popular stays…</p>
        )}

        {!loading && venues.length === 0 && (
          <p className="mb-6 text-sm text-white/70">No popular stays found.</p>
        )}

        <div className="grid grid-cols-2 gap-6 md:hidden">
          {items.slice(0, 4).map((venue, index) => (
            <Link
              key={index}
              to={
                venues.length > 0 && (venue as Venue).id
                  ? `/venues/${(venue as Venue).id}`
                  : "#"
              }
              className="flex flex-col justify-between rounded-xl bg-[#353D64] p-3"
            >
              <div className="flex justify-end">
                <span className="text-xl">♡</span>
              </div>

              <div>
                <p className="mt-3 text-lg font-serif">
                  {venues.length > 0 && (venue as Venue).name ? (venue as Venue).name : "PLACE"}
                </p>
                <p className="text-sm tracking-[0.35em]">
                  {venues.length > 0
                    ? "★".repeat(Math.round((venue as Venue).rating || 0)).padEnd(5, "☆")
                    : "★★★★★"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="relative mt-10 hidden md:block">
          <button
            onClick={() => scrollByAmount(-300)}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm hover:bg-black/60"
          >
            ←
          </button>

          <button
            onClick={() => scrollByAmount(300)}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm hover:bg-black/60"
          >
            →
          </button>

          <div
            ref={containerRef}
            className="flex h-full items-center gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700"
          >
            {items.map((venue, index) => (
              <Link
                key={index}
                to={
                  venues.length > 0 && (venue as Venue).id
                    ? `/venues/${(venue as Venue).id}`
                    : "#"
                }
                className="flex w-64 shrink-0 snap-center flex-col items-center"
              >
                <div className="w-full overflow-hidden rounded-sm bg-[#E3E3E3]">
                  {venues.length > 0 && (venue as Venue).media[0]?.url ? (
                    <img
                      src={(venue as Venue).media[0].url}
                      alt={
                        (venue as Venue).media[0].alt ||
                        (venue as Venue).name ||
                        "Venue image"
                      }
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="h-64 w-full bg-[#E3E3E3]" />
                  )}
                </div>
                <p className="mt-4 text-xl tracking-wide">
                  {venues.length > 0 && (venue as Venue).name ? (venue as Venue).name : "PLACE"}
                </p>
                <p className="mt-1 text-sm tracking-[0.35em]">
                  {venues.length > 0
                    ? "★".repeat(Math.round((venue as Venue).rating || 0)).padEnd(5, "☆")
                    : "★★★★★"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}