"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function OurStorySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-linen">
      <div className="max-w-5xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Nuestra historia
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground">
            Un amor que crece
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="aspect-[4/5] relative rounded-sm overflow-hidden">
              <Image
                src="/images/WhatsApp Image 2026-03-01 at 14.38.09.jpeg"
                alt="Valentina y Santiago juntos en un jardin"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div
            className={`flex flex-col gap-8 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div>
              <span
                className="text-gold text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Primavera 2020
              </span>
              <h3 className="text-xl md:text-2xl font-light text-foreground mt-2 mb-3">
                Donde todo comenzo
              </h3>
              <p
                className="text-muted-foreground leading-relaxed text-base"
                style={{ fontFamily: "var(--font-lato)" }}
              ></p>
            </div>

            <div className="w-16 h-px bg-border" />

            <div>
              <span
                className="text-gold text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Verano 2023
              </span>
              <h3 className="text-xl md:text-2xl font-light text-foreground mt-2 mb-3">
                La propuesta
              </h3>
              <p
                className="text-muted-foreground leading-relaxed text-base"
                style={{ fontFamily: "var(--font-lato)" }}
              ></p>
            </div>

            <div className="w-16 h-px bg-border" />

            <div>
              <span
                className="text-gold text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Noviembre 2026
              </span>
              <h3 className="text-xl md:text-2xl font-light text-foreground mt-2 mb-3">
                El gran dia
              </h3>
              <p
                className="text-muted-foreground leading-relaxed text-base"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Llego el momento de celebrar nuestro amor rodeados de las
                personas que mas queremos. Sera un dia magico que recordaremos
                por siempre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
