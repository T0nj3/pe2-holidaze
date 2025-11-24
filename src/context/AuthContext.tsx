// src/context/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import type { ReactNode } from "react"
import type { AuthUser, LoginBody } from "../api/auth"
import { loginRequest, logoutRequest } from "../api/auth"

type AuthState = {
  user: AuthUser | null
  token: string | null
  isVenueManager: boolean
  login: (body: LoginBody) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const STORAGE_KEY = "holidaze_auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as { user: AuthUser; token: string | null }
      setUser(parsed.user)
      setToken(parsed.token)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const persist = useCallback((nextUser: AuthUser | null, nextToken: string | null) => {
    if (nextUser && nextToken) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: nextUser, token: nextToken })
      )
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    async (body: LoginBody) => {
      setLoading(true)
      setError(null)
      try {
        const { user: nextUser, token: nextToken } = await loginRequest(body)
        setUser(nextUser)
        setToken(nextToken)
        persist(nextUser, nextToken)
      } catch (err: any) {
        setError(err?.message || "Could not log in")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persist]
  )

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await logoutRequest()
    } finally {
      setUser(null)
      setToken(null)
      persist(null, null)
      setLoading(false)
    }
  }, [persist])

  const isVenueManager = !!user?.venueManager

  return (
    <AuthContext.Provider
      value={{ user, token, isVenueManager, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}