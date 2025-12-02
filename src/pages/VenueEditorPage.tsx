// src/pages/VenueEditorPage.tsx
import {
    useEffect,
    useState,
    type FormEvent,
    type ChangeEvent,
  } from "react"
  import { useNavigate, useParams, Navigate } from "react-router-dom"
  import Header from "../components/Header"
  import Footer from "../components/Footer"
  import {
    getVenueById,
    createVenue,
    updateVenue,
    type Venue,
    type VenueCreateUpdateBody,
  } from "../api/venues"
  import { useAuth } from "../context/AuthContext"
  
  type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  
  export default function VenueEditorPage() {
    const { user, isVenueManager } = useAuth()
    const navigate = useNavigate()
    const params = useParams<{ id: string }>()
    const id = params.id
    const isEdit = Boolean(id)
  
    if (!user) {
      return <Navigate to="/login" replace />
    }
  
    if (!isVenueManager) {
      return <Navigate to="/" replace />
    }
  
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
  
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("0")
    const [maxGuests, setMaxGuests] = useState("1")
  
    const [imageUrl, setImageUrl] = useState("")
    const [imageAlt, setImageAlt] = useState("")
  
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
  
    const [wifi, setWifi] = useState(false)
    const [parking, setParking] = useState(false)
    const [breakfast, setBreakfast] = useState(false)
    const [pets, setPets] = useState(false)
  
    useEffect(() => {
      if (!isEdit || !id) return
  
      const venueId = id
      let ignore = false
  
      async function load() {
        try {
          setLoading(true)
          setError(null)
  
          const data: Venue = await getVenueById(venueId)
          if (ignore) return
  
          setName(data.name)
          setDescription(data.description ?? "")
          setPrice(String(data.price))
          setMaxGuests(String(data.maxGuests))
  
          const media = data.media?.[0]
          setImageUrl(media?.url ?? "")
          setImageAlt(media?.alt ?? "")
  
          setCity(data.location?.city ?? "")
          setCountry(data.location?.country ?? "")
  
          setWifi(!!data.meta?.wifi)
          setParking(!!data.meta?.parking)
          setBreakfast(!!data.meta?.breakfast)
          setPets(!!data.meta?.pets)
        } catch (err: any) {
          if (!ignore) {
            setError(err?.message || "Could not load venue")
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
    }, [id, isEdit])
  
    function handleBasicChange(
      setter: (value: string) => void,
    ) {
      return (e: InputEvent) => setter(e.target.value)
    }
  
    async function handleSubmit(e: FormEvent) {
      e.preventDefault()
      setError(null)
      setSaving(true)
  
      const body: VenueCreateUpdateBody = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        maxGuests: Number(maxGuests) || 1,
        media: imageUrl.trim()
          ? [
              {
                url: imageUrl.trim(),
                alt: imageAlt.trim() || null,
              },
            ]
          : [],
        location: {
          city: city.trim() || null,
          country: country.trim() || null,
        },
        meta: {
          wifi,
          parking,
          breakfast,
          pets,
        },
      }
  
      try {
        const saved = isEdit && id
          ? await updateVenue(id, body)
          : await createVenue(body)
  
        navigate(`/venues/${saved.id}`)
      } catch (err: any) {
        setError(err?.message || "Could not save venue")
      } finally {
        setSaving(false)
      }
    }
  
    return (
      <div className="min-h-screen bg-base text-white">
        <Header variant="default" />
  
        <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
          <header className="mb-8 md:mb-10">
            <h1 className="text-3xl font-serif md:text-4xl">
              {isEdit ? "Edit venue" : "Create new venue"}
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {isEdit
                ? "Update details for your venue."
                : "Add a new place for guests to book."}
            </p>
          </header>
  
          {loading && (
            <p className="text-sm text-white/70">Loading venue…</p>
          )}
  
          {!loading && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl bg-section p-5 md:p-6"
            >
              {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-2 text-sm text-red-100">
                  {error}
                </div>
              )}
  
              <div className="space-y-2">
                <label className="block text-sm text-white/80">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleBasicChange(setName)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                  placeholder="Cozy cabin in the mountains"
                />
              </div>
  
              <div className="space-y-2">
                <label className="block text-sm text-white/80">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={handleBasicChange(setDescription)}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                  placeholder="Describe the venue, surroundings and what guests can expect."
                />
              </div>
  
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm text-white/80">
                    Price per night (USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={handleBasicChange(setPrice)}
                    className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white focus:border-olive focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-white/80">
                    Max guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={maxGuests}
                    onChange={handleBasicChange(setMaxGuests)}
                    className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white focus:border-olive focus:outline-none"
                  />
                </div>
              </div>
  
              <div className="space-y-2">
                <label className="block text-sm text-white/80">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleBasicChange(setImageUrl)}
                  className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                  placeholder="https://…"
                />
                <label className="mt-2 block text-xs text-white/70">
                  Alt text
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={handleBasicChange(setImageAlt)}
                  className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                  placeholder="Describe the image"
                />
  
                {imageUrl.trim() && (
                  <div className="mt-3 h-40 w-full overflow-hidden rounded-xl bg-white/5">
                    <img
                      src={imageUrl}
                      alt={imageAlt || "Venue preview"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
  
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm text-white/80">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={handleBasicChange(setCity)}
                    className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                    placeholder="Oslo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-white/80">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={handleBasicChange(setCountry)}
                    className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                    placeholder="Norway"
                  />
                </div>
              </div>
  
              <div className="space-y-3">
                <p className="text-sm text-white/80">Amenities</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={wifi}
                      onChange={(e) => setWifi(e.target.checked)}
                      className="h-4 w-4 rounded border-white/40 bg-base"
                    />
                    <span>Wifi</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={parking}
                      onChange={(e) => setParking(e.target.checked)}
                      className="h-4 w-4 rounded border-white/40 bg-base"
                    />
                    <span>Parking</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={breakfast}
                      onChange={(e) => setBreakfast(e.target.checked)}
                      className="h-4 w-4 rounded border-white/40 bg-base"
                    />
                    <span>Breakfast</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pets}
                      onChange={(e) => setPets(e.target.checked)}
                      className="h-4 w-4 rounded border-white/40 bg-base"
                    />
                    <span>Pets allowed</span>
                  </label>
                </div>
              </div>
  
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-md bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-olive px-6 py-2 text-sm font-semibold text-white hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? isEdit
                      ? "Saving changes…"
                      : "Creating venue…"
                    : isEdit
                    ? "Save changes"
                    : "Create venue"}
                </button>
              </div>
            </form>
          )}
        </main>
  
        <Footer />
      </div>
    )
  }