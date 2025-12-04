import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getProfile, type Profile } from "../api/profile"
import { getMyVenues, type Venue } from "../api/venues"
import MyVenueCard from "../components/MyVenueCard"
import MyVenuesHeader from "../components/MyVenuesHeader"

export default function MyVenuesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/my-venues")
      return
    }

    let ignore = false
    const name = user.name

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [profileRes, venuesRes] = await Promise.all([
          getProfile(name),
          getMyVenues(name),
        ])

        if (!ignore) {
          setProfile(profileRes)
          setVenues(venuesRes)
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load your venues.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [user, navigate])

  function handleVenueDeleted(id: string) {
    setVenues((prev) => prev.filter((v) => v.id !== id))
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            _count: {
              ...prev._count,
              venues: Math.max(0, (prev._count?.venues ?? 1) - 1),
            },
          }
        : prev,
    )
  }

  function handleCreateClick() {
    navigate("/venues/new")
  }

  return (
    <div className="flex min-h-screen flex-col bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-8 md:py-10">
        <MyVenuesHeader
          profile={profile}
          loading={loading}
          onCreateClick={handleCreateClick}
        />

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading && !error && (
          <p className="text-sm text-white/70">Loading your venues…</p>
        )}

        {!loading && !error && venues.length === 0 && (
          <p className="text-sm text-white/70">
            You don&apos;t have any venues yet. Click{" "}
            <span className="font-semibold">“Create new venue”</span> to add
            your first stay.
          </p>
        )}

        {!loading && !error && venues.length > 0 && (
          <section className="mt-4 grid gap-6 md:grid-cols-2">
            {venues.map((venue) => (
              <MyVenueCard
                key={venue.id}
                venue={venue}
                onDeleted={handleVenueDeleted}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}