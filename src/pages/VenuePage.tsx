import { useEffect, useState, type MouseEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getVenueById, type Venue } from "../api/venues"
import { HiArrowLeft } from "react-icons/hi2"
import VenueMainInfo from "../components/VenueMainInfo"
import VenueBookingCard from "../components/VenueBookingCard"

export default function VenuePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("No venue id provided.")
      setLoading(false)
      return
    }

    let ignore = false

    async function load(venueId: string) {
      try {
        setLoading(true)
        setError(null)
        const data = await getVenueById(venueId)
        if (!ignore) {
          setVenue(data)
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load venue.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load(id)

    return () => {
      ignore = true
    }
  }, [id])

  function handleBackClick(e: MouseEvent) {
    e.preventDefault()
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate("/venues")
    }
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <button
          type="button"
          onClick={handleBackClick}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to all stays
        </button>

        {loading && <p className="text-white/70">Loading venue…</p>}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {!loading && !error && venue && (
          <div className="grid gap-10 md:grid-cols-[1.6fr,1fr]">
            <VenueMainInfo venue={venue} />
            <VenueBookingCard
              venue={venue}
              bookings={venue.bookings ?? []}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}