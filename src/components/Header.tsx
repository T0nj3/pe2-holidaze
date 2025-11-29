import { useState } from "react"
import { useAuth } from "../context/AuthContext"

type HeaderProps = {
  variant?: "landing" | "default"
}

export default function Header({ variant = "default" }: HeaderProps) {
  const isLanding = variant === "landing"
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { user, isVenueManager, logout } = useAuth()
  const isLoggedIn = !!user

  const navItems = isVenueManager
    ? ["Home", "Venues", "My venues", "My bookings"]
    : ["Home", "Venues", "My bookings"]

  function handleLoginClick() {
    window.location.href = "./LoginPage"
  }

  async function handleLogoutClick() {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 w-full">
      {isLanding && (
        <div className="absolute inset-0 bg-base/25 backdrop-blur-sm z-0" />
      )}

      <div
        className={
          "relative z-20 w-full border-b border-white/10 " +
          (isLanding ? "bg-transparent" : "bg-base")
        }
      >
        <div className="mx-auto flex h-20 md:h-24 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-3xl leading-none md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            <span className="text-3xl md:text-4xl font-serif">Holidaze</span>
          </div>

          <nav className="hidden gap-8 text-lg md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="relative group"
              >
                {item}
                <span
                  className="absolute left-0 -bottom-1 h-[2px] w-0 
                             bg-white transition-all duration-300 
                             group-hover:w-full"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <span className="hidden md:inline text-sm text-white/80">
                {user?.name}
                {isVenueManager && " · Venue manager"}
              </span>
            )}

            {!isLoggedIn ? (
              <button
                className="rounded-md bg-olive px-4 py-2 text-sm font-medium 
                           text-white hover:bg-olive/80 md:px-5 md:py-2 md:text-base"
                onClick={handleLoginClick}
              >
                Log in
              </button>
            ) : (
              <button
                className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium 
                           text-white hover:bg-white/20 md:px-5 md:py-2 md:text-base"
                onClick={handleLogoutClick}
              >
                Log out
              </button>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div
            className={
              "md:hidden border-t border-white/10 " +
              (isLanding ? "bg-base/80 backdrop-blur-sm" : "bg-base")
            }
          >
            <nav className="flex flex-col items-center gap-4 py-4 text-lg">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative group"
                >
                  {item}
                  <span
                    className="absolute left-0 -bottom-1 h-[2px] w-0 
                               bg-white transition-all duration-300 
                               group-hover:w-full"
                  />
                </a>
              ))}

              {!isLoggedIn ? (
                <button
                  className="mt-2 rounded-md bg-olive px-5 py-2 text-base font-semibold text-white hover:bg-olive/80"
                  onClick={handleLoginClick}
                >
                  Log in
                </button>
              ) : (
                <button
                  className="mt-2 rounded-md bg-white/10 px-5 py-2 text-base font-semibold text-white hover:bg-white/20"
                  onClick={handleLogoutClick}
                >
                  Log out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}