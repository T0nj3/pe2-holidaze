import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { AuthUser, LoginBody } from "../api/auth"
import { loginRequest, logoutRequest } from "../api/auth"
import { getProfile } from "../api/profile"

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
  login: (body: LoginBody) => Promise<void>
  logout: () => Promise<void>
  isVenueManager: boolean
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("holidaze_auth")
      if (stored) {
        const parsed = JSON.parse(stored) as { user: AuthUser }
        return parsed.user ?? null
      }

      const rawUser = localStorage.getItem("holidaze_user")
      if (rawUser) {
        return JSON.parse(rawUser) as AuthUser
      }
    } catch {
    }
    return null
  })

  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("holidaze_auth")
      if (stored) {
        const parsed = JSON.parse(stored) as { token: string }
        return parsed.token ?? null
      }
      return localStorage.getItem("holidaze_token")
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isVenueManager = !!user?.venueManager

  useEffect(() => {
    if (user && token) {
      const payload = { user, token }
      localStorage.setItem("holidaze_auth", JSON.stringify(payload))
      localStorage.setItem("holidaze_user", JSON.stringify(user))
      localStorage.setItem("holidaze_token", token)
    } else {
      localStorage.removeItem("holidaze_auth")
      localStorage.removeItem("holidaze_user")
      localStorage.removeItem("holidaze_token")
    }
  }, [user, token])

  useEffect(() => {
    if (!user || !token) return
    if (user.venueManager !== undefined && user.venueManager !== null) return

    const safeUser = user as AuthUser
    const username = safeUser.name
    const baseAvatar = safeUser.avatar ?? null

    let ignore = false

    async function enrichFromProfile() {
      try {
        const profile = await getProfile(username)
        if (ignore) return

        const enriched: AuthUser = {
          ...safeUser,
          venueManager: !!profile.venueManager,
          avatar: profile.avatar ?? baseAvatar,
        }

        setUser(enriched)
      } catch {
      }
    }

    enrichFromProfile()

    return () => {
      ignore = true
    }
  }, [user, token])

  async function login(body: LoginBody) {
    setLoading(true)
    setError(null)

    try {
      const { user: baseUser, token: newToken } = await loginRequest(body)

      setToken(newToken)
      let enrichedUser: AuthUser = { ...baseUser }

      try {
        const profile = await getProfile(baseUser.name)
        enrichedUser = {
          ...baseUser,
          venueManager: !!profile.venueManager,
          avatar: profile.avatar ?? baseUser.avatar ?? null,
        }
      } catch {
      }

      setUser(enrichedUser)
    } catch (err: any) {
      console.error(err)
      setUser(null)
      setToken(null)
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
    setToken(null)
    setError(null)
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isVenueManager,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}