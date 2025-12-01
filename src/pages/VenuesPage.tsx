import {
  useEffect,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getVenues, type Venue } from "../api/venues"
import { useFavorites } from "../context/FavoritesContext"
import { useAuth } from "../context/AuthContext"
import { HiHeart, HiOutlineHeart } from "react-icons/hi2"

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
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        setVisibleCount(PAGE_SIZE)

        const data = await getVenues(currentQuery || undefined)

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

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
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

  const filteredVenues = venues.filter((venue) => {
    if (wifi && !venue.meta?.wifi) return false
    if (parking && !venue.meta?.parking) return false
    if (breakfast && !venue.meta?.breakfast) return false
    if (pets && !venue.meta?.pets) return false
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
            <h1 className="text-3xl font-serif md:text-4xl">All stays</h1>
            <p className="mt-2 text-sm text-white/70">
              Browse all available venues and find your next stay.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-md items-center gap-2 rounded-full bg-section px-3 py-2"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or city"
              className="w-full bg-transparent px-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-olive px-4 py-1.5 text-sm font-semibold text-white hover:bg-olive/80"
            >
              Search
            </button>
          </form>
        </header>

        <section className="mb-8 flex flex-wrap gap-3 text-sm">
          <FilterChip
            active={wifi}
            onClick={() => setWifi((v) => !v)}
            label="Wifi"
          />
          <FilterChip
            active={parking}
            onClick={() => setParking((v) => !v)}
            label="Parking"
          />
          <FilterChip
            active={breakfast}
            onClick={() => setBreakfast((v) => !v)}
            label="Breakfast"
          />
          <FilterChip
            active={pets}
            onClick={() => setPets((v) => !v)}
            label="Pets allowed"
          />
          {(wifi || parking || breakfast || pets) && (
            <button
              type="button"
              onClick={() => {
                setWifi(false)
                setParking(false)
                setBreakfast(false)
                setPets(false)
              }}
              className="text-xs text-white/60 underline"
            >
              Clear filters
            </button>
          )}
        </section>

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

type FilterChipProps = {
  active: boolean
  label: string
  onClick: () => void
}

function FilterChip({ active, label, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-xs font-medium transition " +
        (active
          ? "border-olive bg-olive/20 text-olive"
          : "border-white/20 bg-section text-white/80 hover:border-white/40")
      }
    >
      {label}
    </button>
  )
}