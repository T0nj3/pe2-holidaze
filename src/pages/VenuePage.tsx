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

    async function load(venueId: string) {
      try {
        setLoading(true)
        setError(null)

        const data = await getVenueById(venueId)
        if (!ignore) setVenue(data)
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load venue")
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load(id)

    return () => {
      ignore = true
    }
  }, [id])

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:py-12">
        {loading && <p className="text-sm text-white/70">Loading venue…</p>}

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && !venue && (
          <p className="text-sm text-white/70">Could not find this venue.</p>
        )}

        {venue && (
          <>
            <section className="space-y-3">
              <h1 className="text-3xl font-serif md:text-4xl lg:text-5xl">
                {venue.name}
              </h1>
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                {[venue.location?.city, venue.location?.country]
                  .filter(Boolean)
                  .join(", ") || "Unknown location"}
              </p>
            </section>

            <section className="grid gap-8 md:grid-cols-[3fr,2fr]">
              <div className="space-y-4">
                <div className="h-64 w-full overflow-hidden rounded-2xl bg-white/5 md:h-80">
                  {venue.media?.[0]?.url ? (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || venue.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/40">
                      No image available
                    </div>
                  )}
                </div>

                {venue.media && venue.media.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {venue.media.slice(1, 4).map((img, index) => (
                      <div
                        key={img.url + index}
                        className="h-24 overflow-hidden rounded-xl bg-white/5"
                      >
                        {img.url && (
                          <img
                            src={img.url}
                            alt={img.alt || venue.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-6 rounded-2xl bg-section p-5 md:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      From
                    </p>
                    <p className="text-2xl font-semibold">
                      ${venue.price}
                      <span className="text-sm font-normal text-white/60">
                        {" "}
                        / night
                      </span>
                    </p>
                  </div>

                  {typeof venue.rating === "number" && (
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                        Rating
                      </p>
                      <p className="text-lg">
                        {venue.rating.toFixed(1)}{" "}
                        <span className="text-sm text-yellow-300">★</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-base/80 p-3">
                    <p className="text-white/60">Guests</p>
                    <p className="text-lg font-semibold">
                      {venue.maxGuests}
                    </p>
                  </div>
                  <div className="rounded-xl bg-base/80 p-3">
                    <p className="text-white/60">Location</p>
                    <p className="line-clamp-2">
                      {venue.location?.address || "Address not provided"}
                    </p>
                  </div>
                </div>

                {venue.meta && (
                  <div className="space-y-2 text-sm">
                    <p className="text-white/70">What this place offers</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.meta.wifi && (
                        <span className="rounded-full bg-base/80 px-3 py-1 text-xs">
                          Wi-Fi
                        </span>
                      )}
                      {venue.meta.parking && (
                        <span className="rounded-full bg-base/80 px-3 py-1 text-xs">
                          Parking
                        </span>
                      )}
                      {venue.meta.breakfast && (
                        <span className="rounded-full bg-base/80 px-3 py-1 text-xs">
                          Breakfast
                        </span>
                      )}
                      {venue.meta.pets && (
                        <span className="rounded-full bg-base/80 px-3 py-1 text-xs">
                          Pets allowed
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="mt-2 w-full rounded-md bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive/80"
                >
                  Select dates
                </button>

                {venue.owner && (
                  <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">
                      {venue.owner.avatar?.url ? (
                        <img
                          src={venue.owner.avatar.url}
                          alt={venue.owner.avatar.alt || venue.owner.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {venue.owner.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Hosted by</p>
                      <p className="text-sm">{venue.owner.name}</p>
                    </div>
                  </div>
                )}
              </aside>
            </section>

            {venue.description && (
              <section className="rounded-2xl bg-section p-5 md:p-6">
                <h2 className="mb-3 text-lg font-semibold">
                  About this place
                </h2>
                <p className="text-sm leading-relaxed text-white/80">
                  {venue.description}
                </p>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}