import { apiFetch } from "./client"

export type VenueMedia = {
  url: string
  alt?: string | null
}

export type VenueLocation = {
  address?: string | null
  city?: string | null
  country?: string | null
}

export type VenueMeta = {
  wifi?: boolean
  parking?: boolean
  breakfast?: boolean
  pets?: boolean
}

export type VenueOwner = {
  name: string
  avatar?: {
    url: string
    alt?: string | null
  } | null
}

export type Venue = {
  id: string
  name: string
  description?: string | null
  price: number
  rating?: number
  maxGuests: number
  media?: VenueMedia[]
  location?: VenueLocation
  meta?: VenueMeta
  owner?: VenueOwner
}

type RawVenueListResponse = {
  data: Venue[]
}

type RawVenueResponse = {
  data: Venue
}

export async function getPopularVenues(): Promise<Venue[]> {
  const params = new URLSearchParams()
  params.set("limit", "50")
  params.set("_owner", "true")

  const res = await apiFetch<RawVenueListResponse>(
    `/holidaze/venues?${params.toString()}`,
  )

  return [...res.data]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 12)
}

export async function getVenues(search?: string): Promise<Venue[]> {
  const params = new URLSearchParams()
  params.set("limit", "40")
  params.set("_owner", "true")

  let path = "/holidaze/venues"

  if (search && search.trim()) {
    path = "/holidaze/venues/search"
    params.set("q", search.trim())
  }

  const res = await apiFetch<RawVenueListResponse>(
    `${path}?${params.toString()}`,
  )

  return res.data
}

export async function getVenueById(id: string): Promise<Venue> {
  const params = new URLSearchParams()
  params.set("_owner", "true")
  params.set("_bookings", "true")

  const res = await apiFetch<RawVenueResponse>(
    `/holidaze/venues/${encodeURIComponent(id)}?${params.toString()}`,
  )

  return res.data
}