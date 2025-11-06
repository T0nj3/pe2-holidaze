import { useState } from "react";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#292929] text-white flex flex-col"> 
      <Header />
    </div>
  );
}