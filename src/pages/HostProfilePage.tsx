import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function HostProfilePage() {
  const { name } = useParams<{ name: string }>()

  return (
    <div className="flex min-h-screen flex-col bg-base text-white">
      <Header variant="default" />

      <main className="mx-auto max-w-6xl flex-1 px-4 py-10 md:py-14">
        <h1 className="text-3xl font-serif md:text-4xl">
          Host profile
        </h1>
        <p className="mt-3 text-white/70">
          This page will show details for host{" "}
          <span className="font-semibold">
            {name}
          </span>{" "}
          and their venues.
        </p>
        <p className="mt-6 text-sm text-white/60">
          TODO: Implement host profile view (bio, avatar, list of venues, ratings, etc.).
        </p>
      </main>

      <Footer />
    </div>
  )
}