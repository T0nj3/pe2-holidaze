import { NavLink } from "react-router-dom"
import {
  HiHome,
  HiBuildingOffice2,
  HiHeart,
  HiUser,
  HiCalendar,
  HiHomeModern,
} from "react-icons/hi2"
import { useAuth } from "../context/AuthContext"
import { useFavorites } from "../context/FavoritesContext"

export default function MobileBottomNav() {
  const { user } = useAuth()
  const { favorites } = useFavorites()

  const isLoggedIn = !!user
  const isVenueManager = user?.venueManager === true

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        flex items-center justify-around
        bg-base/90 backdrop-blur-xl
        border-t border-white/10
        py-2
        md:hidden
      "
    >
      <MobileNavItem to="/" label="Home">
        <HiHome className="h-6 w-6" />
      </MobileNavItem>

      <MobileNavItem to="/venues" label="Venues">
        <HiBuildingOffice2 className="h-6 w-6" />
      </MobileNavItem>

      {isLoggedIn && (
        <MobileNavItem to="/favorites" label="Saved" badge={favorites.length}>
          <HiHeart className="h-6 w-6" />
        </MobileNavItem>
      )}

      {isLoggedIn && (
        <MobileNavItem to="/bookings" label="Trips">
          <HiCalendar className="h-6 w-6" />
        </MobileNavItem>
      )}

      {isLoggedIn && isVenueManager && (
        <MobileNavItem to="/my-venues" label="Host">
          <HiHomeModern className="h-6 w-6" />
        </MobileNavItem>
      )}

      <MobileNavItem
        to={isLoggedIn ? "/profile" : "/login"}
        label={isLoggedIn ? "Profile" : "Login"}
      >
        <HiUser className="h-6 w-6" />
      </MobileNavItem>
    </nav>
  )
}

type ItemProps = {
  to: string
  label: string
  badge?: number
  children: React.ReactNode
}

function MobileNavItem({ to, label, badge, children }: ItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        relative flex flex-col items-center gap-1 px-1
        text-[11px] font-medium
        transition
        ${isActive ? "text-white" : "text-white/60 hover:text-white"}
      `
      }
    >
      <div className="relative flex items-center justify-center">
        {children}

        {badge && badge > 0 && (
          <span
            className="
              absolute -right-1 -top-1
              flex h-4 min-w-[16px] items-center justify-center
              rounded-full bg-rose-500 px-1
              text-[10px] font-bold text-white
            "
          >
            {badge}
          </span>
        )}
      </div>

      <span>{label}</span>
    </NavLink>
  )
}