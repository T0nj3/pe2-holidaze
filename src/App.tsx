import Header from "./components/Header";
import heroVideo from "./assets/hero.mp4";
import "./App.css";

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
          src={heroVideo}>
        </video>

        <div className="absolute inset-0 bg-black/1 z-0"/>

        <div className="relative z-10">
          <Header variant="landing"/>
        </div>

      </section>

    </div>
  );
}