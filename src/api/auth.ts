import { apiFetch } from "./client"

export type AuthUser = {
  name: string
  email: string
  avatar?: {
    url: string
    alt?: string
  } | null
  venueManager?: boolean
}

export type LoginBody = {
  email: string
  password: string
}

export type RegisterBody = {
  name: string
  email: string
  password: string
  venueManager: boolean
}

type RawLoginResponse = {
  data: AuthUser & {
    accessToken: string
  }
}

type RawRegisterResponse = {
  data: AuthUser
}

export async function loginRequest(body: LoginBody) {
  const res = await apiFetch<RawLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  })

  const { accessToken, ...user } = res.data

  return {
    user,
    token: accessToken,
  }
}

export async function registerRequest(body: RegisterBody) {
  const res = await apiFetch<RawRegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  })

  return {
    user: res.data,
  }
}

export async function logoutRequest() {
  return Promise.resolve()
}