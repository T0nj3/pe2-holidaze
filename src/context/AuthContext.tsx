import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { loginRequest, type AuthUser, type LoginBody, logoutRequest } from "../api/auth"

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isVenueManager: boolean
  loading: boolean
  error: string | null
  login: (body: LoginBody) => Promise<void>
  logout: () => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

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
      const parsed = JSON.parse(raw) as { user: AuthUser; token: string }
      setUser(parsed.user)
      setToken(parsed.token)
      localStorage.setItem("holidaze_token", parsed.token)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem("holidaze_token")
    }
  }, [])

  const persist = useCallback((nextUser: AuthUser | null, nextToken: string | null) => {
    if (nextUser && nextToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }))
      localStorage.setItem("holidaze_token", nextToken)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem("holidaze_token")
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
    [persist],
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
      value={{
        user,
        token,
        isVenueManager,
        loading,
        error,
        login,
        logout,
        setUser,
      }}
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