import { apiFetch } from "./client"
import type { VenueBooking } from "./venues"

export type CreateBookingBody = {
  dateFrom: string
  dateTo: string
  guests: number
  venueId: string
}

type RawBookingResponse = {
  data: VenueBooking
}

export async function createBooking(
  body: CreateBookingBody,
): Promise<VenueBooking> {
  const res = await apiFetch<RawBookingResponse>("/holidaze/bookings", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  })

  return res.data
}