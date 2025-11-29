import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getVenueById, type Venue } from "../api/venues"

export default function VenuePage() {
  const { id } = useParams<{ id: string }>()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getVenueById(id!)
        if (!ignore) setVenue(data)
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load venue")
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [id])

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-6">
        {loading && (
          <p className="text-center text-sm text-white/70">Loading venue…</p>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {venue && (
          <>
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-serif md:text-4xl">{venue.name}</h1>
                <p className="mt-2 text-sm text-white/70">
                  {venue.location.city && venue.location.country
                    ? `${venue.location.city}, ${venue.location.country}`
                    : venue.location.city || venue.location.country || "Location unknown"}
                </p>
              </div>
              <div className="text-right text-sm text-white/80">
                <p className="text-lg">
                  <span className="font-semibold">{venue.rating.toFixed(1)}</span> / 5
                </p>
                <p className="text-white/60">
                  {venue._count?.bookings ?? 0} bookings
                </p>
              </div>
            </header>

            {venue.media[0]?.url && (
              <div className="overflow-hidden rounded-3xl bg-section">
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt || venue.name}
                  className="h-80 w-full object-cover md:h-[26rem]"
                />
              </div>
            )}

            <section className="grid gap-8 md:grid-cols-[2fr,1fr]">
              <div>
                <h2 className="mb-3 text-xl font-semibold">About this stay</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/80">
                  {venue.description}
                </p>
              </div>

              <aside className="space-y-3 rounded-2xl bg-section px-5 py-4">
                <p className="text-lg font-semibold">
                  {venue.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}{" "}
                  <span className="text-sm text-white/60">per night</span>
                </p>
                <button className="mt-2 w-full rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white hover:bg-olive/80">
                  Book this stay
                </button>
              </aside>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}