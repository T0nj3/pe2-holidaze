import Header from "./components/Header";
import heroVideo from "./assets/hero.mp4";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-[#292929] text-white flex flex-col relative overflow-hidden">
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="relative z-10">
        <Header />
      </div>
    </div>
  );
}