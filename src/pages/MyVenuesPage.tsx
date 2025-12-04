// src/pages/MyVenuesPage.tsx
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getProfile } from "../api/profile"
import { getMyVenues, type Venue } from "../api/venues"
import MyVenueCard from "../components/MyVenueCard"

export default function MyVenuesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [venueCount, setVenueCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/my-venues")
      return
    }

    let ignore = false
    const name = user.name

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [profileRes, venuesRes] = await Promise.all([
          getProfile(name),
          getMyVenues(name),
        ])

        if (!ignore) {
          setVenueCount(profileRes._count?.venues ?? 0)
          setBookingCount(profileRes._count?.bookings ?? 0)
          setVenues(venuesRes)
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load your venues.")
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
  }, [user, navigate])

  function handleVenueDeleted(id: string) {
    setVenues((prev) => prev.filter((v) => v.id !== id))
    setVenueCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {/* Host hero card */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-section shadow-lg shadow-black/40">
          <div className="h-32 w-full bg-gradient-to-r from-emerald-800 to-emerald-600 md:h-40" />

          <div className="flex flex-col items-start justify-between gap-4 px-6 pb-6 pt-4 md:flex-row md:items-end">
            <div className="flex items-center gap-4">
              <div className="-mt-10 h-16 w-16 overflow-hidden rounded-full border-4 border-base bg-white/10 md:h-20 md:w-20">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.avatar.alt || user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Host dashboard
                </p>
                <h1 className="text-2xl font-serif md:text-3xl">
                  {user?.name}
                </h1>
                <p className="mt-1 text-xs text-white/70">
                  Manage your stays, update details and create new venues.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {venueCount} venue{venueCount === 1 ? "" : "s"}
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {bookingCount} total booking
                {bookingCount === 1 ? "" : "s"}
              </div>
              <Link
                to="/venues/new"
                className="rounded-full bg-olive px-4 py-2 text-sm font-semibold text-white hover:bg-olive/80"
              >
                Create new venue
              </Link>
            </div>
          </div>
        </section>

        {/* Errors / states */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading && !error && (
          <p className="text-sm text-white/70">Loading your venues…</p>
        )}

        {!loading && !error && venues.length === 0 && (
          <p className="text-sm text-white/70">
            You don&apos;t have any venues yet. Click{" "}
            <span className="font-semibold">“Create new venue”</span> to add
            your first stay.
          </p>
        )}

        {!loading && !error && venues.length > 0 && (
          <section className="mt-4 grid gap-6 md:grid-cols-2">
            {venues.map((venue) => (
              <MyVenueCard
                key={venue.id}
                venue={venue}
                onDeleted={handleVenueDeleted}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}