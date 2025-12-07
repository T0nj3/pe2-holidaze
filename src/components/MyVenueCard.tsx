import { useState } from "react"
import { Link } from "react-router-dom"
import { HiStar, HiPencil, HiTrash } from "react-icons/hi2"
import type { Venue, VenueBooking } from "../api/venues"
import { deleteVenue } from "../api/venues"

type Props = {
  venue: Venue
  onDeleted: (id: string) => void
}

function getUpcomingBookings(bookings: VenueBooking[] | undefined): VenueBooking[] {
  if (!bookings || bookings.length === 0) return []
  const now = new Date()
  return bookings
    .filter((booking) => {
      const to = new Date(booking.dateTo)
      return to >= now
    })
    .sort((a, b) => {
      return new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
    })
}

function formatDateRange(from: string, to: string): string {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  const sameMonth = fromDate.getMonth() === toDate.getMonth()
  const sameYear = fromDate.getFullYear() === toDate.getFullYear()

  const fromDay = fromDate.getDate()
  const toDay = toDate.getDate()
  const month = fromDate.toLocaleString("en-GB", { month: "short" })
  const year = fromDate.getFullYear()

  if (sameMonth && sameYear) {
    return `${fromDay}–${toDay} ${month} ${year}`
  }

  const fromStr = fromDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const toStr = toDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return `${fromStr} – ${toStr}`
}

function getCustomerInitial(name?: string | null) {
  if (!name || !name.trim()) return "G"
  return name.trim().charAt(0).toUpperCase()
}

export default function MyVenueCard({ venue, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const image = venue.media?.[0]
  const location = [
    venue.location?.city,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(", ")

  const upcomingBookings = getUpcomingBookings(venue.bookings)

  async function handleDelete() {
    if (deleting) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this venue? This action cannot be undone.",
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError(null)
      await deleteVenue(venue.id)
      onDeleted(venue.id)
    } catch (err: any) {
      setError(err?.message || "Could not delete this venue.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-section shadow-md shadow-black/30">
      <div className="relative h-56 w-full overflow-hidden bg-white/5">
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || venue.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
            No image yet
          </div>
        )}

        {venue._count?.bookings && venue._count.bookings > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-emerald-300">
            {venue._count.bookings} booking
            {venue._count.bookings > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold">
              {venue.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
              {location || "Unknown location"}
            </p>
          </div>

          {typeof venue.rating === "number" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-white">
              <HiStar className="h-4 w-4 text-yellow-400" />
              <span>{venue.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="mt-1 text-xs text-white/65">
          From{" "}
          <span className="font-semibold">
            ${venue.price}
          </span>{" "}
          / night · Max {venue.maxGuests} guests
        </p>

        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/60">
            <span>Upcoming bookings</span>
            {upcomingBookings.length > 0 && (
              <span>{upcomingBookings.length}</span>
            )}
          </div>

          {upcomingBookings.length === 0 ? (
            <p className="text-[11px] text-white/45">
              No upcoming bookings for this venue.
            </p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {upcomingBookings.slice(0, 3).map((booking) => {
                const customer = booking.customer
                const customerName = customer?.name || "Guest"
                const avatarUrl = customer?.avatar?.url || null

                return (
                  <li
                    key={booking.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {formatDateRange(booking.dateFrom, booking.dateTo)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/65">
                        {booking.guests} guest
                        {booking.guests !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 overflow-hidden rounded-full bg-white/10 text-[11px] font-semibold text-white/80 flex items-center justify-center">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={customerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{getCustomerInitial(customerName)}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-white/90">
                          Booked by {customerName}
                        </p>
                        {customer?.email && (
                          <p className="max-w-[140px] truncate text-[10px] text-white/60">
                            {customer.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="mt-4 pt-2">
          {error && (
            <p className="mb-3 rounded-md border border-red-500/40 bg-red-900/40 px-3 py-2 text-[11px] text-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Link
              to={`/venues/${venue.id}`}
              className="flex-1 rounded-full bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white/15"
            >
              View
            </Link>

            <Link
              to={`/venues/${venue.id}/edit`}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-olive px-4 py-2 text-sm font-semibold text-white hover:bg-olive/80"
            >
              <HiPencil className="h-4 w-4" />
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-1 rounded-full bg-red-700/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiTrash className="h-4 w-4" />
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}