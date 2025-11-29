import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { HiCheckCircle, HiExclamationTriangle } from "react-icons/hi2"
import { useAuth } from "../context/AuthContext"
import { registerRequest } from "../api/auth"

export default function RegisterForm() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [venueManager, setVenueManager] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await registerRequest({ name, email, password, venueManager })
      await login({ email, password })

      setSuccess("Account created successfully! Redirecting to home...")

      setTimeout(() => {
        navigate("/")
      }, 1200)
    } catch (err: any) {
      setError(err?.message || "Could not register. Please try again.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
      />

      <input
        type="email"
        placeholder="stud.noroff.no email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md bg-white px-4 py-3 text-base text-black placeholder:text-[#8C929F] focus:outline-none"
      />

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          checked={venueManager}
          onChange={(e) => setVenueManager(e.target.checked)}
          className="h-4 w-4"
        />
        I am a venue manager
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <HiExclamationTriangle className="text-red-400" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          <HiCheckCircle className="text-emerald-400" />
          <p>{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-olive px-6 py-3 text-base font-semibold text-white hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60 transition"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  )
}