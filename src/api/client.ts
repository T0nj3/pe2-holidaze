const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY

type ApiOptions = RequestInit & {
  auth?: boolean
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { auth, headers, ...rest } = options

  const token = auth
    ? localStorage.getItem("holidaze_token") ?? localStorage.getItem("token")
    : null

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (data && (data.errors?.[0]?.message || data.message)) ||
      `Request failed with status ${response.status}`

    throw new Error(message)
  }

  return data as T
}