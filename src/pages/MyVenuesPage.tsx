import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getMyVenues, deleteVenue, type Venue } from "../api/venues"

export default function MyVenuesPage() {
  const { user, isVenueManager } = useAuth()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isVenueManager) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    if (!user) return

    const username = user.name
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getMyVenues(username)
        if (ignore) return
        setVenues(data)
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load venues")
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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this venue?")) return

    try {
      setDeletingId(id)
      setError(null)
      await deleteVenue(id)
      setVenues((prev) => prev.filter((v) => v.id !== id))
    } catch (err: any) {
      setError(err?.message || "Could not delete venue")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif md:text-4xl">
              My venues
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Manage the venues you host on Holidaze.
            </p>
          </div>

          <Link
            to="/venues/new"
            className="rounded-full bg-olive px-5 py-2 text-sm font-semibold text-white hover:bg-olive/80"
          >
            Create new venue
          </Link>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
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

        {!loading && venues.length === 0 && !error && (
          <p className="text-white/70">
            You do not have any venues yet. Click{" "}
            <span className="font-semibold">Create new venue</span> to
            get started.
          </p>
        )}

        {!loading && venues.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => {
              const image = venue.media?.[0]
              const locationParts = [
                venue.location?.city,
                venue.location?.country,
              ].filter(Boolean)
              const location = locationParts.join(", ")

              const bookingsCount =
                typeof venue._count?.bookings === "number"
                  ? venue._count.bookings
                  : venue.bookings?.length ?? 0

              return (
                <div
                  key={venue.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-section"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-white/5">
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={image.alt || venue.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                    {bookingsCount > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                        {bookingsCount} upcoming
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="line-clamp-1 text-lg font-semibold">
                      {venue.name}
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                      {location || "Unknown location"}
                    </p>

                    <p className="mt-2 text-sm text-white/80">
                      From{" "}
                      <span className="font-semibold">
                        ${venue.price}
                      </span>{" "}
                      / night
                    </p>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/venues/${venue.id}/edit`}
                        className="flex-1 rounded-md bg-white/10 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/20"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/venues/${venue.id}`}
                        className="flex-1 rounded-md bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/15"
                      >
                        View
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(venue.id)}
                      disabled={deletingId === venue.id}
                      className="mt-3 rounded-md bg-red-900/40 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-900/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === venue.id
                        ? "Deleting…"
                        : "Delete venue"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}