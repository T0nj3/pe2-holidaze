import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi"

export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSuccessMessage("")

    try {
      await login({ email, password })

      setSuccessMessage("Login successful. Redirecting...")

      setTimeout(() => {
        navigate("/")
      }, 1200)
    } catch {
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4"
    >
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

      {error && (
        <div className="flex items-start gap-3 rounded-md border border-red-500/60 bg-red-900/60 px-4 py-3 text-sm text-red-100">
          <FiAlertTriangle className="text-red-300 mt-[2px] text-lg" />
          <div>
            <p className="font-semibold text-red-200">Login failed</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-md border border-emerald-500/60 bg-emerald-900/60 px-4 py-3 text-sm text-emerald-100">
          <FiCheckCircle className="text-emerald-300 mt-[2px] text-lg" />
          <div>
            <p className="font-semibold text-emerald-200">Logged in</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-olive px-6 py-3 text-base font-semibold text-white transition hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  )
}