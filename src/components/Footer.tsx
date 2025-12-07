import { FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import MobileBottomNav from "./MobileBottomNav"

export default function Footer() {
  return (
    <>
      <footer className="hidden md:block w-full bg-[#1E1E1E] text-white border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-0">
          <h2 className="text-4xl font-serif text-center md:text-left">
            Holidaze
          </h2>

          <nav className="flex flex-col items-center gap-6 md:flex-row md:gap-10 text-xl font-serif">
            <a href="#" className="hover:text-white/70 transition">About</a>
            <a href="#" className="hover:text-white/70 transition">Contact</a>
            <a href="#" className="hover:text-white/70 transition">Terms</a>
            <a href="#" className="hover:text-white/70 transition">Privacy</a>
          </nav>

          <div className="flex items-center justify-center gap-6 text-4xl">
            <a href="#" className="hover:text-white/70 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white/70 transition">
              <FaXTwitter />
            </a>
          </div>
        </div>
      </footer>

      <div className="h-16 md:hidden" />
      <MobileBottomNav />
    </>
  )
}