import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getVenueById, type Venue } from "../api/venues"
import VenueForm from "../components/VenueForm"
import { HiArrowLeft } from "react-icons/hi2"

export default function VenueEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isEdit = Boolean(id)

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.venueManager) {
      navigate("/login")
      return
    }

    if (!isEdit) return

    async function load() {
      try {
        const data = await getVenueById(id!)
        if (!user || data.owner?.name !== user.name) {
          setError("You do not have permission to edit this venue.")
          return
        }
        setVenue(data)
      } catch (err: any) {
        setError(err?.message || "Failed to load venue.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEdit, user, navigate])

  if (!user?.venueManager) {
    return <p className="p-10 text-center text-white">Access denied</p>
  }

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-4xl px-4 py-10">
      <button
    type="button"
    onClick={() => navigate("/my-venues")}
    className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
  >
    <HiArrowLeft className="h-4 w-4" />
    Back to My venues
  </button>
        {loading && <p>Loading venue…</p>}

        {error && (
          <div className="rounded-xl bg-red-900/40 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <VenueForm initialVenue={venue} isEdit={isEdit} />
        )}
      </main>

      <Footer />
    </div>
  )
}