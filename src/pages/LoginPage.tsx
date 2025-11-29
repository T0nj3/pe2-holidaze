import { useState } from "react"
import Header from "../components/Header"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"
import Footer from "../components/Footer" 

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen bg-base text-white">
      <Header variant="default" />

      <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl rounded-3xl bg-section px-6 py-8 shadow-2xl md:px-10 md:py-10">
          <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <h1 className="text-3xl md:text-4xl font-serif">
              {mode === "login" ? "Log in" : "Register"}
            </h1>

            <div className="inline-flex rounded-full bg-[#333333] p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`px-4 py-1 rounded-full transition ${
                  mode === "login" ? "bg-olive text-white" : "text-white/70"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`px-4 py-1 rounded-full transition ${
                  mode === "register" ? "bg-olive text-white" : "text-white/70"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <div className="flex-1">
              {mode === "login" ? <LoginForm /> : <RegisterForm />}
            </div>

            <div className="hidden max-w-xs flex-1 text-sm text-white/70 md:block">
              {mode === "login" ? (
                <p>
                  Log in with your <span className="font-semibold">stud.noroff.no</span> email
                  to see your bookings, manage venues and plan your next stay.
                </p>
              ) : (
                <p>
                  Create a Holidaze account to save favourites, make bookings and, if you are a
                  venue manager, host your own stays.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}