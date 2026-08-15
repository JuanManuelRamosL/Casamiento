"use client";

import { useEffect, useState } from "react";
import { GALLERY_IMAGES } from "../utils/constants";

export function PhotoGallery() {
  const total = GALLERY_IMAGES.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = setInterval(goToNext, 4000);
    return () => clearInterval(id);
  }, []);

  const getRotation = (index: number) => {
    const rotations = [-4, 0, 4, -2, 2];
    return rotations[index % rotations.length];
  };

  return (
    <div className="relative mx-auto max-w-2xl rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {GALLERY_IMAGES.map((src, index) => (
          <div
            key={index}
            className="relative min-w-full h-[340px] sm:h-[400px] flex items-center justify-center px-2 py-2"
          >
            <div
              className="relative w-[90%] h-[92%] rounded-2xl overflow-hidden shadow-2xl border border-dorado/20"
              style={{
                transform: `rotate(${getRotation(index)}deg)`,
                boxShadow:
                  index === currentIndex
                    ? "0 20px 60px rgba(0,0,0,0.3)"
                    : "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={src}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full z-10">
                <span className="text-white text-xs font-display tracking-wider">
                  {index + 1} / {total}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToCard(i)}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${
                i === currentIndex
                  ? "bg-dorado w-5"
                  : "bg-white/50 w-1.5 hover:bg-white/70"
              }
            `}
            aria-label={`Ir a foto ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 z-10"
        aria-label="Anterior"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 z-10"
        aria-label="Siguiente"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
