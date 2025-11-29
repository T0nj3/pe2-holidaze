import { apiFetch } from "./client"

export type VenueMedia = {
  url: string
  alt?: string | null
}

export type VenueLocation = {
  address?: string | null
  city?: string | null
  country?: string | null
  continent?: string | null
}

export type VenueCount = {
  bookings: number
}

export type Venue = {
  id: string
  name: string
  description: string
  media: VenueMedia[]
  rating: number
  price: number
  location: VenueLocation
  _count?: VenueCount
}

type VenueListResponse = {
  data: Venue[]
}

export async function getPopularVenues(): Promise<Venue[]> {
  const res = await apiFetch<VenueListResponse>(
    "/holidaze/venues?sort=rating&sortOrder=desc&limit=10&_bookings=true"
  )
  return res.data
}

export async function getVenueById(id: string): Promise<Venue> {
  const res = await apiFetch<{ data: Venue }>(`/holidaze/venues/${id}`)
  return res.data
}