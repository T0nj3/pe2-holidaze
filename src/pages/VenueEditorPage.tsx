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
  }, [id, isEdit, user])

  const showAccessDenied = !user || !user.venueManager

  return (
    <div className="flex min-h-screen flex-col bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-4xl flex-1 px-4 py-10">
        {showAccessDenied ? (
          <div className="rounded-2xl bg-section px-6 py-8 text-center text-sm text-white/80">
            <p className="font-semibold">Access denied</p>
            <p className="mt-2">
              You need to be logged in as a venue manager to create or edit venues.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}