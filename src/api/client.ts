// src/api/client.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY as string

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set")
}
if (!API_KEY) {
  throw new Error("VITE_NOROFF_API_KEY is not set")
}

export type ApiError = {
  status: number
  message: string
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...(options.headers as Record<string, string> | undefined),
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && (data.message || data.errors?.[0]?.message)) ||
      `Request failed with status ${res.status}`

    throw {
      status: res.status,
      message,
    } as ApiError
  }

  return data as T
}