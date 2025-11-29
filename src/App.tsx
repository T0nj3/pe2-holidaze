import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import VenuePage from "./pages/VenuePage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/venues/:id" element={<VenuePage />} />
    </Routes>
  )
}