import { useEffect, useRef } from "react"

type CarouselProps = {
  title: string
}

export default function Carousel({ title }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const baseItems = Array.from({ length: 8 })
  const items = [...baseItems, ...baseItems, ...baseItems]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const third = el.scrollWidth / 3
    el.scrollLeft = third

    const handleScroll = () => {
      const maxScroll = el.scrollWidth
      const left = el.scrollLeft

      if (left < third * 0.3) {
        el.scrollLeft = left + third
      } else if (left > third * 1.7) {
        el.scrollLeft = left - third
      }

      if (el.scrollLeft <= 0) {
        el.scrollLeft = maxScroll / 2
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollByAmount = (amount: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section className="bg-[#1E1E1E] text-white py-20">
      <div className="max-w-6xl mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-12">
          {title}
        </h2>

        <div className="relative mt-4 h-[320px]">
          <button
            onClick={() => scrollByAmount(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-3 rounded-full hidden md:flex"
          >
            ←
          </button>

          <button
            onClick={() => scrollByAmount(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-3 rounded-full hidden md:flex"
          >
            →
          </button>

          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 h-full items-center"
          >
            {items.map((_, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-60 md:w-64 flex flex-col items-center"
              >
                <div className="w-full h-64 bg-[#E3E3E3] rounded-sm" />
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