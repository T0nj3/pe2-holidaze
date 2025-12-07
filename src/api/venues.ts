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
  guests: number
  customer?: {
    name: string
    email?: string | null
    avatar?: {
      url: string
      alt?: string | null
    } | null
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

export type VenueCreateUpdateBody = {
  name: string
  description: string
  price: number
  maxGuests: number
  media?: VenueMedia[]
  location?: VenueLocation
  meta?: VenueMeta
}

export async function getPopularVenues(): Promise<Venue[]> {
  const res = await apiFetch<RawVenueListResponse>(
    "/holidaze/venues?limit=50&_owner=true&_bookings=true&sort=created&sortOrder=desc",
  )

  const venues = res.data.slice()

  venues.sort((a, b) => {
    const aCount =
      (a._count && typeof a._count.bookings === "number"
        ? a._count.bookings
        : a.bookings?.length ?? 0)

    const bCount =
      (b._count && typeof b._count.bookings === "number"
        ? b._count.bookings
        : b.bookings?.length ?? 0)

    return bCount - aCount
  })

  return venues.slice(0, 12)
}

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

  if (search && search.trim()) {
    searchParams.set("name", search.trim())
  }

  searchParams.set("limit", String(limit))
  searchParams.set("_owner", "true")
  searchParams.set("sort", "created")
  searchParams.set("sortOrder", "desc")

  if (typeof offset === "number" && offset > 0) {
    searchParams.set("offset", String(offset))
  }

  const res = await apiFetch<RawVenueListResponse>(
    `/holidaze/venues?${searchParams.toString()}`,
  )

  return res.data
}

export async function getVenueById(id: string): Promise<Venue> {
  const res = await apiFetch<RawVenueResponse>(
    `/holidaze/venues/${encodeURIComponent(id)}?_owner=true&_bookings=true`,
  )

  return res.data
}

export async function getMyVenues(name: string): Promise<Venue[]> {
  const res = await apiFetch<RawVenueListResponse>(
    `/holidaze/profiles/${encodeURIComponent(
      name,
    )}/venues?_owner=true&_bookings=true&sort=created&sortOrder=desc`,
    { auth: true },
  )

  return res.data
}

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