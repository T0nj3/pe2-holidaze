import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getVenueById, type Venue, type VenueBooking } from "../api/venues"
import { useAuth } from "../context/AuthContext"
import { apiFetch } from "../api/client"
import { HiArrowLeft, HiStar } from "react-icons/hi2"

type DateRange = {
  checkIn: string | null
  checkOut: string | null
}

export default function VenuePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  })
  const [guests, setGuests] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("No venue id provided.")
      setLoading(false)
      return
    }

    let ignore = false

    async function load(venueId: string) {
      try {
        setLoading(true)
        setError(null)
        const data = await getVenueById(venueId)
        if (!ignore) {
          setVenue(data)
          setGuests(Math.min(2, data.maxGuests || 1))
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load venue.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load(id)

    return () => {
      ignore = true
    }
  }, [id])

  const mainImage = venue?.media?.[0]
  const otherImages = venue?.media?.slice(1, 4) ?? []
  const location = [
    venue?.location?.city,
    venue?.location?.country,
  ]
    .filter(Boolean)
    .join(", ")

  const bookings = venue?.bookings ?? []

  async function handleBookingSubmit(e: FormEvent) {
    e.preventDefault()
    if (!venue) return

    setBookingError(null)
    setSuccessMessage(null)

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

      setSuccessMessage("Your booking is confirmed!")
      setBookingError(null)
    } catch (err: any) {
      setBookingError(err?.message || "Could not complete booking.")
      setSuccessMessage(null)
    } finally {
      setSubmitting(false)
    }
  }

  function handleGuestsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!venue) return
    const value = Number(e.target.value)
    if (Number.isNaN(value)) return
    const clamped = Math.max(1, Math.min(value, venue.maxGuests))
    setGuests(clamped)
  }

  function handleBackClick(e: MouseEvent) {
    e.preventDefault()
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate("/venues")
    }
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <button
          type="button"
          onClick={handleBackClick}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to all stays
        </button>

        {loading && (
          <p className="text-white/70">Loading venue…</p>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && venue && (
          <div className="grid gap-10 md:grid-cols-[1.6fr,1fr]">
            <section className="space-y-6">
              <div className="grid gap-3 md:grid-cols-[2fr,1.4fr]">
                <div className="overflow-hidden rounded-2xl bg-white/5">
                  {mainImage?.url ? (
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt || venue.name}
                      className="h-72 w-full object-cover md:h-[380px]"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-white/40 md:h-[380px]">
                      No image available
                    </div>
                  )}
                </div>

                <div className="hidden flex-col gap-3 md:flex">
                  {otherImages.length > 0 ? (
                    otherImages.map((img, index) => (
                      <div
                        key={index}
                        className="h-[118px] overflow-hidden rounded-xl bg-white/5"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || venue.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-xl bg-white/5 text-sm text-white/40">
                      More photos coming soon
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-serif md:text-4xl">
                    {venue.name}
                  </h1>
                  <p className="mt-1 text-sm text-white/70">
                    {location || "Unknown location"}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {typeof venue.rating === "number" && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                      <HiStar className="h-4 w-4 text-yellow-400" />
                      <span className="font-semibold">
                        {venue.rating.toFixed(1)}
                      </span>
                      <span className="text-white/60">/ 5</span>
                    </div>
                  )}
                  <span className="text-white/70">
                    Max {venue.maxGuests} guests
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold">About this stay</h2>
                <p className="text-sm leading-relaxed text-white/80">
                  {venue.description || "No description available for this venue yet."}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Amenities</h2>
                <div className="flex flex-wrap gap-2 text-xs text-white/75">
                  {venue.meta?.wifi && (
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Wifi
                    </span>
                  )}
                  {venue.meta?.parking && (
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Parking
                    </span>
                  )}
                  {venue.meta?.breakfast && (
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Breakfast
                    </span>
                  )}
                  {venue.meta?.pets && (
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Pets allowed
                    </span>
                  )}
                  {!venue.meta && (
                    <span className="text-white/60">
                      No amenities listed.
                    </span>
                  )}
                </div>
              </div>
            </section>

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
                    <p className="text-2xl font-semibold">
                      ${venue.price}
                    </p>
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
                  <label className="text-sm font-medium text-white">
                    Guests
                  </label>
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

                {successMessage && (
                  <div className="rounded-md border border-emerald-500/40 bg-emerald-900/40 px-3 py-2 text-xs text-emerald-100">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !dateRange.checkIn ||
                    !dateRange.checkOut
                  }
                  className="mt-1 w-full rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {user
                    ? submitting
                      ? "Booking…"
                      : "Book this stay"
                    : "Log in to book"}
                </button>
              </form>

              {venue.owner && (
                <div className="flex items-center gap-3 rounded-2xl bg-section p-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10">
                    {venue.owner.avatar?.url ? (
                      <img
                        src={venue.owner.avatar.url}
                        alt={venue.owner.avatar.alt || venue.owner.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
                        {venue.owner.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Hosted by
                    </p>
                    <Link
                      to={`/host/${encodeURIComponent(venue.owner.name)}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {venue.owner.name}
                    </Link>
                    <p className="text-xs text-white/60">
                      View host profile and more stays.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
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
      for (
        let d = new Date(start);
        d <= end;
        d = addDays(d, 1)
      ) {
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
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const startWeekday = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay()

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
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
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
          const isDisabled = day.isPast || day.isBooked || !day.inCurrentMonth

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