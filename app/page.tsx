"use client";

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------
 * Fecha del casamiento. Se usa para la cuenta regresiva.
 * ---------------------------------------------------------------------- */
const WEDDING_DATE = new Date("2026-11-15T19:00:00-03:00");

/* -------------------------------------------------------------------------
 * Reveal: envuelve una sección y le agrega un fade-up cuando entra en
 * pantalla.
 * ---------------------------------------------------------------------- */
function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * useCountdown: cuenta regresiva hasta la fecha del casamiento.
 * ---------------------------------------------------------------------- */
function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

/* -------------------------------------------------------------------------
 * Divisor ornamental
 * ---------------------------------------------------------------------- */
function Divider({ tone = "dorado" }: { tone?: "dorado" | "principal" }) {
  const lineColor = tone === "dorado" ? "shimmer-line" : "bg-principal/40";
  return (
    <div className="flex items-center justify-center gap-0" aria-hidden="true">
      <span className="mark-diamond" />
      <span className={`h-px w-14 sm:w-20 ${lineColor}`} />
      <span className={`h-px w-14 sm:w-20 ${lineColor}`} />
      <span className={`h-px w-14 sm:w-20 ${lineColor}`} />
      <span className="mark-diamond" />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * FlipUnit: número de la cuenta regresiva
 * ---------------------------------------------------------------------- */
function FlipUnit({ value, label }: { value?: number; label: string }) {
  const display = value !== undefined ? String(value).padStart(2, "0") : "--";
  return (
    <div
      className="flex flex-col items-center"
      style={{ perspective: "400px" }}
    >
      <span
        key={display}
        className="flip-digit tabular font-display text-[38px] text-blanco sm:text-[56px]"
      >
        {display}
      </span>
      <span className="mt-2 font-body text-[19px] uppercase tracking-widest text-dorado-claro sm:text-[20px]">
        {label}
      </span>
    </div>
  );
}

/* Clase reutilizable para los rótulos "eyebrow" */
const EYEBROW = "font-display text-[16px] tracking-widest2";

/* -------------------------------------------------------------------------
 * GALERÍA DE IMÁGENES - 3 imágenes
 * ---------------------------------------------------------------------- */
const GALLERY_IMAGES = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"];

/* -------------------------------------------------------------------------
 * PhotoGallery: Carrusel horizontal con estilo mazo de cartas
 * ---------------------------------------------------------------------- */
function PhotoGallery() {
  const total = GALLERY_IMAGES.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Auto-play
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [isAnimating]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("right");
    const nextIndex = (currentIndex + 1) % total;

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
    }, 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("left");
    const prevIndex = (currentIndex - 1 + total) % total;

    setTimeout(() => {
      setCurrentIndex(prevIndex);
      setIsAnimating(false);
    }, 500);
  };

  const goToCard = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    if (index > currentIndex) {
      goToNext();
    } else {
      goToPrev();
    }
  };

  // Obtener las 3 cartas visibles
  const getVisibleCards = () => {
    const prev = (currentIndex - 1 + total) % total;
    const next = (currentIndex + 1) % total;
    return [prev, currentIndex, next];
  };

  // Rotación para cada carta (fija por índice)
  const getRotation = (index: number) => {
    const rotations = [-3, 0, 3];
    const pos = index % rotations.length;
    return rotations[pos];
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden">
      {/* Contenedor principal */}
      <div className="relative h-[460px] w-full sm:h-[540px] flex items-center justify-center">
        {visibleCards.map((cardIndex) => {
          const isCurrent = cardIndex === currentIndex;
          const rotation = getRotation(cardIndex);

          // Calcular el desplazamiento horizontal basado en la posición
          let translateX = 0;
          // Usar valores relativos para mejor adaptación en mobile
          const cardWidth = 300; // Ancho base de la carta
          const gap = 20; // Gap base

          if (cardIndex === currentIndex) {
            translateX = 0;
          } else if (
            cardIndex === (currentIndex + 1) % total ||
            (cardIndex === 0 && currentIndex === total - 1)
          ) {
            translateX = cardWidth + gap;
          } else {
            translateX = -(cardWidth + gap);
          }

          // Durante la animación, mover las cartas
          if (isAnimating) {
            const moveAmount = (cardWidth + gap) * 0.5;
            if (direction === "right") {
              if (cardIndex === currentIndex) {
                translateX = -moveAmount;
              } else if (cardIndex === (currentIndex + 1) % total) {
                translateX = cardWidth + gap - moveAmount;
              } else {
                translateX = -(cardWidth + gap) - moveAmount;
              }
            } else {
              if (cardIndex === currentIndex) {
                translateX = moveAmount;
              } else if (cardIndex === (currentIndex - 1 + total) % total) {
                translateX = -(cardWidth + gap) + moveAmount;
              } else {
                translateX = cardWidth + gap + moveAmount;
              }
            }
          }

          // Escala y opacidad
          const scale = isCurrent ? 1 : 0.9;
          const opacity = isCurrent ? 1 : 0.6;

          // Sombra
          let shadow = "0 8px 30px rgba(0,0,0,0.12)";
          if (isCurrent && !isAnimating) {
            shadow =
              "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(213,176,55,0.15)";
          }

          // Z-index
          const zIndex = isCurrent ? 10 : 5;

          // Transform final
          const transform = `translateX(${translateX}px) rotate(${rotation}deg) scale(${scale})`;

          // Calcular el ancho de la carta según el viewport
          const cardWidthClass = "w-[280px] sm:w-[340px] md:w-[380px]";

          return (
            <div
              key={`card-${cardIndex}`}
              className={`absolute ${cardWidthClass}`}
              style={{
                transform: transform,
                zIndex: zIndex,
                borderRadius: "16px",
                overflow: "hidden",
                background: "#ffffff",
                border:
                  isCurrent && !isAnimating
                    ? "2px solid rgba(213,176,55,0.25)"
                    : "1px solid rgba(213,176,55,0.08)",
                opacity: opacity,
                height: "92%",
                maxHeight: "480px",
                boxShadow: shadow,
                pointerEvents: isCurrent && !isAnimating ? "auto" : "none",
                transition: isAnimating
                  ? "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, box-shadow 0.3s ease"
                  : "transform 0.4s ease, opacity 0.4s ease, box-shadow 0.3s ease",
                willChange: "transform, opacity",
                left: "50%",
                // Centrar perfectamente usando transform con translateX
                transform: `${transform} translateX(-50%)`,
                cursor: isCurrent && !isAnimating ? "pointer" : "default",
              }}
              onClick={() => {
                if (isCurrent && !isAnimating) {
                  goToNext();
                }
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src={GALLERY_IMAGES[cardIndex]}
                  alt={`Foto ${cardIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading={cardIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />

                {/* Indicador de número */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-[11px] font-display tracking-wider">
                    {cardIndex + 1} / {total}
                  </span>
                </div>

                {/* Overlay sutil en la imagen actual */}
                {isCurrent && !isAnimating && (
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={goToPrev}
          disabled={isAnimating}
          className="p-3 rounded-full border border-dorado/30 text-principal hover:bg-dorado hover:text-principal transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Anterior"
        >
          <svg
            className="w-5 h-5"
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

        <div className="flex gap-2">
          {GALLERY_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToCard(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  i === currentIndex
                    ? "bg-dorado w-6"
                    : "bg-dorado/25 w-2 hover:bg-dorado/50"
                }
              `}
              aria-label={`Ir a foto ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={isAnimating}
          className="p-3 rounded-full border border-dorado/30 text-principal hover:bg-dorado hover:text-principal transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Siguiente"
        >
          <svg
            className="w-5 h-5"
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

      <p className="mt-4 text-center text-xs text-principal/40 font-display tracking-wider">
        Haz clic en la foto para avanzar
      </p>
    </div>
  );
}

/* ============================================================
 * PÁGINA PRINCIPAL
 * ============================================================ */
export default function Home() {
  const countdown = useCountdown(WEDDING_DATE);

  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [nombre, setNombre] = useState("");
  const [restricciones, setRestricciones] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main className="overflow-x-hidden bg-secundario">
      {/* ================= HERO ================= */}
      <section
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Hero.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-[2] flex w-full max-w-2xl flex-col items-center">
          <p
            className="fade-in-up font-display text-[17px] tracking-widest2 text-dorado sm:text-[20px]"
            style={{ animationDelay: "0.1s" }}
          >
            NOS CASAMOS
          </p>

          <h1
            className="write-in mt-6 font-script text-[54px] leading-[0.95] tracking-[0.02em] text-blanco sm:text-[80px]"
            style={{ animationDelay: "0.4s" }}
          >
            Evelyn
          </h1>

          <div className="my-3 flex items-center gap-3 sm:my-4 sm:gap-5">
            <span className="h-px w-16 bg-blanco/40 sm:w-24" />
            <span
              className="write-in font-script text-[30px] tracking-[0.02em] text-dorado sm:text-[44px]"
              style={{ animationDelay: "1.6s", animationDuration: "0.6s" }}
            >
              y
            </span>
            <span className="h-px w-16 bg-blanco/40 sm:w-24" />
          </div>

          <h1
            className="write-in font-script text-[54px] leading-[1] tracking-[0.02em] text-blanco sm:text-[80px]"
            style={{ animationDelay: "2.1s", animationDuration: "1.3s" }}
          >
            Juanma
          </h1>

          <div className="mt-14 sm:mt-16">
            <p
              className="fade-in-up mt-3 font-display text-[18px] tracking-widest2 text-dorado-claro sm:text-[24px]"
              style={{ animationDelay: "3.6s" }}
            >
              15 DE NOVIEMBRE, 2026
            </p>
          </div>
        </div>
      </section>

      {/* ================= BIENVENIDA ================= */}
      <Reveal>
        <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-28">
          <p className="font-body text-[32px] italic leading-relaxed text-principal sm:text-[38px]">
            Nos casamos y queremos que seas parte de este día.
          </p>
          <div className="mt-8">
            <Divider />
          </div>
        </section>
      </Reveal>

      {/* ================= CUENTA REGRESIVA ================= */}
      <Reveal>
        <section
          className="relative px-6 py-20 text-center sm:py-24 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Reloj.jpeg')" }}
        >
          <div className="absolute inset-0 bg-principal/70" />
          <div className="relative z-[2]">
            <p className="texto-reloj">FALTA POCO</p>
            <div className="relative z-[2] mx-auto mt-8 grid max-w-md grid-cols-4 gap-3 sm:gap-6">
              <FlipUnit value={countdown?.days} label="Días" />
              <FlipUnit value={countdown?.hours} label="Horas" />
              <FlipUnit value={countdown?.minutes} label="Min" />
              <FlipUnit value={countdown?.seconds} label="Seg" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ================= CEREMONIA Y FIESTA ================= */}
      <Reveal>
        <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
          <div className="text-center">
            <p className={EYEBROW}>LA CELEBRACIÓN</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
              Dónde y cuándo
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10">
            <div className="rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center">
              <p className="font-display text-[22px] tracking-widest2 text-principal">
                Jano's Bella vista 1
              </p>
              <div className="mx-auto my-5 w-10">
                <Divider />
              </div>
              <p className="font-body text-[28px] text-principal">
                Corrientes 1682, Provincia de Buenos Aires
              </p>
              <p className="mt-2 font-body text-[24px] text-principal/70">
                16:30 hs
              </p>
            </div>

            <div className="rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center">
              <p className="font-display text-[22px] tracking-widest2 text-principal">
                FIESTA
              </p>
              <div className="mx-auto my-5 w-10">
                <Divider />
              </div>
              <p className="font-body text-[28px] text-principal">
                Estancia La Candelaria
              </p>
              <p className="mt-2 font-body text-[24px] text-principal/70">
                20:30 hs
              </p>
              <p className="font-body text-[24px] text-principal/70">
                Ruta 2, km 68, Buenos Aires
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ================= CÓDIGO DE VESTIMENTA ================= */}
      <Reveal>
        <section className="mx-auto max-w-xl px-6 py-24 text-center sm:py-28">
          <p className={EYEBROW}>CÓDIGO DE VESTIMENTA</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Elegante
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-principal/80">
            Queremos que nos acompañen en esta noche tan especial luciendo sus
            mejores galas.
            <br />
            <br />
            Evitando la gama de azules y celestes que estarán reservados para la
            pareja. 💙
          </p>
        </section>
      </Reveal>

      {/* ================= GALERÍA ================= */}
      <Reveal>
        <section className="mx-auto max-w-xl px-6 py-24 text-center sm:py-28">
          <p className={EYEBROW}>GALERÍA</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Nosotros
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <PhotoGallery />
        </section>
      </Reveal>

      {/* ================= REGALOS ================= */}
      <Reveal>
        <section className="grain relative bg-principal px-6 py-24 text-center sm:py-28">
          <div className="relative z-[2] mx-auto max-w-xl">
            <p className={EYEBROW}>REGALOS</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
              Regalos
            </h2>
            <div className="mx-auto my-8 w-10">
              <Divider />
            </div>
            <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-blanco/80">
              Si querés colaborar con un regalo, podés hacerlo con dinero para
              ayudarnos a cumplir nuestro sueño de la luna de miel. De
              preferencia en efectivo.
            </p>
            <button className="mt-8 border border-dorado px-8 py-3 font-display text-[20px] tracking-widest2 text-dorado-claro transition-colors hover:bg-dorado hover:text-principal">
              VER DATOS BANCARIOS
            </button>
          </div>
        </section>
      </Reveal>

      {/* ================= RSVP ================= */}
      <Reveal>
        <section className="mx-auto max-w-lg px-6 py-24 sm:py-28">
          <div className="text-center">
            <p className={EYEBROW}>CONFIRMACIÓN</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
              Confirmá tu asistencia
            </h2>
            <p className="mt-4 font-body text-[24px] text-principal/70">
              Por favor confirmá antes del 20º de septiembre de 2026.
            </p>
          </div>

          {enviado ? (
            <div className="mt-12 rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center">
              <p className="font-script text-[38px] tracking-[0.02em] text-principal">
                ¡Gracias, {nombre || "querido invitado"}!
              </p>
              <p className="mt-3 font-body text-[24px] text-principal/70">
                Recibimos tu confirmación. Te esperamos con muchas ganas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="font-display text-[20px] tracking-widest text-principal/70"
                >
                  NOMBRE Y APELLIDO
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-2 w-full border-b border-principal/30 bg-transparent py-2 font-body text-[26px] text-principal outline-none focus-visible:border-dorado"
                />
              </div>

              <fieldset>
                <legend className="font-display text-[20px] tracking-widest text-principal/70">
                  ¿VAS A PODER ACOMPAÑARNOS?
                </legend>
                <div className="mt-3 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setAsistencia("si")}
                    className={`flex-1 border px-4 py-3 font-body text-[24px] transition-colors ${
                      asistencia === "si"
                        ? "border-dorado bg-dorado text-principal"
                        : "border-principal/30 text-principal/80"
                    }`}
                  >
                    Sí, ahí voy a estar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsistencia("no")}
                    className={`flex-1 border px-4 py-3 font-body text-[24px] transition-colors ${
                      asistencia === "no"
                        ? "border-dorado bg-dorado text-principal"
                        : "border-principal/30 text-principal/80"
                    }`}
                  >
                    No voy a poder ir
                  </button>
                </div>
              </fieldset>

              {asistencia === "si" && (
                <div>
                  <label
                    htmlFor="restricciones"
                    className="font-display text-[20px] tracking-widest text-principal/70"
                  >
                    RESTRICCIONES ALIMENTARIAS
                  </label>
                  <input
                    id="restricciones"
                    type="text"
                    placeholder="Vegetariano, celíaco, alergias, etc. (opcional)"
                    value={restricciones}
                    onChange={(e) => setRestricciones(e.target.value)}
                    className="mt-2 w-full border-b border-principal/30 bg-transparent py-2 font-body text-[26px] text-principal outline-none placeholder:text-principal/40 focus-visible:border-dorado"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!asistencia}
                className="w-full bg-principal py-4 font-display text-[20px] tracking-widest2 text-blanco transition-colors hover:bg-principal2 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                CONFIRMAR
              </button>
            </form>
          )}
        </section>
      </Reveal>

      {/* ================= VERSÍCULO BÍBLICO ================= */}
      <Reveal>
        <section
          className="relative px-6 text-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Biblia.jpeg')",
            paddingTop: "6rem",
            paddingBottom: "6rem",
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Degradé superior: de secundario a transparente */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, #eef3f8 0%, transparent 100%)",
            }}
          />
          {/* Degradé inferior: de transparente a principal */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #102948 0%, transparent 100%)",
            }}
          />
          {/* Overlay oscuro sobre la imagen */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-[2] mx-auto max-w-2xl">
            <p className="font-body text-[28px] italic leading-relaxed text-blanco sm:text-[34px]">
              “Y sobre todas estas cosas vestíos de amor, que es el vínculo
              perfecto.”
            </p>
            <p className="mt-4 font-display text-[18px] tracking-widest2 text-dorado-claro">
              Colosenses 3:14
            </p>
            <div className="mt-8">
              <Divider tone="dorado" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ================= FOOTER ================= */}
      <footer className="grain relative bg-principal px-6 py-20 text-center">
        <div className="relative z-[2]">
          <p className="font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
            Evelyn <span className="text-dorado">y</span> Juan Manuel
          </p>
          <div className="mx-auto my-6 w-16">
            <Divider />
          </div>
          <p className="font-body text-[22px] tracking-wide text-blanco/60">
            15 DE NOVIEMBRE, 2026 · BUENOS AIRES
          </p>
        </div>
      </footer>
    </main>
  );
}
