import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getMyBookings, type ProfileBooking } from "../api/profile"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function isPastBooking(booking: ProfileBooking) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(booking.dateTo)
  end.setHours(0, 0, 0, 0)
  return end < today
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<ProfileBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setError("You must be logged in to view your bookings.")
      setLoading(false)
      return
    }

    const profileName = user.name

    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const data = await getMyBookings(profileName)

        if (!ignore) {
          setBookings(data)
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load your bookings.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [user])

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => !isPastBooking(b))
        .sort(
          (a, b) =>
            new Date(a.dateFrom).getTime() -
            new Date(b.dateFrom).getTime(),
        ),
    [bookings],
  )

  const past = useMemo(
    () =>
      bookings
        .filter((b) => isPastBooking(b))
        .sort(
          (a, b) =>
            new Date(b.dateFrom).getTime() -
            new Date(a.dateFrom).getTime(),
        ),
    [bookings],
  )

  const hasAny = bookings.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl flex-1 px-4 py-10 md:py-14">
        {!user && (
          <div className="mx-auto max-w-md rounded-2xl bg-section px-5 py-6 text-center">
            <h1 className="text-2xl font-serif">My bookings</h1>
            <p className="mt-3 text-sm text-white/70">
              You need to be logged in to see your bookings.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-5 w-full rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive/80"
            >
              Log in
            </button>
          </div>
        )}

        {user && (
          <>
            <header className="mb-8 md:mb-10">
              <h1 className="text-3xl font-serif md:text-4xl">
                My bookings
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Upcoming stays booked with your account.
              </p>
            </header>

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl bg-section p-4"
                  >
                    <div className="mb-4 h-40 w-full rounded-xl bg-white/10" />
                    <div className="h-4 w-3/4 rounded bg-white/15" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="mb-6 rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            {!loading && !error && user && !hasAny && (
              <div className="rounded-2xl bg-section px-5 py-6 text-center">
                <p className="text-sm text-white/75">
                  You don&apos;t have any bookings yet.
                </p>
                <Link
                  to="/venues"
                  className="mt-4 inline-flex rounded-full bg-olive px-6 py-2 text-sm font-semibold text-white hover:bg-olive/80"
                >
                  Browse stays
                </Link>
              </div>
            )}

            {!loading && !error && hasAny && (
              <div className="space-y-10">
                {upcoming.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-semibold text-white">
                      Upcoming
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {upcoming.map((booking) => {
                        const venue = booking.venue
                        const image = venue?.media?.[0]
                        const location = [
                          venue?.location?.city,
                          venue?.location?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")

                        return (
                          <Link
                            key={booking.id}
                            to={
                              venue
                                ? `/venues/${venue.id}`
                                : "/venues"
                            }
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-section transition hover:border-white/30"
                          >
                            <div className="relative h-40 w-full overflow-hidden bg-white/5 md:h-48">
                              {image?.url && (
                                <img
                                  src={image.url}
                                  alt={
                                    image.alt ||
                                    venue?.name ||
                                    "Venue image"
                                  }
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                              <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2 py-0.5 text-xs font-semibold text-emerald-950">
                                Upcoming
                              </span>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                              <h3 className="line-clamp-1 text-base font-semibold">
                                {venue?.name || "Unknown venue"}
                              </h3>
                              <p className="mt-1 text-sm text-white/60">
                                {location || "Unknown location"}
                              </p>

                              <p className="mt-3 text-sm text-white/75">
                                {formatDate(booking.dateFrom)} –{" "}
                                {formatDate(booking.dateTo)}
                              </p>

                              <p className="mt-1 text-sm text-white/65">
                                Guests:{" "}
                                <span className="font-medium">
                                  {booking.guests}
                                </span>
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                )}

                {past.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-semibold text-white/80">
                      Past stays
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {past.map((booking) => {
                        const venue = booking.venue
                        const image = venue?.media?.[0]
                        const location = [
                          venue?.location?.city,
                          venue?.location?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")

                        return (
                          <Link
                            key={booking.id}
                            to={
                              venue
                                ? `/venues/${venue.id}`
                                : "/venues"
                            }
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-section/80 opacity-80 transition hover:border-white/30 hover:opacity-100"
                          >
                            <div className="relative h-40 w-full overflow-hidden bg-white/5 md:h-48">
                              {image?.url && (
                                <img
                                  src={image.url}
                                  alt={
                                    image.alt ||
                                    venue?.name ||
                                    "Venue image"
                                  }
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                              <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-black/80">
                                Past stay
                              </span>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                              <h3 className="line-clamp-1 text-base font-semibold">
                                {venue?.name || "Unknown venue"}
                              </h3>
                              <p className="mt-1 text-sm text-white/60">
                                {location || "Unknown location"}
                              </p>

                              <p className="mt-3 text-sm text-white/75">
                                {formatDate(booking.dateFrom)} –{" "}
                                {formatDate(booking.dateTo)}
                              </p>

                              <p className="mt-1 text-sm text-white/65">
                                Guests:{" "}
                                <span className="font-medium">
                                  {booking.guests}
                                </span>
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}