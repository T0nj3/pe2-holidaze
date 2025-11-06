import { useState } from 'react'
import './App.css'
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-base text-text">
      <Header />
      <div className="pt-32 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-serif mb-4">Holidaze 🌴</h1>
        <p className="text-lg text-white/70 mb-6">
          Tailwind is working perfectly!
        </p>
        <button className="bg-olive px-6 py-3 rounded-md hover:bg-olive/80 transition">
          Book your next stay
        </button>
      </div>
    </div>
  );
}