import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import VenuesPage from "./pages/VenuesPage"
import VenuePage from "./pages/VenuePage"
import ProfilePage from "./pages/ProfilePage"
import MyFavoritesPage from "./pages/MyFavoritesPage"
import HostProfilePage from "./pages/HostProfilePage"
import MyBookingsPage from "./pages/MyBookingsPage"
import MyVenuesPage from "./pages/MyVenuesPage"
import VenueEditorPage from "./pages/VenueEditorPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/venues/:id" element={<VenuePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/my-venues" element={<MyVenuesPage />} />
      <Route path="/favorites" element={<MyFavoritesPage />} />
      <Route path="/host/:name" element={<HostProfilePage />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
      <Route path="/venues/new" element={<VenueEditorPage />} />
      <Route path="/venues/:id/edit" element={<VenueEditorPage />} />
    </Routes>
  )
}