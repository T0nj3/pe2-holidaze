import {
  CheckBadgeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Verified venues",
    description:
      "Every stay is checked against Holidaze quality standards before it goes live.",
    Icon: CheckBadgeIcon,
  },
  {
    title: "Flexible booking",
    description:
      "Instant confirmation, clear availability and easy overview of your trips.",
    Icon: CalendarDaysIcon,
  },
  {
    title: "Secure payments",
    description:
      "Encrypted transactions with trusted providers for safe and smooth booking.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Local experiences",
    description:
      "Stay with hosts who know the area and help you discover hidden gems.",
    Icon: MapPinIcon,
  },
];

export default function WhyBookSection() {
  return (
    <section className="bg-base text-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif text-center">
          Why book with Holidaze?
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="bg-section rounded-xl border border-white/10 p-8 min-h-[280px] flex flex-col gap-5 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white">{title}</h3>

              <p className="text-[15px] text-white/80 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}