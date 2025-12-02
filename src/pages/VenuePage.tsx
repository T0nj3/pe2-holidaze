import { useEffect, useState, FormEvent } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getVenueById, type Venue } from "../api/venues"

export default function VenuePage() {
  const { id } = useParams<{ id: string }>()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("No venue id provided.")
      setLoading(false)
      return
    }

    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getVenueById(id as string)
        if (!ignore) {
          setVenue(data)
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

    load()

    return () => {
      ignore = true
    }
  }, [id])

  const mainImage = venue?.media?.[0]
  const location = [
    venue?.location?.city,
    venue?.location?.country,
  ]
    .filter(Boolean)
    .join(", ")

  function handleBookingSubmit(e: FormEvent) {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {loading && (
          <div className="grid gap-8 md:grid-cols-[1.5fr,1fr]">
            <div className="space-y-6">
              <div className="h-72 w-full animate-pulse rounded-2xl bg-white/5 md:h-96" />
              <div className="h-8 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
              <div className="h-20 w-full animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-full animate-pulse rounded-2xl bg-section" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && venue && (
          <div className="space-y-10">
            <div className="grid gap-8 md:grid-cols-[1.5fr,1fr] md:items-start">
              <section className="space-y-6">
                <div className="overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/30">
                  {mainImage?.url && (
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt || venue.name}
                      className="h-72 w-full object-cover md:h-96"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-serif md:text-4xl">
                    {venue.name}
                  </h1>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                    {location || "Unknown location"}
                  </p>
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-white/80">
                  {venue.description ||
                    "No description available for this stay yet."}
                </p>
              </section>

              <aside className="rounded-2xl bg-section/95 p-6 shadow-xl shadow-black/40 md:p-7">
                <div className="mb-6 border-b border-white/10 pb-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                        Price per night
                      </p>
                      <p className="text-2xl font-semibold md:text-3xl">
                        ${venue.price}
                      </p>
                    </div>

                    {typeof venue.rating === "number" && (
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                        ★ {venue.rating.toFixed(1)} / 5
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-white/60">
                    Max guests:{" "}
                    <span className="font-semibold text-white/80">
                      {venue.maxGuests}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg bg-black/40 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-olive"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg bg-black/40 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-olive"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">
                        Guests
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg bg-black/40 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-olive"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">
                        Children
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded-lg bg-black/40 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-olive"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/40 transition hover:bg-olive/90"
                  >
                    Book now
                  </button>

                  <p className="pt-1 text-[11px] text-white/50">
                    Booking flow will be available in the next step of the
                    project.
                  </p>
                </form>
              </aside>
            </div>

            <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-400 text-lg font-semibold text-black">
                    {venue.owner?.avatar?.url ? (
                      <img
                        src={venue.owner.avatar.url}
                        alt={venue.owner.avatar.alt || venue.owner.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      (venue.owner?.name || "H").charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                      Hosted by
                    </p>
                    <p className="text-lg font-medium">
                      {venue.owner?.name || "Unknown host"}
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      {location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-serif">About this stay</h2>
                  <p className="text-sm leading-relaxed text-white/80">
                    {venue.description ||
                      "This host has not added further information yet. Check back later for more details about this stay, or proceed to booking when that is available."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-section/80 p-6">
                <h3 className="text-base font-semibold">Facilities</h3>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/80">
                  {venue.meta?.wifi && (
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                      <span>Wifi</span>
                    </div>
                  )}
                  {venue.meta?.parking && (
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                      <span>Parking</span>
                    </div>
                  )}
                  {venue.meta?.breakfast && (
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                      <span>Breakfast</span>
                    </div>
                  )}
                  {venue.meta?.pets && (
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                      <span>Pets allowed</span>
                    </div>
                  )}

                  {!venue.meta && (
                    <p className="col-span-2 text-sm text-white/60">
                      No facilities listed for this venue.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}