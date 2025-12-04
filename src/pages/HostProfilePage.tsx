import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getProfile, type Profile } from "../api/profile"
import { getMyVenues, type Venue } from "../api/venues"

type HostProfileState = {
  host: Profile | null
  venues: Venue[]
  loading: boolean
  error: string | null
}

export default function HostProfilePage() {
  const { name } = useParams<{ name: string }>()
  const [state, setState] = useState<HostProfileState>({
    host: null,
    venues: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!name) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "No host name provided.",
      }))
      return
    }

    let ignore = false
    const hostName = decodeURIComponent(name)

    async function load() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const [profileRes, venuesRes] = await Promise.all([
          getProfile(hostName),
          getMyVenues(hostName),
        ])

        if (ignore) return

        setState({
          host: profileRes,
          venues: venuesRes,
          loading: false,
          error: null,
        })
      } catch (err: any) {
        if (ignore) return
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || "Could not load host profile.",
        }))
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [name])

  const { host, venues, loading, error } = state
  const venueCount = venues.length

  return (
    <div className="flex min-h-screen flex-col bg-base text-white">
      <Header variant="default" />

      <main className="flex-1 w-full bg-base px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
          {loading && (
            <p className="text-sm text-white/70">Loading host profile…</p>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {!loading && !error && host && (
            <>
              <HostProfileHero host={host} venueCount={venueCount} />
              <HostVenuesGrid venues={venues} />
            </>
          )}

          {!loading && !error && !host && (
            <p className="text-sm text-white/70">
              Host not found.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

type HostProfileHeroProps = {
  host: Profile
  venueCount: number
}

function HostProfileHero({ host, venueCount }: HostProfileHeroProps) {
  const bannerUrl = host.banner?.url
  const avatarUrl = host.avatar?.url
  const initials = host.name.charAt(0).toUpperCase()

  return (
    <section className="overflow-hidden rounded-3xl bg-section shadow-lg shadow-black/40">
      <div className="relative h-40 w-full md:h-52">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={host.banner?.alt || `${host.name} banner`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-emerald-800 to-emerald-600" />
        )}

        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="flex flex-col gap-4 px-6 pb-6 pt-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <div className="-mt-12 h-20 w-20 overflow-hidden rounded-full border-4 border-base bg-white/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={host.avatar?.alt || host.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                {initials}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Verified host
            </p>
            <h1 className="text-2xl font-serif md:text-3xl">
              {host.name}
            </h1>
            <p className="mt-1 text-xs text-white/70">
              {host.bio ||
                "This host has not added a bio yet, but they are ready to welcome you."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            {venueCount} active stay{venueCount === 1 ? "" : "s"}
          </div>
          {typeof host._count?.bookings === "number" && (
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              {host._count.bookings} total booking
              {host._count.bookings === 1 ? "" : "s"}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

type HostVenuesGridProps = {
  venues: Venue[]
}

function HostVenuesGrid({ venues }: HostVenuesGridProps) {
  if (venues.length === 0) {
    return (
      <section className="rounded-2xl bg-section px-5 py-6 text-center text-sm text-white/75">
        This host does not have any published venues yet.
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white md:text-xl">
          Stays hosted by this profile
        </h2>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => {
          const image = venue.media?.[0]
          const location = [
            venue.location?.city,
            venue.location?.country,
          ]
            .filter(Boolean)
            .join(", ")

          return (
            <Link
              key={venue.id}
              to={`/venues/${venue.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-section transition hover:border-white/30"
            >
              <div className="relative h-44 w-full overflow-hidden bg-white/5">
                {image?.url && (
                  <img
                    src={image.url}
                    alt={image.alt || venue.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-base font-semibold">
                  {venue.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                  {location || "Unknown location"}
                </p>

                <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                  <span>
                    From{" "}
                    <span className="font-semibold">
                      ${venue.price}
                    </span>{" "}
                    / night
                  </span>

                  {typeof venue.rating === "number" && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                      ★ {venue.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}