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
      <section className="mb-10 h-[260px] w-full animate-pulse rounded-3xl bg-section/50" />
    )
  }

  const avatarUrl = profile?.avatar?.url ?? null
  const bannerUrl = profile?.banner?.url ?? null
  const name = profile?.name ?? ""
  const venuesCount = profile?._count?.venues ?? 0
  const bookingsCount = profile?._count?.bookings ?? 0

  return (
    <section className="relative mt-4 mb-12 w-full rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
      <div className="relative h-[340px] w-full md:h-[360px]">
        <img
          src={
            bannerUrl ||
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200"
          }
          alt={profile?.banner?.alt || `${name}'s banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 pb-7 pt-6 md:px-10 md:pb-9 md:pt-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-[96px] w-[96px] overflow-hidden rounded-full border-4 border-white/30 shadow-xl md:h-[120px] md:w-[120px]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.avatar?.alt || name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10 text-3xl font-semibold text-white/85 md:text-4xl">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/70 md:text-[12px]">
              Host Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-serif text-white drop-shadow md:text-3xl lg:text-4xl">
              {name}
            </h1>
            <p className="mt-2 max-w-md text-xs text-white/75 md:text-sm">
              Manage your stays, track your performance and grow as a host.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-wrap justify-center gap-3 text-xs text-white/90">
            <span className="rounded-full bg-white/12 px-4 py-1.5 font-medium backdrop-blur-sm">
              {venuesCount} venue{venuesCount !== 1 ? "s" : ""}
            </span>

            <span className="rounded-full bg-white/12 px-4 py-1.5 font-medium backdrop-blur-sm">
              {bookingsCount} booking{bookingsCount !== 1 ? "s" : ""}
            </span>

            {profile?.venueManager && (
              <span className="rounded-full bg-emerald-600/70 px-4 py-1.5 font-semibold text-white shadow">
                Verified Host
              </span>
            )}
          </div>

          <button
            onClick={onCreateClick}
            className="w-full max-w-xs rounded-full bg-olive px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/40 transition hover:bg-olive/80"
          >
            + Create new venue
          </button>
        </div>
      </div>
    </section>
  )
}