"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const images = [
  {
    src: "/images/imagen1.jpeg",
    alt: "Ramo de novia con rosas blancas y eucalipto",
  },
  {
    src: "/images/WhatsApp Image 2026-03-01 at 14.38.09.jpeg",
    alt: "Mesa de recepcion decorada con luces",
  },
  {
    src: "/images/imagen2.jpeg",
    alt: "Anillos de boda con detalles florales",
  },
  {
    src: "/images/WhatsApp Image 2026-03-01 at 14.38.09.jpeg",
    alt: "Valentina y Santiago en un momento romantico",
  },
];

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-linen">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Momentos
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground">
            Nuestra galeria
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`group relative overflow-hidden rounded-sm transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              <div
                className={`relative ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
