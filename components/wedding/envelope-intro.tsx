"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/* Grano fino de papel */
const PAPER_NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.32 0 0 0 0 0.26 0 0 0 0 0.17 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(#p)'/></svg>"
)}")`;

/* Grano de la cera (ruido gris, para romper la superficie lisa del sello) */
const SEAL_NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' seed='5' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#s)'/></svg>"
)}")`;

/**
 * Escena de apertura unificada (sobre + hero) sobre UNA sola imagen.
 *
 * Es una seccion alta con un contenedor `sticky` que queda fijo mientras se
 * recorre. Un unico valor de scroll (progress 0->1) controla todo:
 *  - el sello se rompe y la solapa del sobre se abre
 *  - el sobre sube y se desvanece
 *  - la imagen de fondo pasa de desenfocada a nitida
 *  - los textos del hero (nombres, fecha) aparecen a la vez
 *
 * Al no haber traspaso a otra seccion, no existe ningun "corte" ni parte
 * blanca: todo ocurre encima de la misma imagen y al terminar se hace scroll
 * natural hacia la siguiente seccion.
 */
export function EnvelopeIntro() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);

    let raf = 0;
    const clamp = (n: number) => Math.min(Math.max(n, 0), 1);
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const dist = section.offsetHeight - window.innerHeight;
        const p = dist > 0 ? clamp(-rect.top / dist) : 0;
        setProgress(p);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

  // Fases de la animacion
  const sealP = clamp(progress / 0.12); // el sello se rompe primero
  const flapP = clamp((progress - 0.08) / 0.34); // luego se abre la solapa
  const fadeP = clamp((progress - 0.44) / 0.26); // el sobre sube y se desvanece
  const focusP = clamp(progress / 0.72); // la imagen se enfoca
  const textIn = clamp((progress - 0.5) / 0.3); // aparecen los textos del hero

  const sealOpacity = 1 - sealP;
  const sealTransform = `translate(-50%, -50%) scale(${1 + sealP * 0.7}) rotate(${sealP * 20}deg)`;
  const flapRotate = -180 * flapP;
  const envelopeTransform = `translateY(${-fadeP * 16}vh) scale(${1 + fadeP * 0.14})`;
  const envelopeOpacity = 1 - fadeP;

  const bgBlur = 20 * (1 - focusP);
  const bgScale = 1 + 0.08 * (1 - focusP);
  const darkAlpha = 0.5 - 0.2 * focusP; // arranca oscuro y aclara al hero (30%)

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {/* ===== Imagen de fondo (unica, se enfoca al bajar) ===== */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/pelo.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center 85%",
              filter: `blur(${bgBlur}px)`,
              transform: `scale(${bgScale})`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(30,25,20,${darkAlpha})` }}
          />
        </div>

        {/* ===== Textos del hero (aparecen a la vez que se enfoca) ===== */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{
            opacity: textIn,
            transform: `translateY(${(1 - textIn) * 24}px)`,
          }}
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

        {/* ===== Sobre (se abre y se desvanece) ===== */}
        <div
          className="relative z-20 w-full max-w-[520px]"
          style={{
            perspective: "1400px",
            transform: envelopeTransform,
            opacity: mounted ? envelopeOpacity : 0,
            transition: mounted ? "none" : "opacity 0.9s ease",
            pointerEvents: envelopeOpacity < 0.05 ? "none" : "auto",
            willChange: "transform, opacity",
          }}
        >
          {/* sombra de contacto */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "-7%",
              width: "94%",
              height: "22%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(20,12,4,0.6) 0%, rgba(20,12,4,0.35) 45%, rgba(20,12,4,0) 72%)",
              filter: "blur(10px)",
              zIndex: -1,
            }}
          />

          {/* ===== Cuerpo del sobre ===== */}
          <div
            className="relative w-full overflow-hidden rounded-[3px] shadow-2xl"
            style={{
              aspectRatio: "3 / 2",
              background:
                "linear-gradient(155deg, #faf6ef 0%, #f3ece0 60%, #ece3d3 100%)",
              border: "1px solid #d8cdb8",
              boxShadow:
                "0 40px 80px -20px rgba(72,54,32,0.45), 0 8px 24px -8px rgba(72,54,32,0.25)",
            }}
          >
            {/* grano fino del papel */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: PAPER_NOISE,
                backgroundSize: "200px 200px",
                opacity: 0.9,
                mixBlendMode: "multiply",
              }}
            />

            {/* bolsillo inferior del sobre */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                background: "linear-gradient(to top, #ede4d4 0%, #f6f0e6 100%)",
                filter: "drop-shadow(0 -0.5px 0.5px rgba(150,120,80,0.55))",
                boxShadow: "inset 0 12px 22px -12px rgba(120,95,55,0.4)",
              }}
            />

            {/* sombra proyectada por la solapa superior cerrada */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[52%]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(110,88,50,0.18), rgba(110,88,50,0) 55%)",
              }}
            />

            {/* vignette de papel */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ boxShadow: "inset 0 0 60px rgba(150,125,85,0.14)" }}
            />

            {/* arrugas / pliegues del papel */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(112deg, transparent 20%, rgba(255,255,255,0.55) 20.6%, rgba(120,95,55,0.16) 21.4%, transparent 22%)," +
                  "linear-gradient(101deg, transparent 63%, rgba(255,255,255,0.45) 63.5%, rgba(120,95,55,0.13) 64.2%, transparent 65%)," +
                  "linear-gradient(82deg, transparent 40%, rgba(255,255,255,0.35) 40.5%, rgba(120,95,55,0.1) 41%, transparent 41.6%)",
                mixBlendMode: "overlay",
                opacity: 0.6,
                filter: "blur(0.5px)",
              }}
            />

            {/* Datos clave del evento (cuando y donde) */}
            <div className="absolute inset-x-0 bottom-0 top-[64%] flex flex-col items-center justify-center px-6 text-center md:top-[62%]">
              <p
                className="text-xl font-light tracking-wide md:text-2xl"
                style={{ color: "#4a3d29" }}
              >
                15 de Noviembre, 2026
              </p>

              <div className="my-2.5 flex items-center justify-center gap-3 md:my-3">
                <span className="block h-px w-10 md:w-14" style={{ background: "#c5a55a66" }} />
                <span className="text-base" style={{ color: "#c5a55a" }}>
                  &#10022;
                </span>
                <span className="block h-px w-10 md:w-14" style={{ background: "#c5a55a66" }} />
              </div>

              <p
                className="text-sm uppercase tracking-[0.15em] md:text-base"
                style={{ fontFamily: "var(--font-lato)", color: "#8b7355" }}
              >
                Janos · Vella Vista I
              </p>
              <p
                className="mt-1 text-xs md:text-sm"
                style={{ fontFamily: "var(--font-lato)", color: "#9a9a9a" }}
              >
                16:30 hs
              </p>
            </div>
          </div>

          {/* ===== Solapa superior (se abre) ===== */}
          <div
            className="absolute left-0 top-0 w-full origin-top"
            style={{
              height: "52%",
              transform: `rotateX(${flapRotate}deg)`,
              transformStyle: "preserve-3d",
              zIndex: flapP > 0.5 ? 1 : 20,
              willChange: "transform",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                // punta inferior redondeada (menos filosa, mas realista)
                clipPath:
                  "polygon(0% 0%, 100% 0%, 54% 92%, 52% 96.5%, 50% 98.5%, 48% 96.5%, 46% 92%)",
                backgroundImage:
                  `${PAPER_NOISE},` +
                  // luz/sombra direccional: lado izquierdo en sombra, derecho iluminado (relieve 3D)
                  "linear-gradient(100deg, rgba(96,74,42,0.3) 0%, rgba(96,74,42,0.08) 30%, transparent 46%, transparent 56%, rgba(255,255,255,0.16) 72%, rgba(255,255,255,0.34) 100%)," +
                  // pliegue central
                  "linear-gradient(90deg, transparent 49.3%, rgba(120,95,55,0.12) 50%, transparent 50.7%)," +
                  // base
                  "linear-gradient(180deg, #f4ede1 0%, #ece0cd 60%, #dccdb2 100%)",
                backgroundSize: "200px 200px, auto, auto, auto",
                backgroundBlendMode: "multiply, normal, normal, normal",
                boxShadow:
                  "0 8px 16px -8px rgba(72,54,32,0.4)," +
                  "inset 0 1px 0 rgba(255,255,255,0.55)," +
                  // borde izquierdo en sombra y derecho con luz -> efecto de relieve
                  "inset 16px 0 22px -14px rgba(80,60,30,0.6)," +
                  "inset -16px 0 22px -14px rgba(255,255,255,0.4)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>

          {/* ===== Sello de lacre azul con monograma J & E ===== */}
          <div
            className="absolute left-1/2 top-[32%] md:top-[40%]"
            style={{
              transform: sealTransform,
              opacity: sealOpacity,
              zIndex: 30,
              willChange: "transform, opacity",
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* base de cera derretida, borde irregular difuso */}
              <div
                aria-hidden
                className="absolute h-[104px] w-[104px] md:h-[122px] md:w-[122px]"
                style={{
                  borderRadius: "52% 48% 46% 54% / 49% 52% 48% 51%",
                  background:
                    "radial-gradient(circle at 50% 52%, rgba(18,36,72,0.6) 0%, rgba(18,36,72,0.35) 60%, rgba(18,36,72,0) 80%)",
                  filter: "blur(3px)",
                  transform: "rotate(-6deg)",
                }}
              />

              {/* cuerpo de la cera */}
              <div
                className="relative flex h-[92px] w-[92px] items-center justify-center md:h-[108px] md:w-[108px]"
                style={{
                  borderRadius: "51% 49% 47% 53% / 53% 48% 52% 47%",
                  background:
                    "radial-gradient(circle at 38% 30%, #5177b3 0%, #3a6098 24%, #294c80 50%, #1b3a66 76%, #122c50 92%, #0d2444 100%)",
                  boxShadow:
                    "inset 0 5px 9px rgba(200,222,255,0.4), inset 0 -10px 18px rgba(8,18,40,0.7), inset 7px 0 13px rgba(8,18,40,0.3), inset -7px 0 13px rgba(8,18,40,0.3), 0 12px 24px -6px rgba(10,24,52,0.75), 0 3px 6px rgba(0,0,0,0.45)",
                }}
              >
                {/* grano/textura de la cera */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: "51% 49% 47% 53% / 53% 48% 52% 47%",
                    backgroundImage: SEAL_NOISE,
                    backgroundSize: "140px 140px",
                    opacity: 0.22,
                    mixBlendMode: "overlay",
                  }}
                />

                {/* anillo interior prensado */}
                <div
                  className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full md:h-[90px] md:w-[90px]"
                  style={{
                    boxShadow:
                      "inset 0 2px 6px rgba(8,18,40,0.6), inset 0 -2px 4px rgba(200,222,255,0.28)",
                    border: "1px solid rgba(14,30,60,0.5)",
                  }}
                >
                  {/* monograma dorado en relieve */}
                  <span
                    className="select-none font-serif text-2xl font-semibold tracking-tight md:text-3xl"
                    style={{
                      backgroundImage:
                        "linear-gradient(150deg, #f6e2a8 0%, #e5c46f 38%, #cfa245 62%, #f2dc9a 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      textShadow: "0 1px 1px rgba(60,40,8,0.45)",
                      filter:
                        "drop-shadow(0 1px 0 rgba(90,60,12,0.6)) drop-shadow(0 -1px 0.5px rgba(255,245,215,0.55))",
                    }}
                  >
                    J
                    <span style={{ fontSize: "0.6em", margin: "0 0.05em", opacity: 0.9 }}>
                      &amp;
                    </span>
                    E
                  </span>
                </div>

                {/* brillo especular */}
                <div
                  aria-hidden
                  className="absolute h-[24px] w-[38px] md:h-[30px] md:w-[46px]"
                  style={{
                    top: "15%",
                    left: "23%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(220,233,255,0.55) 0%, rgba(220,233,255,0) 72%)",
                    filter: "blur(2.5px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Indicacion inicial: desliza para abrir */}
        <div
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
          style={{ opacity: (1 - sealP) * envelopeOpacity, pointerEvents: "none" }}
        >
          <p
            className="mb-2 text-[10px] uppercase tracking-[0.35em]"
            style={{ fontFamily: "var(--font-lato)", color: "#f0e6d2" }}
          >
            Desliza para abrir
          </p>
          <ChevronDown className="mx-auto h-5 w-5 animate-bounce text-cream/80" />
        </div>

        {/* Chevron del hero (aparece al final) */}
        <div
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          style={{ opacity: textIn, pointerEvents: "none" }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce text-cream/60" />
        </div>
      </div>
    </section>
  );
}
