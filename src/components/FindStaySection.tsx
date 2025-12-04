import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import { FiCalendar } from "react-icons/fi"
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
  const [guests, setGuests] = useState<number | undefined>(undefined)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()

    if (location.trim()) {
      params.set("q", location.trim())
    }

    if (date) {
      // lagres i URL for evt. senere bruk
      const iso = date.toISOString().slice(0, 10)
      params.set("date", iso)
    }

    if (guests && guests > 0) {
      params.set("guests", String(guests))
    }

    const search = params.toString()
    if (search) {
      navigate(`/venues?${search}`)
    } else {
      navigate("/venues")
    }
  }

  const formContent = (
    <>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <DatePicker
          selected={date}
          onChange={(newDate) => setDate(newDate)}
          placeholderText="dd.mm.yyyy"
          dateFormat="dd.MM.yyyy"
          className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
        />

        <input
          type="number"
          min={1}
          placeholder="Guests"
          value={guests ?? ""}
          onChange={(e) => {
            const value = Number(e.target.value)
            if (Number.isNaN(value)) {
              setGuests(undefined)
            } else {
              setGuests(Math.max(1, value))
            }
          }}
          className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-olive px-6 py-3 text-base font-semibold text-white transition hover:bg-olive/80"
      >
        Search
      </button>
    </>
  )

  if (isOverlay) {
    return (
      <section className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center md:hidden">
        <div className="pointer-events-auto w-[90%] max-w-md rounded-3xl border border-white/15 bg-base/25 px-6 py-6 text-white shadow-2xl backdrop-blur-sm">
          <h2 className="mb-4 text-center text-2xl font-serif">
            Find your next stay
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            {formContent}
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

      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-5xl"
      >
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

          <input
            type="number"
            min={1}
            placeholder="Guests"
            value={guests ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (Number.isNaN(value)) {
                setGuests(undefined)
              } else {
                setGuests(Math.max(1, value))
              }
            }}
            className="flex-1 border-r border-[#555] bg-transparent px-8 py-5 placeholder:text-[#8C929F] focus:outline-none"
          />

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