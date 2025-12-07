import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import { FiCalendar, FiSearch } from "react-icons/fi"
import "react-datepicker/dist/react-datepicker.css"

type FindStaySectionProps = {
  variant?: "section" | "overlay"
}

export default function FindStaySection({
  variant = "section",
}: FindStaySectionProps) {
  const isOverlay = variant === "overlay"
  const navigate = useNavigate()

  const [location, setLocation] = useState("")
  const [date, setDate] = useState<Date | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()

    if (location.trim()) {
      params.set("q", location.trim())
    }

    if (date) {
      const iso = date.toISOString().slice(0, 10)
      params.set("date", iso)
    }

    const search = params.toString()
    if (search) {
      navigate(`/venues?${search}`)
    } else {
      navigate("/venues")
    }
  }

  if (isOverlay) {
    return (
      <section className="md:hidden -mt-8 px-4 pb-28 relative z-20">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-white/12 bg-base/85 px-5 py-5 text-white shadow-2xl backdrop-blur-md">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
              Search stays
            </p>
            <h2 className="mt-1 text-xl font-serif">
              Find your next stay
            </h2>
            <p className="mt-1 text-[12px] text-white/70">
              Choose a destination and optional dates to explore available venues.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5">
              <FiSearch className="h-4 w-4 text-[#8C929F]" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-black placeholder:text-[#8C929F] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5">
              <FiCalendar className="h-4 w-4 text-[#8C929F]" />
              <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                placeholderText="Any dates"
                dateFormat="dd.MM.yyyy"
                className="w-full bg-transparent text-sm text-black placeholder:text-[#8C929F] focus:outline-none"
                calendarClassName="!bg-[#333333] !text-white border border-white/10 rounded-lg"
                popperClassName="z-50"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-2xl bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive/80"
            >
              Search stays
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="hidden bg-base py-20 text-white md:flex md:flex-col md:items-center">
      <h2 className="mb-10 text-center text-4xl font-serif md:text-5xl">
        Find your next stay
      </h2>

      <form onSubmit={handleSubmit} className="w-[90%] max-w-5xl">
        <div className="flex overflow-hidden rounded-xl bg-[#333333] text-lg text-[#D0D4DF] shadow-2xl">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 border-r border-[#555] bg-transparent px-8 py-5 placeholder:text-[#8C929F] focus:outline-none"
          />

          <div className="flex flex-1 items-center gap-3 border-r border-[#555] px-8 py-5">
            <DatePicker
              selected={date}
              onChange={(newDate) => setDate(newDate)}
              placeholderText="dd.mm.yyyy"
              dateFormat="dd.MM.yyyy"
              className="w-full bg-transparent placeholder:text-[#8C929F] focus:outline-none"
              calendarClassName="!bg-[#333333] !text-white border border-white/10 rounded-lg"
              popperClassName="z-50"
            />
            <FiCalendar className="h-5 w-5 text-white" />
          </div>

          <button
            type="submit"
            className="whitespace-nowrap bg-olive px-10 py-5 font-semibold text-white transition hover:bg-olive/80"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  )
}