import { apiFetch } from "./client"
import type { VenueMedia, VenueLocation } from "./venues"

export type Profile = {
  name: string
  email: string
  bio?: string | null
  avatar?: {
    url: string
    alt?: string | null
  } | null
  banner?: {
    url: string
    alt?: string | null
  } | null
  venueManager?: boolean | null
  _count?: {
    venues?: number
    bookings?: number
  }
}

type RawProfileResponse = {
  data: Profile
}

export async function getProfile(name: string) {
  const res = await apiFetch<RawProfileResponse>(
    `/holidaze/profiles/${encodeURIComponent(name)}?_bookings=true&_venues=true`,
    {
      auth: true,
    },
  )

  return res.data
}

export type UpdateProfileBody = {
  bio?: string | null
  avatar?: {
    url: string
    alt?: string | null
  } | null
  banner?: {
    url: string
    alt?: string | null
  } | null
}

export async function updateProfile(name: string, body: UpdateProfileBody) {
  const res = await apiFetch<RawProfileResponse>(
    `/holidaze/profiles/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      auth: true,
    },
  )

  return res.data
}

export type ProfileBookingVenue = {
  id: string
  name: string
  media?: VenueMedia[]
  location?: VenueLocation
}

export type ProfileBooking = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  venue?: ProfileBookingVenue | null
}

type RawProfileBookingsResponse = {
  data: ProfileBooking[]
}

export async function getMyBookings(name: string): Promise<ProfileBooking[]> {
  const res = await apiFetch<RawProfileBookingsResponse>(
    `/holidaze/profiles/${encodeURIComponent(
      name,
    )}/bookings?_venue=true`,
    { auth: true },
  )

  return res.data
}