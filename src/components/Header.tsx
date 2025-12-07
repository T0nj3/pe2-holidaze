import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { HiHeart } from "react-icons/hi2"
import { useAuth } from "../context/AuthContext"
import { useFavorites } from "../context/FavoritesContext"
import LogoHolidaze from "../assets/LogoHolidaze.png"

type HeaderProps = {
  variant?: "landing" | "default"
}

type MainNavItem = {
  label: string
  to: string
}

export default function Header({ variant = "default" }: HeaderProps) {
  const isLanding = variant === "landing"

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { user, logout } = useAuth()
  const isLoggedIn = !!user
  const isVenueManager = user?.venueManager === true

  const { favorites } = useFavorites()
  const favoritesCount = favorites.length

  const navigate = useNavigate()

  const mainNav: MainNavItem[] = [
    { label: "Home", to: "/" },
    { label: "Venues", to: "/venues" },
    ...(isLoggedIn ? [{ label: "My bookings", to: "/bookings" }] : []),
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
    setIsProfileOpen(false)
  }

  async function handleLogoutClick() {
    await logout()
    setIsProfileOpen(false)
    navigate("/")
  }

  function handleHostClick() {
    navigate(hostCtaTarget)
    setIsProfileOpen(false)
  }

  function handleProfileClick() {
    setIsProfileOpen((open) => !open)
  }

  function goToProfile() {
    navigate("/profile")
    setIsProfileOpen(false)
  }

  function goToBookings() {
    navigate("/bookings")
    setIsProfileOpen(false)
  }

  function goToMyVenues() {
    navigate("/my-venues")
    setIsProfileOpen(false)
  }

  function goToFavorites() {
    navigate("/favorites")
    setIsProfileOpen(false)
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-24 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-serif md:text-3xl"
            >
              <img
                src={LogoHolidaze}
                alt="Holidaze logo"
                className="h-8 w-8 object-contain md:h-9 md:w-9"
              />
              <span>Holidaze</span>
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
                    isActive
                      ? "!text-white"
                      : "!text-white/80 hover:!text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span
                      className={
                        "absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 " +
                        (isActive ? "w-full" : "w-0 group-hover:w-full")
                      }
                    />
                  </>
                )}
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

            {isLoggedIn && (
              <button
                type="button"
                onClick={goToFavorites}
                className="relative hidden h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 md:inline-flex"
                aria-label="View favourites"
              >
                <HiHeart
                  className={
                    favoritesCount > 0 ? "h-5 w-5 text-rose-400" : "h-5 w-5"
                  }
                />
                {favoritesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

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
                  <div className="absolute right-0 top-11 w-52 rounded-xl border border-white/10 bg-base/95 p-2 text-sm shadow-xl">
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
                      onClick={goToFavorites}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-white/10"
                    >
                      <span>Favourites</span>
                      {favoritesCount > 0 && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                          {favoritesCount}
                        </span>
                      )}
                    </button>
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
                className="rounded-md bg-olive px-4 py-2 text-sm font-medium !text-white hover:bg-olive/80 md:px-5 md:text-base"
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
      </div>
    </header>
  )
}