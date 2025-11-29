import { useEffect, useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { getProfile, updateProfile, type Profile } from "../api/profile"

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarAlt, setAvatarAlt] = useState("")
  const [bannerUrl, setBannerUrl] = useState("")
  const [bannerAlt, setBannerAlt] = useState("")

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const username = user.name
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const data = await getProfile(username)
        if (ignore) return

        setProfile(data)
        setBio(data.bio || "")
        setAvatarUrl(data.avatar?.url || "")
        setAvatarAlt(data.avatar?.alt || "")
        setBannerUrl(data.banner?.url || "")
        setBannerAlt(data.banner?.alt || "")
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Could not load profile")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const body = {
        bio: bio.trim() ? bio : null,
        avatar: avatarUrl.trim()
          ? {
              url: avatarUrl.trim(),
              alt: avatarAlt.trim() || null,
            }
          : null,
        banner: bannerUrl.trim()
          ? {
              url: bannerUrl.trim(),
              alt: bannerAlt.trim() || null,
            }
          : null,
      }

      const updated = await updateProfile(profile.name, body)
      setProfile(updated)
      setSuccess("Profile updated")

      setUser((prev): typeof prev => {
        if (!prev) return prev

        const nextAvatar =
          updated.avatar && updated.avatar.url
            ? updated.avatar.alt
              ? {
                  url: updated.avatar.url,
                  alt: updated.avatar.alt, 
                }
              : {
                  url: updated.avatar.url, 
                }
            : null

        return {
          ...prev,
          avatar: nextAvatar,
        }
      })
    } catch (err: any) {
      setError(err?.message || "Could not update profile")
    } finally {
      setSaving(false)
    }
  }

  const avatarPreview = avatarUrl || profile?.avatar?.url || ""
  const bannerPreview = bannerUrl || profile?.banner?.url || ""

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:py-14">
        <h1 className="text-3xl font-serif md:text-4xl">Profile</h1>

        <section className="grid gap-8 md:grid-cols-[2fr,3fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-section p-5 md:p-6">
              <h2 className="mb-4 text-xl font-semibold">Overview</h2>
              {loading && <p className="text-sm text-white/70">Loading profile…</p>}

              {!loading && profile && (
                <div className="space-y-3 text-sm md:text-base">
                  <div>
                    <p className="text-white/60">Name</p>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Email</p>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Role</p>
                    <p>{user.venueManager ? "Venue manager" : "Guest"}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-section p-5 md:p-6">
                <h2 className="mb-4 text-sm font-semibold text-white/80">Avatar preview</h2>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/10">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={avatarAlt || "Avatar preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60">
                    Use a square image URL for best results.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-section p-5 md:p-6">
                <h2 className="mb-4 text-sm font-semibold text-white/80">Banner preview</h2>
                <div className="h-24 w-full overflow-hidden rounded-xl bg-white/5">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt={bannerAlt || "Banner preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-white/50">
                      No banner selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-section p-5 md:p-6">
            <h2 className="text-xl font-semibold">Edit profile</h2>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-2 text-sm text-red-100">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-900/30 px-4 py-2 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                placeholder="Tell guests a bit about yourself and how you like to travel."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Avatar URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                placeholder="https://…"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Avatar alt text</label>
              <input
                type="text"
                value={avatarAlt}
                onChange={(e) => setAvatarAlt(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text_white/80">Banner URL</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                placeholder="https://…"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/80">Banner alt text</label>
              <input
                type="text"
                value={bannerAlt}
                onChange={(e) => setBannerAlt(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-olive focus:outline-none"
                placeholder="Describe the banner image"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || loading}
                className="w-full rounded-md bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving changes…" : "Save profile"}
              </button>
            </div>

            <p className="text-xs text-white/40">
              Changes are stored via the Holidaze profiles API.
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}