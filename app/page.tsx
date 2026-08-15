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
 * PhotoGallery: Carrusel con estilo mazo de cartas y transición simple
 * ---------------------------------------------------------------------- */
function PhotoGallery() {
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
            className="relative min-w-full h-[400px] sm:h-[480px] flex items-center justify-center p-4"
          >
            <div
              className="relative w-[85%] h-[90%] rounded-2xl overflow-hidden shadow-2xl border border-dorado/20"
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
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                <span className="text-white text-sm font-display tracking-wider">
                  {index + 1} / {total}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-10">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToCard(i)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${
                i === currentIndex
                  ? "bg-dorado w-6"
                  : "bg-white/50 w-2 hover:bg-white/70"
              }
            `}
            aria-label={`Ir a foto ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 z-10"
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

      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 z-10"
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
  );
}

/* -------------------------------------------------------------------------
 * Componente: ClockSection - Sección del reloj con imagen de fondo fija
 * ---------------------------------------------------------------------- */
function ClockSection({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      className="relative px-6 py-16 text-center sm:py-20 overflow-hidden flex items-center justify-center"
      style={{ minHeight: "50vh", minHeight: "50dvh" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Reloj.jpeg')",
          backgroundPosition: isMobile ? "center 30%" : "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-[2] w-full max-w-2xl mx-auto">{children}</div>
    </section>
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
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState<"cbu" | "alias" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(false);

    try {
      const response = await fetch(
        "https://back-casamiento.vercel.app/api/rsvp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            confirma: asistencia === "si",
            alimentacion: restricciones,
          }),
        },
      );

      if (!response.ok) throw new Error("Error al enviar la confirmación");

      setEnviado(true);
    } catch {
      setError(true);
    } finally {
      setEnviando(false);
    }
  }

  const copyToClipboard = (text: string, type: "cbu" | "alias") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const cbu = "0000003100088075383446";
  const alias = "juanmaramosl.mp";

  return (
    <main className="overflow-x-hidden bg-secundario">
      {/* ================= HERO ================= */}
      <section
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-12 text-center bg-cover bg-center bg-no-repeat"
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
        <section className="mx-auto max-w-2xl px-6 py-12 text-center sm:py-14">
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
        <ClockSection>
          <p className="texto-reloj">FALTA POCO</p>
          <div className="relative z-[2] mx-auto mt-6 grid max-w-md grid-cols-4 gap-3 sm:gap-6">
            <FlipUnit value={countdown?.days} label="Días" />
            <FlipUnit value={countdown?.hours} label="Horas" />
            <FlipUnit value={countdown?.minutes} label="Min" />
            <FlipUnit value={countdown?.seconds} label="Seg" />
          </div>
        </ClockSection>
      </Reveal>

      {/* ================= CEREMONIA Y FIESTA ================= */}
      <Reveal>
        <section className="mx-auto max-w-4xl px-6 py-12 text-center sm:py-14">
          <div className="text-center">
            <p className={EYEBROW}>LA CELEBRACIÓN</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
              Dónde y cuándo
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-10">
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


          </div>
        </section>
      </Reveal>

      {/* ================= CÓDIGO DE VESTIMENTA ================= */}
      <Reveal>
        <section className="mx-auto max-w-xl px-6 py-12 text-center sm:py-14">
          <p className={EYEBROW}>CÓDIGO DE VESTIMENTA</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Elegante
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-principal/80">
            Queremos que nos acompañen en esta noche tan especial luciendo sus
            mejores vestidos de gala y trajes elegantes.
            <br />
            <br />
            Evitando la gama de azules y celestes que estarán reservados para la
            pareja. 💙
          </p>
        </section>
      </Reveal>

      {/* ================= GALERÍA ================= */}
      <Reveal>
        <section className="mx-auto max-w-xl px-6 py-12 text-center sm:py-14">
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
        <section className="grain relative bg-principal px-6 py-12 text-center sm:py-14">
          <div className="relative z-[2] mx-auto max-w-xl">
            <p className={EYEBROW}>REGALOS</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
              Regalos
            </h2>
            <div className="mx-auto my-8 w-10">
              <Divider />
            </div>
            <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-blanco/80">
              Si desean obsequiarnos algo, agradeceremos mucho una contribución
              en efectivo para ayudarnos a comenzar esta nueva etapa juntos.
              Habrá sobres a disposición en la entrada del evento. ¡Gracias por
              ser parte de nuestro futuro!
            </p>

            {/* Datos bancarios */}
            <div className="mt-6 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-dorado/20">
                <span className="text-blanco/70 text-sm font-display tracking-wider">
                  CBU:
                </span>
                <span className="text-blanco font-mono text-sm select-all">
                  {cbu}
                </span>
                <button
                  onClick={() => copyToClipboard(cbu, "cbu")}
                  className="w-full sm:w-auto sm:ml-auto px-3 py-1 text-xs font-display tracking-wider text-dorado-claro border border-dorado/30 rounded hover:bg-dorado hover:text-principal transition-all duration-300"
                >
                  {copied === "cbu" ? "✓ COPIADO" : "COPIAR"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-dorado/20">
                <span className="text-blanco/70 text-sm font-display tracking-wider">
                  ALIAS:
                </span>
                <span className="text-blanco font-mono text-sm select-all">
                  {alias}
                </span>
                <button
                  onClick={() => copyToClipboard(alias, "alias")}
                  className="w-full sm:w-auto sm:ml-auto px-3 py-1 text-xs font-display tracking-wider text-dorado-claro border border-dorado/30 rounded hover:bg-dorado hover:text-principal transition-all duration-300"
                >
                  {copied === "alias" ? "✓ COPIADO" : "COPIAR"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ================= RSVP ================= */}
      <Reveal>
        <section className="mx-auto max-w-lg px-6 py-12 text-center sm:py-14">
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
            <div className="mt-8 rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center">
              <p className="font-display text-[18px] tracking-widest2 text-dorado">
                ✓ REGISTRADO
              </p>
              <p className="mt-4 font-script text-[38px] tracking-[0.02em] text-principal">
                ¡Gracias, {nombre || "querido invitado"}!
              </p>
              <p className="mt-3 font-body text-[24px] text-principal/70">
                Recibimos tu confirmación. Te esperamos
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

              {error && (
                <p className="font-body text-[20px] text-red-600">
                  Hubo un error al enviar tu confirmación. Probá de nuevo.
                </p>
              )}

              <button
                type="submit"
                disabled={!asistencia || enviando}
                className="w-full bg-principal py-4 font-display text-[20px] tracking-widest2 text-blanco transition-colors hover:bg-principal2 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                {enviando ? "ENVIANDO..." : "CONFIRMAR"}
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
            paddingTop: "3rem",
            paddingBottom: "3rem",
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, #eef3f8 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #102948 0%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-[2] mx-auto max-w-2xl">
            <p className="font-body text-[28px] italic leading-relaxed text-blanco sm:text-[34px]">
              “Y sobre todas estas cosas vestíos de amor, que es el vínculo
              perfecto.”
            </p>
            <p className="mt-4 font-display text-[18px] tracking-widest2 text-dorado-claro">
              Colosenses 3:14
            </p>
            <div className="mt-6">
              <Divider tone="dorado" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ================= FOOTER ================= */}
      <footer className="grain relative bg-principal px-6 py-10 text-center">
        <div className="relative z-[2]">
          <p className="font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
            Evelyn <span className="text-dorado">y</span> Juan Manuel
          </p>
          <div className="mx-auto my-4 w-16">
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
