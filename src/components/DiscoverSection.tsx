import midlertidigImage from "../assets/midlertidig.png"

export default function DiscoverSection() {
  return (
    <section className="bg-[#1E1E1E] py-16">
      <div className="w-full mx-auto px-4 md:px-0">
        <div className="relative overflow-hidden rounded-3xl md:rounded-none md:h-[420px] lg:h-[580px]">
          <img
            src={midlertidigImage}
            alt="Coastal holiday destination"
            className="w-full h-[360px] md:h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-snug drop-shadow-xl whitespace-normal">
  <span className="block sm:inline">Discover hidden gems</span>
  <span className="block sm:inline"> across the world</span>
</h2>

            <button
              className="mt-8 px-10 md:px-12 py-3 md:py-4 rounded-xl bg-olive hover:bg-olive/80 
                         text-lg md:text-xl font-medium transition shadow-lg"
            >
              Explore venues
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}