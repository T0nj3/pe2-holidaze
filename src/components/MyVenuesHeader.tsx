import type { Profile } from "../api/profile"

type Props = {
  profile: Profile | null
  loading: boolean
  onCreateClick: () => void
}

export default function MyVenuesHeader({
  profile,
  loading,
  onCreateClick,
}: Props) {
  if (loading && !profile) {
    return (
      <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-section/80">
        <div className="h-32 w-full animate-pulse bg-white/5" />
        <div className="flex items-end gap-4 p-6">
          <div className="h-16 w-16 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="h-3 w-60 rounded bg-white/5" />
          </div>
          <div className="h-9 w-32 rounded-full bg-white/10" />
        </div>
      </section>
    )
  }

  const avatarUrl = profile?.avatar?.url ?? null
  const bannerUrl = profile?.banner?.url ?? null
  const name = profile?.name ?? ""
  const venuesCount = profile?._count?.venues ?? undefined
  const bookingsCount = profile?._count?.bookings ?? undefined

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-section/80 shadow-xl shadow-black/30">
      <div className="relative h-32 w-full bg-gradient-to-r from-olive/40 via-emerald-500/20 to-sky-500/30">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={profile?.banner?.alt || `${name}'s banner`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-4 px-6 pb-5 pt-3 md:flex-row md:items-end md:justify-between">
        <div className="flex items-end gap-4">
          <div className="-mt-10 h-20 w-20 overflow-hidden rounded-full border-4 border-base bg-white/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.avatar?.alt || name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-serif md:text-3xl">
              {name || "My venues"}
            </h1>
            <p className="mt-1 text-xs text-white/70">
              Manage your stays, update details and create new venues.
            </p>

            <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/70">
              {typeof venuesCount === "number" && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {venuesCount} venue
                  {venuesCount === 1 ? "" : "s"}
                </span>
              )}
              {typeof bookingsCount === "number" && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {bookingsCount} total booking
                  {bookingsCount === 1 ? "" : "s"}
                </span>
              )}
              {profile?.venueManager && (
                <span className="rounded-full bg-emerald-600/40 px-3 py-1 text-emerald-100">
                  Venue manager
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCreateClick}
            className="rounded-full bg-olive px-5 py-2 text-sm font-semibold text-white hover:bg-olive/80"
          >
            Create new venue
          </button>
        </div>
      </div>
    </section>
  )
}