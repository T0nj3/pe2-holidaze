// src/pages/MyFavoritesPage.tsx
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useFavorites } from "../context/FavoritesContext"
import { Link } from "react-router-dom"
import type { Venue } from "../api/venues"
import { FaHeart } from "react-icons/fa"

export default function MyFavoritesPage() {
  const { favoriteVenues, toggleFavorite } = useFavorites()

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-serif md:text-4xl">Saved stays</h1>

        {favoriteVenues.length === 0 ? (
          <p className="text-white/70">
            You haven’t saved any stays yet. Tap the heart on a venue to add it here.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteVenues.map((venue: Venue) => {
              const image = venue.media?.[0]
              const locationParts = [
                venue.location?.city,
                venue.location?.country,
              ].filter(Boolean)
              const location = locationParts.join(", ")

              return (
                <div
                  key={venue.id}
                  className="group overflow-hidden rounded-2xl bg-section border border-white/10 hover:border-white/30 transition flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-white/5">
                    {image?.url && (
                      <Link to={`/venues/${venue.id}`}>
                        <img
                          src={image.url}
                          alt={image.alt || venue.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}

                    {/* Remove / toggle favorite */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(venue)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-red-400 hover:bg-black/80 hover:text-red-300 transition"
                      aria-label="Remove from favourites"
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>

                  <Link to={`/venues/${venue.id}`} className="flex-1">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold line-clamp-1">
                        {venue.name}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                        {location || "Unknown location"}
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        From <span className="font-semibold">${venue.price}</span> per night
                      </p>
                    </div>
                  </Link>
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