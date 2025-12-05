import {
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react"
import { useNavigate } from "react-router-dom"
import type { Venue, VenueBooking } from "../api/venues"
import { apiFetch } from "../api/client"
import { useAuth } from "../context/AuthContext"
import { HiStar } from "react-icons/hi2"

type DateRange = {
  checkIn: string | null
  checkOut: string | null
}

type Props = {
  venue: Venue
  bookings: VenueBooking[]
}

export default function VenueBookingCard({ venue, bookings }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  })
  const [guests, setGuests] = useState(Math.min(2, venue.maxGuests || 1))
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  async function handleBookingSubmit(e: FormEvent) {
    e.preventDefault()

    setBookingError(null)

    if (!user) {
      setBookingError("You must be logged in to book this stay.")
      navigate(`/login?redirect=/venue/${venue.id}`)
      return
    }

    if (!dateRange.checkIn || !dateRange.checkOut) {
      setBookingError("Please select check-in and check-out dates.")
      return
    }

    try {
      setSubmitting(true)

      const body = {
        dateFrom: dateRange.checkIn,
        dateTo: dateRange.checkOut,
        guests,
        venueId: venue.id,
      }

      await apiFetch<unknown>("/holidaze/bookings", {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      })

      navigate("/bookings", {
        state: {
          fromBooking: true,
          lastBooking: {
            venueName: venue.name,
            dateFrom: dateRange.checkIn,
            dateTo: dateRange.checkOut,
            guests,
          },
        },
      })
    } catch (err: any) {
      setBookingError(err?.message || "Could not complete booking.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleGuestsChange(e: ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value)
    if (Number.isNaN(value)) return
    const clamped = Math.max(1, Math.min(value, venue.maxGuests))
    setGuests(clamped)
  }

  return (
    <section className="space-y-6">
      <form
        onSubmit={handleBookingSubmit}
        className="space-y-5 rounded-2xl bg-section p-5 shadow-lg shadow-black/30"
      >
        <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Price per night
            </p>
            <p className="text-2xl font-semibold">${venue.price}</p>
          </div>

          {typeof venue.rating === "number" && (
            <div className="flex items-center gap-1 text-sm text-white/80">
              <HiStar className="h-4 w-4 text-yellow-400" />
              <span>{venue.rating.toFixed(1)}</span>
              <span className="text-white/50">/ 5</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Choose dates</p>
          <p className="text-xs text-white/65">
            Select your check-in and check-out dates in the calendar below.
            Booked dates are shown in red.
          </p>
        </div>

        <BookingCalendar
          bookings={bookings}
          value={dateRange}
          onChange={setDateRange}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Guests</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={venue.maxGuests}
              value={guests}
              onChange={handleGuestsChange}
              className="w-20 rounded-md bg-white/10 px-3 py-2 text-sm focus:outline-none"
            />
            <span className="text-xs text-white/60">
              Max {venue.maxGuests} guests
            </span>
          </div>
        </div>

        {bookingError && (
          <div className="rounded-md border border-red-500/40 bg-red-900/40 px-3 py-2 text-xs text-red-100">
            {bookingError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !dateRange.checkIn || !dateRange.checkOut}
          className="mt-1 w-full rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {user
            ? submitting
              ? "Booking…"
              : "Book this stay"
            : "Log in to book"}
        </button>
      </form>
    </section>
  )
}

type BookingCalendarProps = {
  bookings: VenueBooking[]
  value: DateRange
  onChange: (value: DateRange) => void
}

type CalendarDay = {
  date: Date
  key: string
  inCurrentMonth: boolean
  isPast: boolean
  isBooked: boolean
  isInRange: boolean
  isStart: boolean
  isEnd: boolean
}

function formatKey(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date.getTime())
  copy.setDate(copy.getDate() + amount)
  return copy
}

function parseISO(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map((p) => Number(p))
  return new Date(y, m - 1, d)
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function buildBookedSet(bookings: VenueBooking[]): Set<string> {
  const set = new Set<string>()
  for (const booking of bookings) {
    try {
      const start = normalizeDate(parseISO(booking.dateFrom.split("T")[0]))
      const end = normalizeDate(parseISO(booking.dateTo.split("T")[0]))
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        set.add(formatKey(d))
      }
    } catch {
      continue
    }
  }
  return set
}

function BookingCalendar({
  bookings,
  value,
  onChange,
}: BookingCalendarProps) {
  const [month, setMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const today = useMemo(() => normalizeDate(new Date()), [])

  const bookedSet = useMemo(
    () => buildBookedSet(bookings),
    [bookings],
  )

  const range = useMemo(() => {
    if (!value.checkIn || !value.checkOut) return null
    const start = normalizeDate(parseISO(value.checkIn))
    const end = normalizeDate(parseISO(value.checkOut))
    if (end < start) return null
    return { start, end }
  }, [value.checkIn, value.checkOut])

  const days = useMemo<CalendarDay[]>(() => {
    const firstOfMonth = new Date(
      month.getFullYear(),
      month.getMonth(),
      1,
    )
    const startWeekday =
      firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay()

    const calendarStart = addDays(firstOfMonth, -((startWeekday - 1) % 7))

    const cells: CalendarDay[] = []
    for (let i = 0; i < 42; i++) {
      const date = addDays(calendarStart, i)
      const normalized = normalizeDate(date)
      const key = formatKey(normalized)
      const inCurrentMonth = date.getMonth() === month.getMonth()
      const isPast = normalized < today
      const isBooked = bookedSet.has(key)

      const isInRange =
        !!range &&
        normalized >= range.start &&
        normalized <= range.end

      const isStart =
        !!range &&
        normalized.getTime() === range.start.getTime()

      const isEnd =
        !!range &&
        normalized.getTime() === range.end.getTime()

      cells.push({
        date: normalized,
        key,
        inCurrentMonth,
        isPast,
        isBooked,
        isInRange,
        isStart,
        isEnd,
      })
    }

    return cells
  }, [month, today, bookedSet, range])

  function handleDayClick(day: CalendarDay) {
    if (day.isPast || day.isBooked) return

    const iso = day.key

    if (!value.checkIn || (value.checkIn && value.checkOut)) {
      onChange({ checkIn: iso, checkOut: null })
      return
    }

    const start = parseISO(value.checkIn)
    const end = parseISO(iso)

    if (end <= start) {
      onChange({ checkIn: iso, checkOut: value.checkIn })
    } else {
      onChange({ checkIn: value.checkIn, checkOut: iso })
    }
  }

  function changeMonth(offset: number) {
    setMonth((prev) => {
      const next = new Date(
        prev.getFullYear(),
        prev.getMonth() + offset,
        1,
      )
      return next
    })
  }

  const monthLabel = month.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  })

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  return (
    <div className="rounded-xl bg-base/60 p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-full bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
        >
          ←
        </button>
        <span className="font-medium">{monthLabel}</span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-full bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
        >
          →
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-white/50">
        {weekDays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => {
          const isSelectedStart = day.isStart
          const isSelectedEnd = day.isEnd
          const isInRange = day.isInRange
          const isDisabled =
            day.isPast || day.isBooked || !day.inCurrentMonth

          let bgClass = ""
          let textClass = ""
          let ringClass = ""

          if (day.isBooked) {
            bgClass = "bg-red-900/60"
            textClass = "text-red-200"
          } else if (isSelectedStart || isSelectedEnd) {
            bgClass = "bg-olive"
            textClass = "text-white"
            ringClass = "ring-2 ring-white"
          } else if (isInRange) {
            bgClass = "bg-olive/40"
            textClass = "text-white"
          } else if (!day.inCurrentMonth) {
            bgClass = "bg-white/5"
            textClass = "text-white/30"
          } else {
            bgClass = "bg-white/5"
            textClass = "text-white/80"
          }

          return (
            <button
              key={day.key}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(day)}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${bgClass} ${textClass} ${ringClass} disabled:cursor-not-allowed disabled:opacity-40 hover:bg-olive/60 hover:text-white transition`}
            >
              {day.date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-white/50">
        <div className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-olive" />
          <span>Selected range</span>
        </div>
        <div className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-red-900/60" />
          <span>Booked</span>
        </div>
        <div className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span>Available</span>
        </div>
      </div>
    </div>
  )
}