"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-svh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-wedding.jpg"
          alt="Escenario de boda elegante con decoraciones florales"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      <div className="relative z-10 text-center px-6">
        <p
          className={`text-cream/80 text-sm tracking-[0.35em] uppercase mb-6 transition-all duration-1000 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Nos casamos
        </p>

        <h1
          className={`text-cream text-5xl md:text-7xl lg:text-8xl font-light leading-tight transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Evelyn
        </h1>

        <div
          className={`flex items-center justify-center gap-6 my-4 transition-all duration-1000 delay-700 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <span className="block w-16 md:w-24 h-px bg-cream/40" />
          <span className="text-gold text-2xl md:text-3xl font-light">&</span>
          <span className="block w-16 md:w-24 h-px bg-cream/40" />
        </div>

        <h1
          className={`text-cream text-5xl md:text-7xl lg:text-8xl font-light leading-tight transition-all duration-1000 delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Juanmanuel
        </h1>

        <p
          className={`text-cream/70 mt-8 text-lg md:text-xl tracking-widest transition-all duration-1000 delay-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ fontFamily: "var(--font-lato)" }}
        >
          15 de Noviembre, 2026
        </p>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-[1400ms] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronDown className="w-6 h-6 text-cream/60 animate-bounce" />
      </div>
    </section>
  );
}
