import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import {
  getVenueById,
  type Venue,
  type VenueBooking,
} from "../api/venues"
import { createBooking } from "../api/bookings"
import { useAuth } from "../context/AuthContext"

type DateRange = {
  checkIn: string
  checkOut: string
}

export default function VenuePage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const navigate = useNavigate()
  const { user } = useAuth()

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<DateRange & { guests: number }>({
    checkIn: "",
    checkOut: "",
    guests: 1,
  })

  const [showCalendar, setShowCalendar] = useState(false)
  const [info, setInfo] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Could not load venue."
          setError(message)
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
  const gallery = useMemo(
    () => (venue?.media ?? []).slice(1, 5),
    [venue?.media],
  )

  const location = useMemo(
    () =>
      [
        venue?.location?.city,
        venue?.location?.country,
      ]
        .filter(Boolean)
        .join(", "),
    [venue?.location?.city, venue?.location?.country],
  )

  const host = venue?.owner
  const bookings = venue?.bookings ?? []

  const hasSelection = form.checkIn && form.checkOut

  function handleGuestsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value) || 1
    const max = venue?.maxGuests ?? 1
    const safe = Math.min(Math.max(1, value), max)

    setForm((prev) => ({
      ...prev,
      guests: safe,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setInfo(null)
    setSubmitError(null)

    if (!user) {
      setSubmitError("You need to be logged in to book this stay.")
      return
    }

    if (!venue) {
      setSubmitError("Venue not loaded.")
      return
    }

    if (!form.checkIn || !form.checkOut) {
      setSubmitError("Please select both check-in and check-out.")
      return
    }

    if (form.guests < 1 || form.guests > venue.maxGuests) {
      setSubmitError(
        `Guests must be between 1 and ${venue.maxGuests}.`,
      )
      return
    }

    try {
      setSubmitting(true)

      await createBooking({
        dateFrom: form.checkIn,
        dateTo: form.checkOut,
        guests: form.guests,
        venueId: venue.id,
      })

      setInfo("Booking confirmed! It will appear on My bookings.")
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not complete booking."
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleCalendarChange(next: DateRange) {
    setForm((prev) => ({
      ...prev,
      checkIn: next.checkIn,
      checkOut: next.checkOut,
    }))

    if (next.checkIn && next.checkOut) {
      setShowCalendar(false)
    }
  }

  function formattedRange() {
    if (!form.checkIn && !form.checkOut) return "Select dates"
    if (form.checkIn && !form.checkOut) return formatDisplay(form.checkIn)
    if (form.checkIn && form.checkOut) {
      return `${formatDisplay(form.checkIn)} – ${formatDisplay(form.checkOut)}`
    }
    return "Select dates"
  }

  function formatDisplay(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {loading && (
          <div className="space-y-4">
            <div className="h-8 w-1/2 rounded bg-white/10" />
            <div className="grid gap-6 md:grid-cols-[1.6fr,1fr]">
              <div className="space-y-4">
                <div className="h-72 w-full rounded-2xl bg-white/10 md:h-96" />
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-20 rounded-xl bg-white/5"
                    />
                  ))}
                </div>
              </div>
              <div className="h-full rounded-2xl bg-section p-5">
                <div className="h-6 w-2/3 rounded bg-white/10" />
                <div className="mt-4 h-10 w-full rounded bg-white/10" />
                <div className="mt-3 h-10 w-full rounded bg-white/10" />
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && venue && (
          <div className="grid gap-10 md:grid-cols-[1.7fr,1.1fr]">
            <section>
              <div className="mb-4 overflow-hidden rounded-2xl bg-white/5">
                {mainImage?.url && (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt || venue.name}
                    className="h-72 w-full object-cover md:h-96"
                  />
                )}
              </div>

              {gallery.length > 0 && (
                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {gallery.map((img, index) => (
                    <button
                      key={`${img.url}-${index}`}
                      type="button"
                      onClick={() => {
                        if (!img.url) return
                        setVenue((prev) =>
                          prev
                            ? {
                                ...prev,
                                media: [img, ...(prev.media ?? [])],
                              }
                            : prev,
                        )
                      }}
                      className="group overflow-hidden rounded-xl bg-white/5"
                    >
                      {img.url && (
                        <img
                          src={img.url}
                          alt={img.alt || venue.name}
                          className="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105 md:h-24"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-serif md:text-4xl">
                    {venue.name}
                  </h1>
                  <p className="mt-2 text-sm text-white/70">
                    {location || "Unknown location"}
                  </p>
                </div>

                {typeof venue.rating === "number" && (
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
                    <span className="text-lg">★</span>
                    <span className="font-semibold">
                      {venue.rating.toFixed(1)}
                    </span>
                    <span className="text-white/60">/ 5</span>
                  </div>
                )}
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-white/75">
                <span>
                  Max guests:{" "}
                  <span className="font-semibold">
                    {venue.maxGuests}
                  </span>
                </span>
                {bookings.length > 0 && (
                  <span className="text-white/60">
                    {bookings.length} upcoming booking
                    {bookings.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-white/85 md:text-[0.95rem]">
                {venue.description || "No description available."}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 text-base font-semibold">
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-white/80">
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

                {host && (
                  <div>
                    <h2 className="mb-3 text-base font-semibold">
                      Hosted by
                    </h2>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/15">
                        {host.avatar?.url ? (
                          <img
                            src={host.avatar.url}
                            alt={host.avatar.alt || host.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-base font-semibold">
                            {host.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{host.name}</p>
                        {host.email && (
                          <p className="text-xs text-white/60">
                            {host.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="relative h-fit rounded-2xl bg-section/95 p-5 shadow-2xl shadow-black/40 md:p-6">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Price per night
                  </div>
                  <div className="mt-1 text-3xl font-semibold">
                    ${venue.price}
                  </div>
                </div>
                {typeof venue.rating === "number" && (
                  <div className="flex flex-col items-end text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <span>★</span>
                      <span className="font-semibold">
                        {venue.rating.toFixed(1)}
                      </span>
                      <span>/ 5</span>
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Dates</span>
                    {hasSelection && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            checkIn: "",
                            checkOut: "",
                          }))
                        }
                        className="text-xs text-white/60 underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCalendar((v) => !v)}
                      className="flex w-full items-center justify-between rounded-md border border-white/20 bg-white/5 px-3 py-2 text-left text-sm hover:border-white/40"
                    >
                      <span className="truncate text-white/90">
                        {formattedRange()}
                      </span>
                      <span className="text-xs text-white/60">
                        Open calendar
                      </span>
                    </button>

                    {showCalendar && (
                      <div className="absolute left-0 top-11 z-30 rounded-2xl border border-white/15 bg-base/95 p-3 shadow-2xl">
                        <BookingCalendar
                          bookings={bookings}
                          minDate={new Date()}
                          value={{
                            checkIn: form.checkIn,
                            checkOut: form.checkOut,
                          }}
                          onChange={handleCalendarChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Guests</span>
                    <span className="text-xs text-white/60">
                      Max {venue.maxGuests}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={venue.maxGuests}
                    value={form.guests}
                    onChange={handleGuestsChange}
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>

                {submitError && (
                  <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {submitError}
                  </div>
                )}

                {info && (
                  <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                    {info}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full rounded-md bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Booking..." : "Book now"}
                </button>

                {!user && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full text-center text-xs text-white/60 underline"
                  >
                    Log in to manage your bookings
                  </button>
                )}
              </form>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

type BookingCalendarProps = {
  bookings: VenueBooking[]
  minDate: Date
  value: DateRange
  onChange: (value: DateRange) => void
}

function BookingCalendar({
  bookings,
  minDate,
  value,
  onChange,
}: BookingCalendarProps) {
  const [month, setMonth] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const unavailable = useMemo(
    () => buildUnavailableSet(bookings),
    [bookings],
  )

  const days = useMemo<(Date | null)[]>(
    () => buildMonthDays(month),
    [month],
  )

  function handleDayClick(day: Date) {
    const iso = toISO(day)

    if (day < minDate || day < today) return
    if (unavailable.has(iso)) return

    if (!value.checkIn || (value.checkIn && value.checkOut)) {
      onChange({
        checkIn: iso,
        checkOut: "",
      })
      return
    }

    const start = new Date(value.checkIn)
    if (day <= start) {
      onChange({
        checkIn: iso,
        checkOut: "",
      })
      return
    }

    const rangeDates = expandRange(start, day)
    const overlaps = rangeDates.some((d) => unavailable.has(d))

    if (overlaps) {
      onChange({
        checkIn: iso,
        checkOut: "",
      })
      return
    }

    onChange({
      checkIn: value.checkIn,
      checkOut: iso,
    })
  }

  function prevMonth() {
    setMonth((prev) => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() - 1)
      return d
    })
  }

  function nextMonth() {
    setMonth((prev) => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + 1)
      return d
    })
  }

  const checkInDate = value.checkIn ? new Date(value.checkIn) : null
  const checkOutDate = value.checkOut ? new Date(value.checkOut) : null

  return (
    <div className="w-[280px] text-xs text-white">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-full bg-white/5 px-2 py-1 hover:bg-white/15"
        >
          ‹
        </button>
        <div className="text-sm font-semibold">
          {month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-full bg-white/5 px-2 py-1 hover:bg-white/15"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day: Date | null, index: number) => {
          if (!day) {
            return <div key={index} />
          }

          const iso = toISO(day)
          const isPast = day < minDate || day < today
          const isUnavailable = unavailable.has(iso)

          const isStart =
            !!checkInDate &&
            day.toDateString() === checkInDate.toDateString()
          const isEnd =
            !!checkOutDate &&
            day.toDateString() === checkOutDate.toDateString()

          const inRange =
            !!checkInDate &&
            !!checkOutDate &&
            day > checkInDate &&
            day < checkOutDate

          let bg = ""
          let text = "text-white"
          let ring = ""

          if (isUnavailable) {
            bg = "bg-red-900/50"
            text = "text-red-200"
          } else if (isPast) {
            text = "text-white/30"
          }

          if (inRange && !isUnavailable) {
            bg = "bg-emerald-900/40"
          }

          if (isStart || isEnd) {
            bg = "bg-emerald-500"
            text = "text-white"
            ring = "ring-2 ring-emerald-300"
          }

          const disabled = isPast || isUnavailable

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-[0.8rem]",
                bg,
                text,
                ring,
                disabled
                  ? "cursor-not-allowed"
                  : "hover:bg-white/10",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[0.65rem] text-white/60">
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
          <span>Selected stay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-red-900/70" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}

function buildMonthDays(month: Date): (Date | null)[] {
  const year = month.getFullYear()
  const m = month.getMonth()
  const firstDay = new Date(year, m, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, m + 1, 0).getDate()

  const result: (Date | null)[] = []

  for (let i = 0; i < startWeekday; i++) {
    result.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    result.push(new Date(year, m, day))
  }

  while (result.length % 7 !== 0) {
    result.push(null)
  }

  return result
}

function toISO(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function buildUnavailableSet(bookings: VenueBooking[]): Set<string> {
  const set = new Set<string>()
  for (const b of bookings) {
    const from = new Date(b.dateFrom)
    const to = new Date(b.dateTo)
    const days = expandRange(from, to)
    for (const iso of days) {
      set.add(iso)
    }
  }
  return set
}

function expandRange(from: Date, to: Date): string[] {
  const start = new Date(from)
  start.setHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setHours(0, 0, 0, 0)

  const dates: string[] = []
  let cursor = start

  while (cursor <= end) {
    dates.push(toISO(cursor))
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
  }

  return dates
}