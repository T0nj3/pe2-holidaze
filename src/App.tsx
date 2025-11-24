import Header from "./components/Header"
import heroVideo from "./assets/hero.mp4"
import Carousel from "./components/Carousel"
import WhyBookSection from "./components/WhyBookSection"
import DiscoverSection from "./components/DiscoverSection"
import Footer from "./components/Footer"
import FindStaySection from "./components/FindStaySection"

export default function App() {
  return (
    <div className="w-full">
      <Header variant="landing" />

      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={heroVideo}
        />

        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 h-full flex items-end pb-10 md:pb-16">
          <FindStaySection variant="overlay" />
        </div>
      </section>

      <FindStaySection />

      <Carousel title="Popular stays" />
      <WhyBookSection />
      <DiscoverSection />
      <Footer />
    </div>
  )
}