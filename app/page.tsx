"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------
 * Fecha del casamiento. Se usa para la cuenta regresiva.
 * Ajustar zona horaria / hora de la ceremonia cuando esté confirmada.
 * ---------------------------------------------------------------------- */
const WEDDING_DATE = new Date("2026-11-15T19:00:00-03:00");

/* -------------------------------------------------------------------------
 * Reveal: envuelve una sección y le agrega un fade-up cuando entra en
 * pantalla. Respeta prefers-reduced-motion (ver globals.css).
 * Cuando dividamos en componentes, esto pasa a components/Reveal.tsx
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
 * Se calcula solo en el cliente para evitar desfasajes de hidratación.
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
 * Divisor ornamental: línea dorada + rombo, motivo que se repite
 * a lo largo de toda la página como firma visual del diseño.
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
 * FlipUnit: un número de la cuenta regresiva que gira sobre su eje
 * cada vez que cambia, como un reloj de estación vintage. El truco es
 * usar `key={display}` para que React remonte el <span> en cada
 * cambio de valor, lo que reinicia la animación CSS automáticamente.
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

/* Clase reutilizable para los rótulos "eyebrow" en mayúsculas */
const EYEBROW = "c";

const GALLERY_IMAGES = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/imagen1.jpeg",
  "/images/imagen2.jpeg",
  "/images/pelo.jpeg",
  "/images/portada.jpeg",
];

/* -------------------------------------------------------------------------
 * PhotoGallery: carrusel que avanza una foto cada 3s. Para el loop
 * infinito se agrega una copia de la primera foto al final; al llegar
 * a esa copia se salta a la foto 0 sin transición (truco clásico de
 * carrusel infinito) para que nunca se note el reinicio.
 * ---------------------------------------------------------------------- */
function PhotoGallery() {
  const total = GALLERY_IMAGES.length;
  const slides = [...GALLERY_IMAGES, GALLERY_IMAGES[0]];
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (index !== total) return;
    const timeout = setTimeout(() => {
      setInstant(true);
      setIndex(0);
    }, 700);
    return () => clearTimeout(timeout);
  }, [index, total]);

  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-sm border border-dorado/30 bg-blanco/60">
      <div
        className="flex"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: instant ? "none" : "transform 0.7s ease",
        }}
      >
        {slides.map((src, i) => (
          <div
            key={i}
            className="relative aspect-4/5 w-full shrink-0 sm:aspect-16/10"
          >
            <Image
              src={src}
              alt={`Foto ${(i % total) + 1} de Evelyn y Juanma`}
              fill
              sizes="(min-width: 640px) 576px, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-0 flex w-full justify-center gap-2">
        {GALLERY_IMAGES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              index % total === i ? "bg-dorado" : "bg-blanco/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const countdown = useCountdown(WEDDING_DATE);

  /* RSVP: estado local del formulario. Todavía no hay backend
   * conectado, así que por ahora solo confirmamos en pantalla. */
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [nombre, setNombre] = useState("");
  const [acompanantes, setAcompanantes] = useState("0");
  const [restricciones, setRestricciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main className="overflow-x-hidden bg-secundario">
      {/* ================= HERO ================= */}
      <section className="hero-gradient fondo-prueba grain-hero relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center">
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

      {/* ================= BIENVENIDA / CITA ================= */}
      <Reveal>
        <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-28 sections">
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
        <section className="prueba relative px-6 py-20 text-center sm:py-24">
          {/* <p className={EYEBROW}>FALTA POCO</p> */}
          <p className="texto-prueba">FALTA POCO</p>
          <div className="relative z-[2] mx-auto mt-8 grid max-w-md grid-cols-4 gap-3 sm:gap-6">
            <FlipUnit value={countdown?.days} label="Días" />
            <FlipUnit value={countdown?.hours} label="Horas" />
            <FlipUnit value={countdown?.minutes} label="Min" />
            <FlipUnit value={countdown?.seconds} label="Seg" />
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
            {/* Ceremonia */}
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

            {/* Fiesta */}
       
          </div>
        </section>
      </Reveal>

      {/* ================= ITINERARIO ================= */}
      {/* <Reveal>
        <section className="grain relative bg-principal px-6 py-24 sm:py-28">
          <div className="relative z-[2] mx-auto max-w-xl text-center">
            <p className={EYEBROW}>ITINERARIO</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
              Cómo va a ser el día
            </h2>

            <div className="mt-14 space-y-10 text-left sm:mt-16">
              {[
                { hora: "19:00", detalle: "Ceremonia religiosa" },
                { hora: "20:30", detalle: "Recepción y brindis" },
                { hora: "21:30", detalle: "Cena" },
                { hora: "23:00", detalle: "Fiesta" },
                { hora: "05:00", detalle: "Última canción" },
              ].map((item, i, arr) => (
                <div key={item.hora} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="mark-diamond" />
                    {i !== arr.length - 1 && (
                      <span className="mt-2 h-full w-px flex-1 bg-dorado/30" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="font-display text-[22px] tracking-widest text-dorado-claro">
                      {item.hora}
                    </p>
                    <p className="mt-1 font-body text-[26px] text-blanco/90">
                      {item.detalle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal> */}

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
Queremos que nos acompañen en esta noche tan especial luciendo sus mejores galas. 

Evitando la gama de azules y celestes que estarán reservados para la pareja. 💙
          </p>
        </section>
      </Reveal>

      {/* ================= GALERÍA DE FOTOS ================= */}
      <Reveal>
        <section className="mx-auto max-w-xl px-6 py-24 text-center sm:py-28">
          <p className={EYEBROW}></p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Nosotros
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <PhotoGallery />
        </section>
      </Reveal>

      {/* ================= MESA DE REGALOS ================= */}
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
           Si querés colaborar con un regalo, podés hacerlo con dinero para ayudarnos a cumplir nuestro sueño de la luna de miel. De preferencia en efectivo.
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
