"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Escena de apertura: el sobre se abre sincronizado con el scroll, sobre la
 * imagen del hero que pasa de desenfocada a nitida; al abrirse aparecen los
 * nombres.
 *
 * El sobre es un SPRITE: todos los frames (con transparencia) en una sola
 * imagen WebP (public/sobre-atlas.webp, grilla COLS x ROWS). El scrubbing solo
 * mueve la posicion del sprite con `transform` (puro compositor GPU): sin video,
 * sin seeks, sin decodificar nada -> fluido en cualquier dispositivo.
 */

const COLS = 8;
const ROWS = 4;
const NFRAMES = 32;

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

export function EnvelopeIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  // refs de los elementos con estilos guiados por scroll (update imperativo)
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLImageElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const chevRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastFrame = -1;

    const apply = (p: number) => {
      const fadeP = clamp((p - 0.75) / 0.25); // el sobre sube y se desvanece
      const focusP = clamp(p / 0.82); // la imagen se enfoca
      const textIn = clamp((p - 0.7) / 0.25); // aparecen los nombres

      if (bgWrapRef.current)
        bgWrapRef.current.style.transform = `scale(${1 + 0.08 * (1 - focusP)})`;
      if (blurRef.current) blurRef.current.style.opacity = `${1 - focusP}`;
      if (darkRef.current) darkRef.current.style.opacity = `${0.5 - 0.2 * focusP}`;
      if (textRef.current) {
        textRef.current.style.opacity = `${textIn}`;
        textRef.current.style.transform = `translateY(${(1 - textIn) * 24}px)`;
      }
      if (envRef.current) {
        envRef.current.style.opacity = `${1 - fadeP}`;
        envRef.current.style.transform = `translateY(${-fadeP * 12}vh) scale(${1 + fadeP * 0.08})`;
      }
      if (hintRef.current)
        hintRef.current.style.opacity = `${(1 - clamp(p / 0.12)) * (1 - fadeP)}`;
      if (chevRef.current) chevRef.current.style.opacity = `${textIn}`;

      // sprite del sobre: elegir el frame segun el scroll (solo transform)
      const f = Math.round(clamp(p / 0.72) * (NFRAMES - 1)); // abierto al 72%
      if (f !== lastFrame && spriteRef.current) {
        lastFrame = f;
        const col = f % COLS;
        const row = Math.floor(f / COLS);
        spriteRef.current.style.transform = `translate3d(-${(col * 100) / COLS}%, -${(row * 100) / ROWS}%, 0)`;
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const dist = section.offsetHeight - window.innerHeight;
        const p = dist > 0 ? clamp(-rect.top / dist) : 0;
        apply(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {/* ===== Imagen de fondo: crossfade nitida <- desenfocada ===== */}
        <div
          ref={bgWrapRef}
          className="absolute inset-0"
          style={{ transform: "scale(1.08)", willChange: "transform" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/pelo.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center 85%",
            }}
          />
          <div
            ref={blurRef}
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/pelo.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center 85%",
              filter: "blur(20px)",
              opacity: 1,
              willChange: "opacity",
            }}
          />
          <div
            ref={darkRef}
            className="absolute inset-0"
            style={{ backgroundColor: "rgb(30,25,20)", opacity: 0.5, willChange: "opacity" }}
          />
        </div>

        {/* ===== Nombres del hero ===== */}
        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: 0, transform: "translateY(24px)" }}
        >
          <p
            className="mb-6 text-sm uppercase tracking-[0.35em] text-cream/80"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Nos casamos
          </p>
          <h1 className="text-5xl font-light leading-tight text-cream md:text-7xl lg:text-8xl">
            Evelyn
          </h1>
          <div className="my-4 flex items-center justify-center gap-6">
            <span className="block h-px w-16 bg-cream/40 md:w-24" />
            <span className="text-2xl font-light text-gold md:text-3xl">&amp;</span>
            <span className="block h-px w-16 bg-cream/40 md:w-24" />
          </div>
          <h1 className="text-5xl font-light leading-tight text-cream md:text-7xl lg:text-8xl">
            Juan Manuel
          </h1>
          <p
            className="mt-8 text-lg tracking-widest text-cream/70 md:text-xl"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            15 de Noviembre, 2026
          </p>
        </div>

        {/* ===== Sobre (sprite) ===== */}
        <div
          ref={envRef}
          className="pointer-events-none relative z-20 w-[90%] max-w-[540px]"
          style={{ opacity: 1, transform: "translateY(0) scale(1)", willChange: "transform, opacity" }}
        >
          {/* ventana de una celda; el sprite se mueve por dentro */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "420 / 383" }}>
            <img
              ref={spriteRef}
              src="/sobre-atlas.webp"
              alt="Sobre de invitacion"
              className="absolute left-0 top-0"
              style={{
                width: `${COLS * 100}%`,
                height: `${ROWS * 100}%`,
                maxWidth: "none",
                transform: "translate3d(0,0,0)",
                willChange: "transform",
              }}
            />
          </div>
        </div>

        {/* Indicacion inicial */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
          style={{ opacity: 1 }}
        >
          <p
            className="mb-2 text-[10px] uppercase tracking-[0.35em]"
            style={{ fontFamily: "var(--font-lato)", color: "#f0e6d2" }}
          >
            Desliza para abrir
          </p>
          <ChevronDown className="mx-auto h-5 w-5 animate-bounce text-cream/80" />
        </div>

        {/* Chevron del hero */}
        <div
          ref={chevRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          style={{ opacity: 0 }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce text-cream/60" />
        </div>
      </div>
    </section>
  );
}
