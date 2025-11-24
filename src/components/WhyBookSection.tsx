const features = [
    {
      title: "Verified venues",
      description: "Every stay is checked against Holidaze quality standards before it goes live.",
      Icon: CheckBadgeIcon,
    },
    {
      title: "Flexible booking",
      description: "Clear availability, instant confirmation and easy overview of your upcoming trips.",
      Icon: CalendarIcon,
    },
    {
      title: "Secure payments",
      description: "Encrypted payments and trusted providers, so you can focus on the journey.",
      Icon: ShieldIcon,
    },
    {
      title: "Local experiences",
      description: "Stay with hosts who know the area and help you discover hidden gems.",
      Icon: MapPinIcon,
    },
  ];
  
  function CheckBadgeIcon() {
    return (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.5 7.5 4 4 7.5 2.5 12 4 16.5 7.5 20 12 21.5 16.5 20 20 16.5 21.5 12 20 7.5 16.5 4 12 2.5Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  
  function CalendarIcon() {
    return (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2.5v3" />
        <path d="M16 2.5v3" />
        <path d="M3 9h18" />
      </svg>
    );
  }
  
  function ShieldIcon() {
    return (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3 5 6v6.5c0 3.2 2.5 6.1 7 7.5 4.5-1.4 7-4.3 7-7.5V6l-7-3Z" />
        <path d="m9 12 2 2 3-4" />
      </svg>
    );
  }
  
  function MapPinIcon() {
    return (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21.5s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    );
  }
  
  export default function WhyBookSection() {
    return (
      <section className="bg-[#1E1E1E] text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-center">
            Why book with Holidaze?
          </h2>
  
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="bg-[#262626] rounded-xl border border-white/5 p-6 flex flex-col items-start gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white">
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }