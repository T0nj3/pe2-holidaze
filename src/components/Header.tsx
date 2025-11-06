export default function Header() {
    return (
      <header className="w-full bg-base text-white py-6 flex flex-col items-center border-b border-white/20">
        <h1 className="text-6xl font-serif mb-2">Holidaze</h1>
        <div className="flex items-center justify-center gap-8">
          <nav className="flex gap-10 text-lg">
            <a href="#" className="hover:underline underline-offset-4">Home</a>
            <a href="#" className="hover:underline underline-offset-4 font-semibold">Venues</a>
            <a href="#" className="hover:underline underline-offset-4">My bookings</a>
          </nav>
          <button className="bg-olive px-4 py-2 rounded-md hover:bg-olive/80 transition ml-8">
            Log in
          </button>
        </div>
      </header>
    );
  }