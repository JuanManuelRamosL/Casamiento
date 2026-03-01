"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Heart } from "lucide-react";

export function FooterSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <footer ref={ref} className="py-20 md:py-28 bg-linen">
      <div
        className={`max-w-2xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4">
          Evelyn & Juanmanuel
        </h2>
        <p
          className="text-muted-foreground text-base mb-8"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          15 de Noviembre, 2026
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="block w-12 h-px bg-border" />
          <Heart className="w-4 h-4 text-primary" />
          <span className="block w-12 h-px bg-border" />
        </div>

        <p
          className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Gracias por ser parte de nuestras vidas y acompanarnos en este nuevo
          comienzo. Los esperamos con mucho amor.
        </p>

        <p
          className="text-muted-foreground/60 text-xs mt-12 tracking-wider uppercase"
          style={{ fontFamily: "var(--font-lato)" }}
        ></p>
      </div>
    </footer>
  );
}
