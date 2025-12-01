// src/context/FavoritesContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { Venue } from "../api/venues"

type FavoritesContextValue = {
  favorites: string[]
  favoriteVenues: Venue[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (venue: Venue) => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
)

const STORAGE_KEY = "holidaze_favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteVenues, setFavoriteVenues] = useState<Venue[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Venue[]
      setFavoriteVenues(parsed)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteVenues))
  }, [favoriteVenues])

  const favorites = favoriteVenues.map((v) => v.id)

  function isFavorite(id: string) {
    return favorites.includes(id)
  }

  function toggleFavorite(venue: Venue) {
    setFavoriteVenues((prev) => {
      const exists = prev.some((v) => v.id === venue.id)
      if (exists) {
        return prev.filter((v) => v.id !== venue.id)
      }
      return [...prev, venue]
    })
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoriteVenues, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider")
  }
  return ctx
}