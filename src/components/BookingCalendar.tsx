import { useMemo, useState } from "react"
import type { VenueBooking } from "../api/venues"

type BookingCalendarValue = {
  checkIn: string
  checkOut: string
}

type BookingCalendarProps = {
  bookings: VenueBooking[]
  minDate: Date
  value: BookingCalendarValue
  onChange: (value: BookingCalendarValue) => void
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function toLocalISO(date: Date) {
  const d = startOfDay(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBetween(date: Date, start: Date, end: Date) {
  const t = date.getTime()
  return t > start.getTime() && t < end.getTime()
}

function hasBookingInRange(start: Date, end: Date, bookings: VenueBooking[]) {
  const s = start.getTime()
  const e = end.getTime()
  return bookings.some((b) => {
    const from = startOfDay(new Date(b.dateFrom)).getTime()
    const to = startOfDay(new Date(b.dateTo)).getTime()
    return from < e && to > s
  })
}

function isBooked(date: Date, bookings: VenueBooking[]) {
  if (!bookings.length) return false
  const t = startOfDay(date).getTime()
  return bookings.some((b) => {
    const from = startOfDay(new Date(b.dateFrom)).getTime()
    const to = startOfDay(new Date(b.dateTo)).getTime()
    return t >= from && t < to
  })
}

export default function BookingCalendar({
  bookings,
  minDate,
  value,
  onChange,
}: BookingCalendarProps) {
  const today = startOfDay(minDate)

  const initialMonth = value.checkIn
    ? (() => {
        const [y, m, d] = value.checkIn.split("-").map(Number)
        return new Date(y, (m || 1) - 1, d || 1)
      })()
    : today

  const [month, setMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  )

  const days = useMemo(() => {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7
    const startGrid = new Date(firstOfMonth)
    startGrid.setDate(firstOfMonth.getDate() - firstWeekday)

    return Array.from({ length: 42 }).map((_, index) => {
      const d = new Date(startGrid)
      d.setDate(startGrid.getDate() + index)
      return d
    })
  }, [month])

  const checkInDate = value.checkIn
    ? (() => {
        const [y, m, d] = value.checkIn.split("-").map(Number)
        return startOfDay(new Date(y, (m || 1) - 1, d || 1))
      })()
    : null

  const checkOutDate = value.checkOut
    ? (() => {
        const [y, m, d] = value.checkOut.split("-").map(Number)
        return startOfDay(new Date(y, (m || 1) - 1, d || 1))
      })()
    : null

  function handleDayClick(date: Date) {
    const day = startOfDay(date)
    if (day < today) return
    if (isBooked(day, bookings)) return

    const iso = toLocalISO(day)

    if (!checkInDate || (checkInDate && checkOutDate)) {
      onChange({ checkIn: iso, checkOut: "" })
      return
    }

    if (day.getTime() <= checkInDate.getTime()) {
      onChange({ checkIn: iso, checkOut: "" })
      return
    }

    if (hasBookingInRange(checkInDate, day, bookings)) {
      onChange({ checkIn: iso, checkOut: "" })
      return
    }

    onChange({ checkIn: value.checkIn, checkOut: iso })
  }

  function goToPreviousMonth() {
    setMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    )
  }

  function goToNextMonth() {
    setMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    )
  }

  return (
    <div className="text-xs text-white">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="rounded-full bg-white/5 px-2 py-1 hover:bg-white/10"
        >
          ‹
        </button>
        <div className="text-sm font-medium">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </div>
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-full bg-white/5 px-2 py-1 hover:bg-white/10"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-[11px] text-white/60">
        {weekdayNames.map((day) => (
          <div
            key={day}
            className="flex h-6 items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-[11px]">
        {days.map((date) => {
          const inCurrentMonth =
            date.getMonth() === month.getMonth()
          const isPast = startOfDay(date) < today
          const booked = isBooked(date, bookings)

          const isSelectedStart =
            checkInDate && isSameDay(date, checkInDate)
          const isSelectedEnd =
            checkOutDate && isSameDay(date, checkOutDate)

          const inSelectedRange =
            checkInDate &&
            checkOutDate &&
            isBetween(date, checkInDate, checkOutDate)

          const disabled = isPast || booked

          let base =
            "flex h-8 items-center justify-center rounded-md border text-xs transition "

          if (!inCurrentMonth) {
            base += "opacity-40 "
          }

          if (disabled) {
            base +=
              "cursor-not-allowed border-red-500/40 bg-red-700/70 text-red-100 "
          } else if (isSelectedStart || isSelectedEnd || inSelectedRange) {
            base +=
              "cursor-pointer border-olive bg-olive text-white "
          } else {
            base +=
              "cursor-pointer border-emerald-500/40 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-700/80 "
          }

          return (
            <button
              key={date.getTime()}
              type="button"
              onClick={() => handleDayClick(date)}
              className={base}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-white/55">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded border border-emerald-400 bg-emerald-700/80" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded border border-red-400 bg-red-700/80" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}