import { Link } from "react-router-dom"
import type { Venue } from "../api/venues"
import { HiStar } from "react-icons/hi2"

type Props = {
  venue: Venue
}

export default function VenueMainInfo({ venue }: Props) {
  const mainImage = venue.media?.[0]
  const otherImages = venue.media?.slice(1, 4) ?? []

  const location = [
    venue.location?.city,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <section className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[2fr,1.4fr]">
        <div className="overflow-hidden rounded-2xl bg-white/5">
          {mainImage?.url ? (
            <img
              src={mainImage.url}
              alt={mainImage.alt || venue.name}
              className="h-72 w-full object-cover md:h-[380px]"
            />
          ) : (
            <div className="flex h-72 items-center justify-center text-white/40 md:h-[380px]">
              No image available
            </div>
          )}
        </div>

        <div className="hidden flex-col gap-3 md:flex">
          {otherImages.length > 0 ? (
            otherImages.map((img, index) => (
              <div
                key={index}
                className="h-[118px] overflow-hidden rounded-xl bg-white/5"
              >
                <img
                  src={img.url}
                  alt={img.alt || venue.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl bg-white/5 text-sm text-white/40">
              More photos coming soon
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif md:text-4xl">
            {venue.name}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {location || "Unknown location"}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {typeof venue.rating === "number" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <HiStar className="h-4 w-4 text-yellow-400" />
              <span className="font-semibold">
                {venue.rating.toFixed(1)}
              </span>
              <span className="text-white/60">/ 5</span>
            </div>
          )}
          <span className="text-white/70">
            Max {venue.maxGuests} guests
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">About this stay</h2>
        <p className="text-sm leading-relaxed text-white/80">
          {venue.description ||
            "No description available for this venue yet."}
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <div className="flex flex-wrap gap-2 text-xs text-white/75">
          {venue.meta?.wifi && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Wifi
            </span>
          )}
          {venue.meta?.parking && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Parking
            </span>
          )}
          {venue.meta?.breakfast && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Breakfast
            </span>
          )}
          {venue.meta?.pets && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              Pets allowed
            </span>
          )}
          {!venue.meta && (
            <span className="text-white/60">
              No amenities listed.
            </span>
          )}
        </div>
      </div>

      {venue.owner && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-section p-4">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10">
            {venue.owner.avatar?.url ? (
              <img
                src={venue.owner.avatar.url}
                alt={venue.owner.avatar.alt || venue.owner.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
                {venue.owner.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Hosted by
            </p>
            <Link
              to={`/host/${encodeURIComponent(venue.owner.name)}`}
              className="text-sm font-semibold hover:underline"
            >
              {venue.owner.name}
            </Link>
            <p className="text-xs text-white/60">
              View host profile and more stays.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}