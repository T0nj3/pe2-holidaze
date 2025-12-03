import { useState, type FormEvent } from "react"
import { createVenue, updateVenue, type Venue } from "../api/venues"
import { useNavigate } from "react-router-dom"

type Props = {
  initialVenue: Venue | null
  isEdit: boolean
}

export default function VenueForm({ initialVenue, isEdit }: Props) {
  const navigate = useNavigate()

  const [name, setName] = useState(initialVenue?.name || "")
  const [description, setDescription] = useState(initialVenue?.description || "")
  const [price, setPrice] = useState(initialVenue?.price || 0)
  const [maxGuests, setMaxGuests] = useState(initialVenue?.maxGuests || 1)

  const [address, setAddress] = useState(initialVenue?.location?.address || "")
  const [city, setCity] = useState(initialVenue?.location?.city || "")
  const [country, setCountry] = useState(initialVenue?.location?.country || "")

  const [media, setMedia] = useState(
    initialVenue?.media?.map((m) => m.url) || [""]
  )

  const [meta, setMeta] = useState({
    wifi: initialVenue?.meta?.wifi || false,
    parking: initialVenue?.meta?.parking || false,
    breakfast: initialVenue?.meta?.breakfast || false,
    pets: initialVenue?.meta?.pets || false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleMediaChange(index: number, value: string) {
    const updated = [...media]
    updated[index] = value
    setMedia(updated)
  }

  function addMediaField() {
    setMedia([...media, ""])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const body = {
      name,
      description,
      price,
      maxGuests,
      location: { address, city, country },
      media: media.filter(Boolean).map((url) => ({ url })),
      meta,
    }

    try {
      setLoading(true)

      if (isEdit && initialVenue) {
        await updateVenue(initialVenue.id, body)
        setSuccess("Venue updated successfully!")
        navigate(`/venues/${initialVenue.id}`)
      } else {
        await createVenue(body)
        setSuccess("Venue created successfully!")
        navigate("/my-venues")
      }
    } catch (err: any) {
      setError(err?.message || "Could not save venue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-section p-6 shadow-xl"
    >
      <h1 className="text-3xl font-serif mb-4">
        {isEdit ? "Edit Venue" : "Create New Venue"}
      </h1>

      {error && <p className="text-red-300">{error}</p>}
      {success && <p className="text-emerald-300">{success}</p>}

      <div className="space-y-1">
        <label className="text-sm">Title</label>
        <input
          className="w-full rounded bg-white/10 p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm">Description</label>
        <textarea
          className="w-full rounded bg-white/10 p-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Price</label>
          <input
            type="number"
            className="w-full rounded bg-white/10 p-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm">Max Guests</label>
          <input
            type="number"
            className="w-full rounded bg-white/10 p-2"
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm">Address</label>
        <input
          className="w-full rounded bg-white/10 p-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">City</label>
          <input
            className="w-full rounded bg-white/10 p-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Country</label>
          <input
            className="w-full rounded bg-white/10 p-2"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Media URLs</label>

        {media.map((url, index) => (
          <input
            key={index}
            className="w-full rounded bg-white/10 p-2"
            value={url}
            onChange={(e) =>
              handleMediaChange(index, e.target.value)
            }
            placeholder="https://image-url.com"
          />
        ))}

        <button
          type="button"
          onClick={addMediaField}
          className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
        >
          + Add another image
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Amenities</label>

        <div className="flex flex-wrap gap-4 text-sm">
          {Object.keys(meta).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(meta as any)[key]}
                onChange={(e) =>
                  setMeta({ ...meta, [key]: e.target.checked })
                }
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-full bg-olive p-3 font-semibold text-white hover:bg-olive/80 disabled:opacity-50"
      >
        {loading ? "Saving..." : isEdit ? "Save changes" : "Create venue"}
      </button>
    </form>
  )
}