import { useState, type FormEvent } from "react"
import { useAuth } from "../context/AuthContext"

export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
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
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-olive px-6 py-3 text-base font-semibold text-white hover:bg-olive/80 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  )
}