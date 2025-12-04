type Props = {
    wifi: boolean
    parking: boolean
    breakfast: boolean
    pets: boolean
    onToggleWifi: () => void
    onToggleParking: () => void
    onToggleBreakfast: () => void
    onTogglePets: () => void
    onClear: () => void
  }
  
  type FilterChipProps = {
    active: boolean
    label: string
    onClick: () => void
  }
  
  function FilterChip({ active, label, onClick }: FilterChipProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={
          "rounded-full border px-3 py-1 text-xs font-medium transition " +
          (active
            ? "border-olive bg-olive/20 text-olive"
            : "border-white/20 bg-section text-white/80 hover:border-white/40")
        }
      >
        {label}
      </button>
    )
  }
  
  export default function VenueFiltersBar({
    wifi,
    parking,
    breakfast,
    pets,
    onToggleWifi,
    onToggleParking,
    onToggleBreakfast,
    onTogglePets,
    onClear,
  }: Props) {
    const hasActiveFilters = wifi || parking || breakfast || pets
  
    return (
      <section className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <FilterChip active={wifi} onClick={onToggleWifi} label="Wifi" />
        <FilterChip
          active={parking}
          onClick={onToggleParking}
          label="Parking"
        />
        <FilterChip
          active={breakfast}
          onClick={onToggleBreakfast}
          label="Breakfast"
        />
        <FilterChip
          active={pets}
          onClick={onTogglePets}
          label="Pets allowed"
        />
  
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-white/60 underline"
          >
            Clear filters
          </button>
        )}
      </section>
    )
  }