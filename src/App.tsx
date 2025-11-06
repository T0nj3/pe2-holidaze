import { useState } from 'react'
import Header from "./components/Header"
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-base text-text flex flex-col items-center justify-center">
      <Header />
      <h1 className="text-5xl font-serif mb-4">Holidaze 🌴</h1>
      <p className="text-lg text-white/70 mb-6">Tailwind is working perfectly!</p>

      <button
        onClick={() => setCount(count + 1)}
        className="bg-olive px-6 py-3 rounded-md hover:bg-olive/80 transition"
      >
        Clicks: {count}
      </button>
    </div>
  )
}