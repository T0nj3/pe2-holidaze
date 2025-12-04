import { type FormEvent } from "react"

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function VenueSearchBar({
  value,
  onChange,
  onSubmit,
}: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-2 rounded-full bg-section px-3 py-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or city"
        className="w-full bg-transparent px-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-olive px-4 py-1.5 text-sm font-semibold text-white hover:bg-olive/80"
      >
        Search
      </button>
    </form>
  )
}