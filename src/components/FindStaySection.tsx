import { useState } from "react"
import DatePicker from "react-datepicker"
import { FiCalendar } from "react-icons/fi"
import "react-datepicker/dist/react-datepicker.css"

type FindStaySectionProps = {
  variant?: "section" | "overlay"
}

export default function FindStaySection({ variant = "section" }: FindStaySectionProps) {
  const isOverlay = variant === "overlay"
  const [date, setDate] = useState<Date | null>(null)

  const formContent = (
    <>
      <input
        type="text"
        placeholder="Location"
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
          placeholder="Guests"
          className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
        />
      </div>

      <button className="w-full rounded-md bg-olive px-6 py-3 text-base font-semibold text-white hover:bg-olive/80 transition">
        Search
      </button>
    </>
  )

  if (isOverlay) {
    return (
      <section className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center md:hidden">
        <div className="pointer-events-auto w-[90%] max-w-md rounded-3xl bg-base/25 backdrop-blur-sm border border-white/15 px-6 py-6 text-white shadow-2xl">
          <h2 className="mb-4 text-2xl font-serif text-center">Find your next stay</h2>

          <div className="flex flex-col gap-3">{formContent}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="hidden bg-base text-white py-20 md:flex md:flex-col md:items-center">
      <h2 className="mb-10 text-center text-4xl font-serif md:text-5xl">
        Find your next stay
      </h2>

      <div className="w-[90%] max-w-5xl">
        <div className="flex overflow-hidden rounded-xl bg-[#333333] text-lg text-[#D0D4DF] shadow-2xl">
          <input
            type="text"
            placeholder="Location"
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
            placeholder="Guests"
            className="flex-1 border-r border-[#555] bg-transparent px-8 py-5 placeholder:text-[#8C929F] focus:outline-none"
          />

          <button className="bg-olive px-10 py-5 font-semibold text-white hover:bg-olive/80 transition whitespace-nowrap">
            Search
          </button>
        </div>
      </div>
    </section>
  )
}