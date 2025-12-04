import {
  useEffect,
  useState,
  type MouseEvent,
} from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getVenues, type Venue } from "../api/venues"
import { useFavorites } from "../context/FavoritesContext"
import { useAuth } from "../context/AuthContext"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2"
import VenueSearchBar from "../components/VenueSearchBar"
import VenueFiltersBar from "../components/VenueFiltersBar"

const PAGE_SIZE = 12

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const currentQuery = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(currentQuery)

  const [wifi, setWifi] = useState(false)
  const [parking, setParking] = useState(false)
  const [breakfast, setBreakfast] = useState(false)
  const [pets, setPets] = useState(false)

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setSearchInput(currentQuery)
  }, [currentQuery])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        setVisibleCount(PAGE_SIZE)

        const trimmed = currentQuery.trim()

        const data = await getVenues(
          trimmed
            ? { search: trimmed, limit: 100 }
            : { limit: 100 },
        )

        if (!ignore) {
          setVenues(data)
        }
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
  }, [currentQuery])

  function handleSearchSubmit() {
    const trimmed = searchInput.trim()

    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  function handleHeartClick(e: MouseEvent, venue: Venue) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate("/login")
      return
    }

    toggleFavorite(venue)
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }

  const normalizedQuery = currentQuery.trim().toLowerCase()

  const filteredVenues = venues.filter((venue) => {
    if (wifi && !venue.meta?.wifi) return false
    if (parking && !venue.meta?.parking) return false
    if (breakfast && !venue.meta?.breakfast) return false
    if (pets && !venue.meta?.pets) return false

    if (normalizedQuery) {
      const name = venue.name.toLowerCase()
      const city = venue.location?.city?.toLowerCase() || ""
      const country = venue.location?.country?.toLowerCase() || ""
      const combined = `${name} ${city} ${country}`
      if (!combined.includes(normalizedQuery)) return false
    }

    return true
  })

  const visibleVenues = filteredVenues.slice(0, visibleCount)
  const canLoadMore = visibleCount < filteredVenues.length

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-serif md:text-4xl">
              All stays
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Browse all available venues and find your next stay.
            </p>
          </div>

          <VenueSearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
          />
        </header>

        <VenueFiltersBar
          wifi={wifi}
          parking={parking}
          breakfast={breakfast}
          pets={pets}
          onToggleWifi={() => setWifi((v) => !v)}
          onToggleParking={() => setParking((v) => !v)}
          onToggleBreakfast={() => setBreakfast((v) => !v)}
          onTogglePets={() => setPets((v) => !v)}
          onClear={() => {
            setWifi(false)
            setParking(false)
            setBreakfast(false)
            setPets(false)
          }}
        />

        {filteredVenues.length > 0 && (
          <p className="mb-6 text-xs text-white/55">
            Showing {visibleVenues.length} of {filteredVenues.length} stays
            {normalizedQuery && (
              <>
                {" "}
                for <span className="font-semibold">"{currentQuery}"</span>
              </>
            )}
          </p>
        )}

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
                className="animate-pulse overflow-hidden rounded-2xl bg-section p-4"
              >
                <div className="mb-4 h-40 w-full rounded-xl bg-white/10" />
                <div className="h-4 w-3/4 rounded bg-white/15" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredVenues.length === 0 && !error && (
          <p className="text-white/70">
            No venues found. Try a different search or filter.
          </p>
        )}

        {!loading && filteredVenues.length > 0 && (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visibleVenues.map((venue) => {
                const image = venue.media?.[0]
                const locationParts = [
                  venue.location?.city,
                  venue.location?.country,
                ].filter(Boolean)
                const location = locationParts.join(", ")
                const favorite = isFavorite(venue.id)

                return (
                  <Link
                    key={venue.id}
                    to={`/venues/${venue.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-section transition hover:border-white/30"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-white/5">
                      {image?.url && (
                        <img
                          src={image.url}
                          alt={image.alt || venue.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleHeartClick(e, venue)}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                      >
                        {favorite ? (
                          <HiHeart className="h-5 w-5 text-rose-400" />
                        ) : (
                          <HiOutlineHeart className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h2 className="line-clamp-1 text-lg font-semibold">
                        {venue.name}
                      </h2>
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

                      <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-white/65">
                        {venue.meta?.wifi && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5">
                            Wifi
                          </span>
                        )}
                        {venue.meta?.parking && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5">
                            Parking
                          </span>
                        )}
                        {venue.meta?.breakfast && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5">
                            Breakfast
                          </span>
                        )}
                        {venue.meta?.pets && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5">
                            Pets allowed
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}