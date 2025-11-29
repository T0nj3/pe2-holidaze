import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type HeaderProps = {
  variant?: "landing" | "default"
}

export default function Header({ variant = "default" }: HeaderProps) {
  const isLanding = variant === "landing"
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { user, isVenueManager, logout } = useAuth()
  const isLoggedIn = !!user
  const navigate = useNavigate()

  const mainNav = [
    { label: "Home", to: "/" },
    { label: "Venues", to: "/venues" },
  ]

  const hostCtaLabel = !isLoggedIn
    ? "Become a host"
    : isVenueManager
    ? "Host dashboard"
    : "Start hosting"

  const hostCtaTarget = !isLoggedIn
    ? "/login?mode=register"
    : isVenueManager
    ? "/my-venues"
    : "/profile"

  function handleLoginClick() {
    navigate("/login")
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  async function handleLogoutClick() {
    await logout()
    setIsMenuOpen(false)
    setIsProfileOpen(false)
    navigate("/")
  }

  function handleHostClick() {
    navigate(hostCtaTarget)
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  function handleProfileClick() {
    setIsProfileOpen((open) => !open)
  }

  function goToProfile() {
    navigate("/profile")
    setIsProfileOpen(false)
    setIsMenuOpen(false)
  }

  function goToBookings() {
    navigate("/my-bookings")
    setIsProfileOpen(false)
    setIsMenuOpen(false)
  }

  function goToMyVenues() {
    navigate("/my-venues")
    setIsProfileOpen(false)
    setIsMenuOpen(false)
  }

  const avatarUrl = (user as any)?.avatar?.url as string | undefined
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?"

  return (
    <header className="sticky top-0 z-30 w-full">
      {isLanding && (
        <div className="absolute inset-0 z-0 bg-base/25 backdrop-blur-sm" />
      )}

      <div
        className={
          "relative z-20 w-full border-b border-white/10 " +
          (isLanding ? "bg-transparent" : "bg-base")
        }
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:h-24 md:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-3xl leading-none md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => {
                setIsMenuOpen((open) => !open)
                setIsProfileOpen(false)
              }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            <Link to="/" className="text-3xl font-serif md:text-4xl">
              Holidaze
            </Link>
          </div>

          <nav className="hidden gap-8 text-lg md:flex">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "relative group transition-colors",
                    isActive ? "!text-white" : "!text-white/80 hover:!text-white",
                  ].join(" ")
                }
              >
                {item.label}
                <span
                  className="absolute left-0 -bottom-1 h-[2px] w-0 
                             bg-white transition-all duration-300 
                             group-hover:w-full"
                />
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleHostClick}
              className="hidden rounded-full border border-white px-4 py-2 text-sm font-medium !text-white hover:bg-white/10 md:inline-flex md:px-5 md:text-base"
            >
              {hostCtaLabel}
            </button>

            {isLoggedIn ? (
              <div className="relative hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 pr-3 text-sm !text-white/90 hover:bg-white/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/20">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name || "Profile avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {initials}
                      </span>
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-11 w-48 rounded-xl border border-white/10 bg-base/95 p-2 text-sm shadow-xl">
                    <button
                      type="button"
                      onClick={goToProfile}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-white/10"
                    >
                      <span>Manage profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={goToBookings}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-white/10"
                    >
                      <span>My bookings</span>
                    </button>
                    {isVenueManager && (
                      <button
                        type="button"
                        onClick={goToMyVenues}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-white/10"
                      >
                        <span>My venues</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="mt-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-red-300 hover:bg-red-900/30"
                    >
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {!isLoggedIn && (
              <button
                className="rounded-md bg-olive px-4 py-2 text-sm font-medium 
                           !text-white hover:bg-olive/80 md:px-5 md:text-base"
                onClick={handleLoginClick}
              >
                Log in
              </button>
            )}

            {isLoggedIn && (
              <button
                className="inline-flex rounded-md bg-white/10 px-4 py-2 text-sm font-medium !text-white hover:bg-white/20 md:hidden"
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
              "border-t border-white/10 md:hidden " +
              (isLanding ? "bg-base/80 backdrop-blur-sm" : "bg-base")
            }
          >
            <nav className="flex flex-col items-center gap-4 py-4 text-lg">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsProfileOpen(false)
                  }}
                  className={({ isActive }) =>
                    [
                      "relative group",
                      isActive
                        ? "!text-white"
                        : "!text-white/80 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                  <span
                    className="absolute left-0 -bottom-1 h-[2px] w-0 
                               bg-white transition-all duration-300 
                               group-hover:w-full"
                  />
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleHostClick}
                className="mt-2 w-11/12 rounded-full border border-olive px-5 py-2 text-base font-semibold text-olive hover:bg-olive/10"
              >
                {hostCtaLabel}
              </button>

              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="mt-2 w-11/12 rounded-md bg-white/5 px-5 py-2 text-base !text-white hover:bg-white/10"
                  >
                    Manage profile
                  </button>
                  <button
                    type="button"
                    onClick={goToBookings}
                    className="w-11/12 rounded-md bg-white/5 px-5 py-2 text-base !text-white hover:bg-white/10"
                  >
                    My bookings
                  </button>
                  {isVenueManager && (
                    <button
                      type="button"
                      onClick={goToMyVenues}
                      className="w-11/12 rounded-md bg-white/5 px-5 py-2 text-base !text-white hover:bg-white/10"
                    >
                      My venues
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="mt-2 w-11/12 rounded-md bg-red-900/40 px-5 py-2 text-base font-semibold text-red-100 hover:bg-red-900/60"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  className="mt-2 w-11/12 rounded-md bg-olive px-5 py-2 text-base font-semibold !text-white hover:bg-olive/80"
                  onClick={handleLoginClick}
                >
                  Log in
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}