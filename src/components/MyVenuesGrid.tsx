import type { Venue } from "../api/venues"
import MyVenueCard from "./MyVenueCard"

type Props = {
  venues: Venue[]
  onVenueDeleted: (id: string) => void
}

export default function MyVenuesGrid({ venues, onVenueDeleted }: Props) {
  if (venues.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {venues.map((venue) => (
        <MyVenueCard
          key={venue.id}
          venue={venue}
          onDeleted={onVenueDeleted}
        />
      ))}
    </div>
  )
}