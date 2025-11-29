import { apiFetch } from "./client"

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