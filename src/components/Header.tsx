type HeaderProps = {
  variant?: "landing" | "default";
};

export default function Header({ variant = "default" }: HeaderProps) {
  const isLanding = variant === "landing";

  return (
    <header className="relative w-full">
      {isLanding && (
        <div className="absolute inset-0 bg-base/25 backdrop-blur-sm z-0" />
      )}

      <div
         className={
          "relative z-10 w-full text-white flex flex-col items-center py-10 " +
          (isLanding
            ? "border-b border/30" 
            : "bg-[#292929] border-b border-white/10")
        }
      >
        <h1 className="text-6xl font-serif mb-4">Holidaze</h1>

        <div className="flex items-center justify-center gap-8">
        <nav className="flex gap-8 text-xl">
          {["Home", "Venues", "My bookings"].map((item) => (
            <a key={item} href="#"className="relative group">{item}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
    </a>
  ))}
  
  </nav>
  <button className="bg-olive px-4 py-2 rounded-md hover:bg-olive/80 ml-8">Log in</button>
        </div>
      </div>
    </header>
  );
}