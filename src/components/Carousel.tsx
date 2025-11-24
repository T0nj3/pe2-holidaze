import { useEffect, useRef } from "react";

type CarouselProps = {
  title: string;
};

export default function Carousel({ title }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dummy items før API
  const baseItems = Array.from({ length: 6 });
  const items = [...baseItems, ...baseItems, ...baseItems];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const third = el.scrollWidth / 3;
    el.scrollLeft = third;

    const handleScroll = () => {
      const left = el.scrollLeft;

      if (left < third * 0.3) {
        el.scrollLeft = left + third;
      } else if (left > third * 1.7) {
        el.scrollLeft = left - third;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollByAmount = (amount: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
<section className="bg-section text-white py-20">
  <div className="max-w-6xl mx-auto px-4">

    <div className="flex items-center justify-between md:justify-center mb-6 md:mb-12">

      <h2 className="text-4xl md:text-5xl font-serif text-left md:text-center">
        {title}
      </h2>

      <button className="md:hidden text-lg underline">
        View all
      </button>
    </div>

  </div>

        <div className="grid grid-cols-2 gap-6 md:hidden">
          {baseItems.map((_, index) => (
            <div
              key={index}
              className="bg-[#353D64] rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="flex justify-end">
                <span className="text-xl">♡</span>
              </div>

              <div>
                <p className="mt-3 text-lg font-serif">PLACE</p>
                <p className="text-sm tracking-[0.35em]">★★★★★</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-10 hidden md:block">
          <button
            onClick={() => scrollByAmount(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                       bg-black/40 hover:bg-black/60 backdrop-blur-sm 
                       text-white p-3 rounded-full"
          >
            ←
          </button>

          <button
            onClick={() => scrollByAmount(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                       bg-black/40 hover:bg-black/60 backdrop-blur-sm 
                       text-white p-3 rounded-full"
          >
            →
          </button>

          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory 
                       scrollbar-thin scrollbar-thumb-neutral-700 
                       scrollbar-track-neutral-900 h-full items-center"
          >
            {items.map((_, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-64 flex flex-col items-center"
              >
                <div className="w-full h-64 bg-[#E3E3E3] rounded-sm" />
                <p className="mt-4 text-xl tracking-wide">PLACE</p>
                <p className="mt-1 text-sm tracking-[0.35em]">★★★★★</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}