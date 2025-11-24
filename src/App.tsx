import Header from "./components/Header"
import heroVideo from "./assets/hero.mp4"
import Carousel from "./components/Carousel"
import "./App.css"

export default function App() {
  return (
    <div className="w-full">
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={heroVideo}
        />

        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10">
          <Header variant="landing" />
        </div>
      </section>

      <section className="bg-[#1E1E1E] text-white py-20 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-10 text-center">
          Find your next stay
        </h2>

        <div className="w-[90%] max-w-5xl">
          <div className="bg-[#333333] rounded-xl shadow-2xl flex overflow-hidden text-lg text-[#D0D4DF]">
            <input
              type="text"
              placeholder="Location"
              className="flex-1 px-8 py-5 bg-transparent border-r border-[#555] focus:outline-none placeholder:text-[#8C929F]"
            />

            <div className="flex-1 flex items-center border-r border-[#555] px-8 py-5 gap-3">
              <input
                type="text"
                placeholder="dd.mm.yyyy"
                className="bg-transparent focus:outline-none placeholder:text-[#8C929F] w-full"
              />
              <span className="text-2xl">📅</span>
            </div>

            <input
              type="number"
              placeholder="Guests"
              className="flex-1 px-8 py-5 bg-transparent border-r border-[#555] focus:outline-none placeholder:text-[#8C929F]"
            />

            <button className="px-10 py-5 bg-olive text-white font-semibold hover:bg-olive/80 transition whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </section>

      <Carousel title="Popular stays" />
    </div>
  )
}