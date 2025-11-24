// src/api/auth.ts
import { apiFetch } from "./client"

export type AuthUser = {
  name: string
  email: string
  venueManager: boolean
  avatar?: {
    url: string
    alt: string
  } | null
}

export type LoginBody = {
  email: string
  password: string
}

type LoginResponse = {
  data: AuthUser
  meta: {
    accessToken: string
  }
}

export async function loginRequest(body: LoginBody) {
  const res = await apiFetch<LoginResponse>("/auth/login?_holidaze=true", {
    method: "POST",
    body: JSON.stringify(body),
  })

  return {
    data: res.data,
    accessToken: res.meta.accessToken,
  }
}

// Noroff v2 har ikke eget logout-endepunkt – vi bare rydder lokalt.
// Vi beholder den likevel som "API-funksjon" så AuthContext kan kalle den.
export async function logoutRequest(): Promise<void> {
  return Promise.resolve()
}