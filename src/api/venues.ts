// src/api/venues.ts
import { apiFetch } from "./client"

export type VenueMedia = {
  url: string
  alt?: string | null
}

export type VenueLocation = {
  address?: string | null
  city?: string | null
  country?: string | null
  zip?: string | null
  continent?: string | null
  lat?: number | null
  lng?: number | null
}

export type VenueMeta = {
  wifi?: boolean
  parking?: boolean
  breakfast?: boolean
  pets?: boolean
}

export type VenueOwner = {
  name: string
  email?: string
  avatar?: {
    url: string
    alt?: string | null
  } | null
}

export type VenueBooking = {
  id: string
  dateFrom: string
  dateTo: string
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
  owner?: VenueOwner | null
  bookings?: VenueBooking[]
  _count?: {
    bookings?: number
  }
}

type RawVenueListResponse = {
  data: Venue[]
}

type RawVenueResponse = {
  data: Venue
}

// Brukes når du oppretter / oppdaterer venue
export type VenueCreateUpdateBody = {
  name: string
  description: string
  price: number
  maxGuests: number
  media?: VenueMedia[]
  location?: VenueLocation
  meta?: VenueMeta
}

// POPULAR (forsiden) – ingen sort i URL -> ingen 500
export async function getPopularVenues(): Promise<Venue[]> {
  const res = await apiFetch<RawVenueListResponse>(
    "/holidaze/venues?limit=12&_owner=true&_bookings=true",
  )

  return res.data
}

// LISTE / VENUES PAGE
export type GetVenuesParams = {
  search?: string
  limit?: number
  offset?: number
}

export async function getVenues(
  params: GetVenuesParams = {},
): Promise<Venue[]> {
  const { search, limit = 40, offset } = params

  const searchParams = new URLSearchParams()

  // søk på navn – vi filtrerer mer i frontend om du vil søke på city/country
  if (search && search.trim()) {
    searchParams.set("name", search.trim())
  }

  searchParams.set("limit", String(limit))
  searchParams.set("_owner", "true")

  if (typeof offset === "number" && offset > 0) {
    searchParams.set("offset", String(offset))
  }

  const res = await apiFetch<RawVenueListResponse>(
    `/holidaze/venues?${searchParams.toString()}`,
  )

  return res.data
}

// SINGLE VENUE / DETALJSIDE
export async function getVenueById(id: string): Promise<Venue> {
  const res = await apiFetch<RawVenueResponse>(
    `/holidaze/venues/${encodeURIComponent(id)}?_owner=true&_bookings=true`,
  )

  return res.data
}

// VENUES FOR CURRENT HOST (MY VENUES PAGE)
export async function getMyVenues(name: string): Promise<Venue[]> {
  const res = await apiFetch<RawVenueListResponse>(
    `/holidaze/profiles/${encodeURIComponent(
      name,
    )}/venues?_owner=true&_bookings=true`,
    { auth: true },
  )

  return res.data
}

// CREATE / UPDATE / DELETE – brukt av VenueEditorPage
export async function createVenue(
  body: VenueCreateUpdateBody,
): Promise<Venue> {
  const res = await apiFetch<RawVenueResponse>("/holidaze/venues", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  })

  return res.data
}

export async function updateVenue(
  id: string,
  body: VenueCreateUpdateBody,
): Promise<Venue> {
  const res = await apiFetch<RawVenueResponse>(
    `/holidaze/venues/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      auth: true,
    },
  )

  return res.data
}

export async function deleteVenue(id: string): Promise<void> {
  await apiFetch<unknown>(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "DELETE",
    auth: true,
  })
}