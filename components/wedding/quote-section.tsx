"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function QuoteSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/gallery-4.jpg"
          alt="Paisaje romantico al atardecer"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      <div
        className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <svg
          className="w-8 h-8 mx-auto mb-6 text-gold opacity-80"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11 7.05C7.28 7.56 4.5 10.78 4.5 14.6v5.4h7V13h-4a4.49 4.49 0 013.5-4.37V7.05zM22 7.05c-3.72.51-6.5 3.73-6.5 7.55v5.4h7V13h-4a4.49 4.49 0 013.5-4.37V7.05z" />
        </svg>
        <blockquote className="text-2xl md:text-4xl font-light text-cream leading-relaxed">
          Cuando algo viene de Dios tu corazón sentirá paz
        </blockquote>
      </div>
    </section>
  );
}
