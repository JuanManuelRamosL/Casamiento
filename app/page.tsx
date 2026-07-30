"use client";

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------
 * Fecha del casamiento. Se usa para la cuenta regresiva.
 * Ajustar zona horaria / hora de la ceremonia cuando esté confirmada.
 * ---------------------------------------------------------------------- */
const WEDDING_DATE = new Date("2026-11-15T19:00:00-03:00");

/* -------------------------------------------------------------------------
 * Hook: useParallax - efecto de movimiento suave al hacer scroll
 * ---------------------------------------------------------------------- */
function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const scrolled = window.scrollY;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

/* -------------------------------------------------------------------------
 * Componente: FloatingParticles - partículas doradas flotando en el hero
 * ---------------------------------------------------------------------- */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const initParticles = () => {
      const count = 25;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4 - 0.15,
          opacity: Math.random() * 0.4 + 0.15,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        // Forma de diamante para las partículas
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(213, 176, 55, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

/* -------------------------------------------------------------------------
 * Componente: FloatingHeart - corazón que sigue un camino ondulante
 * a través de la página mientras el usuario hace scroll
 * ---------------------------------------------------------------------- */
function FloatingHeart() {
  const heartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Refs para mantener estado sin causar re-renders
  const isIdleRef = useRef(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Refs para la posición exacta del corazón
  const positionRef = useRef({
    y: 8,
    x: 50,
    rotation: 0,
    scale: 1,
    opacity: 0.8,
  });

  // Refs para el estado idle - GUARDAMOS LA POSICIÓN INICIAL DEL IDLE
  const idleStateRef = useRef({
    startTime: Date.now(),
    // Guardamos la posición exacta donde empezó el idle
    baseY: 8,
    baseX: 50,
    baseRotation: 0,
  });

  // Ref para detectar si es móvil
  const isMobileRef = useRef(false);

  useEffect(() => {
    const heart = heartRef.current;
    if (!heart) return;

    // Detectar si es móvil
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
      if (isMobileRef.current) {
        const svg = heart.querySelector("svg");
        if (svg) {
          svg.style.width = "20px";
          svg.style.height = "20px";
        }
      } else {
        const svg = heart.querySelector("svg");
        if (svg) {
          svg.style.width = "28px";
          svg.style.height = "28px";
        }
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    let startTime = Date.now();

    // Configuración del camino - ajustada para móvil
    const getAmplitude = () => (isMobileRef.current ? 15 : 30);

    // Función para actualizar la posición del corazón (única fuente de verdad)
    const updateHeartPosition = (
      yPercent: number,
      xPercent: number,
      rotation: number,
      scale: number,
      opacity: number,
      glowIntensity: number = 0,
    ) => {
      if (!heart) return;

      // Limitar la posición Y para que nunca salga de la pantalla
      const minY = 5;
      const maxY = 95;
      const clampedY = Math.min(maxY, Math.max(minY, yPercent));

      // Limitar la posición X
      const minX = 5;
      const maxX = 95;
      const clampedX = Math.min(maxX, Math.max(minX, xPercent));

      // Guardar posición exacta (clampeda)
      positionRef.current = {
        y: clampedY,
        x: clampedX,
        rotation: rotation,
        scale: scale,
        opacity: opacity,
      };

      // Aplicar al DOM
      heart.style.top = `${clampedY}%`;
      heart.style.left = `${clampedX}%`;
      heart.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
      heart.style.opacity = `${opacity}`;

      // Aplicar glow
      const svg = heart.querySelector("svg");
      if (svg) {
        if (glowIntensity > 0.05) {
          const glow = 8 + glowIntensity * 25;
          const glowOpacity = 0.15 + glowIntensity * 0.65;
          svg.style.filter = `drop-shadow(0 0 ${glow}px rgba(213, 176, 55, ${glowOpacity}))`;
        } else {
          svg.style.filter = "drop-shadow(0 0 8px rgba(213, 176, 55, 0.3))";
        }
      }
    };

    // Función para calcular posición basada en scroll
    const calculateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      const elapsed = (Date.now() - startTime) / 1000;

      const viewportHeight = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      const scrollProgress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      // Posición vertical: desde 10% hasta 90%
      const yPosition = 10 + scrollProgress * 80;
      const yPercent = Math.min(90, Math.max(10, yPosition));

      // Posición horizontal: movimiento ondulante
      const amplitude = getAmplitude();
      const waveOffset =
        Math.sin(elapsed * 0.5 + scrollProgress * 20) * amplitude;
      const xPercent = 50 + waveOffset;

      // Rotación sutil
      const rotation = Math.sin(elapsed * 0.3 + scrollProgress * 15) * 8;
      const scale = 1 + Math.sin(elapsed * 0.2) * 0.05;

      // Opacidad
      const fadeProgress = Math.min(
        1,
        Math.min(scrollProgress * 3, (1 - scrollProgress) * 3),
      );
      const opacity = 0.5 + fadeProgress * 0.4;

      return { yPercent, xPercent, rotation, scale, opacity };
    };

    // Función para calcular posición en modo idle
    const calculateIdlePosition = (elapsed: number) => {
      // Usar la posición BASE guardada cuando empezó el idle
      const baseY = idleStateRef.current.baseY;
      const baseX = idleStateRef.current.baseX;
      const baseRotation = idleStateRef.current.baseRotation;

      // Movimiento suave arriba/abajo - desde la posición base
      const idleAmplitude = isMobileRef.current ? 1.5 : 2.5;
      const idleSpeed = 0.5;
      const yOffset = Math.sin(elapsed * idleSpeed) * idleAmplitude;

      // Movimiento horizontal sutil - desde la posición base
      const xOffsetAmplitude = isMobileRef.current ? 3 : 6;
      const xOffset = Math.sin(elapsed * 0.3 + 1) * xOffsetAmplitude;

      // Latido del corazón
      const beatSpeed = isMobileRef.current ? 1.5 : 1.8;
      const beatValue = Math.max(0, Math.sin(elapsed * beatSpeed));
      const beatScale = 1 + beatValue * (isMobileRef.current ? 0.05 : 0.08);
      const glowIntensity = beatValue * (isMobileRef.current ? 0.4 : 0.6) + 0.2;

      // Rotación suave desde la base
      const idleRotation = baseRotation + Math.sin(elapsed * 0.2) * 3;

      // Opacidad
      const idleOpacity = 0.6 + beatValue * 0.25;

      // Calcular nueva posición (SIEMPRE desde la base)
      const newY = baseY + yOffset;
      const newX = baseX + xOffset;

      // Limitar para que nunca se salga
      const finalY = Math.min(92, Math.max(8, newY));
      const finalX = Math.min(88, Math.max(12, newX));

      return {
        yPercent: finalY,
        xPercent: finalX,
        rotation: idleRotation,
        scale: beatScale,
        opacity: idleOpacity,
        glowIntensity: glowIntensity,
      };
    };

    // Manejador de scroll
    const handleScroll = () => {
      // Resetear timer de idle
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      // Salir del modo idle inmediatamente
      if (isIdleRef.current) {
        isIdleRef.current = false;
        // Calcular y aplicar posición de scroll inmediatamente
        const pos = calculateScrollPosition();
        updateHeartPosition(
          pos.yPercent,
          pos.xPercent,
          pos.rotation,
          pos.scale,
          pos.opacity,
          0,
        );
        return;
      }

      // Si no está en idle, actualizar posición normal
      const pos = calculateScrollPosition();
      updateHeartPosition(
        pos.yPercent,
        pos.xPercent,
        pos.rotation,
        pos.scale,
        pos.opacity,
        0,
      );

      // Configurar timer para modo idle (3 segundos)
      idleTimerRef.current = setTimeout(() => {
        if (!isIdleRef.current) {
          isIdleRef.current = true;
          // GUARDAR LA POSICIÓN ACTUAL EXACTA CUANDO EMPIEZA EL IDLE
          idleStateRef.current = {
            startTime: Date.now(),
            baseY: positionRef.current.y,
            baseX: positionRef.current.x,
            baseRotation: positionRef.current.rotation,
          };
        }
      }, 3000);
    };

    // Loop principal de animación
    const animate = () => {
      if (isIdleRef.current) {
        // Modo idle: calcular y aplicar posición idle
        const elapsed = (Date.now() - idleStateRef.current.startTime) / 1000;
        const idlePos = calculateIdlePosition(elapsed);
        updateHeartPosition(
          idlePos.yPercent,
          idlePos.xPercent,
          idlePos.rotation,
          idlePos.scale,
          idlePos.opacity,
          idlePos.glowIntensity,
        );
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Throttle para el scroll
    let ticking = false;
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY !== lastScrollY) {
        lastScrollY = currentScrollY;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      }
    };

    // Configurar listeners
    window.addEventListener("scroll", onScroll, { passive: true });

    // Inicializar con la primera posición
    const initialPos = calculateScrollPosition();
    updateHeartPosition(
      initialPos.yPercent,
      initialPos.xPercent,
      initialPos.rotation,
      initialPos.scale,
      initialPos.opacity,
      0,
    );

    // Iniciar el loop de animación
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", checkMobile);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={heartRef}
      className="fixed pointer-events-none z-50 transition-none"
      style={{
        top: "10%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 0.8,
        willChange: "transform, top, left, opacity, filter",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-none"
        style={{
          filter: "drop-shadow(0 0 8px rgba(213, 176, 55, 0.3))",
        }}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heartGradient)"
          stroke="#d5b037"
          strokeWidth="1.2"
        />
        <defs>
          <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8cd7a" />
            <stop offset="100%" stopColor="#d5b037" />
          </linearGradient>
        </defs>
        {/* Brillo interior */}
        <path
          d="M12 18.5l-1.45-1.32C5.4 13.36 2 10.28 2 8.5 2 7.42 2.5 6.5 3.5 5.8c1.2-.9 2.8-.8 4 .2L12 10.5l4.5-4.5c1.2-1 2.8-1.1 4-.2 1 .7 1.5 1.6 1.5 2.7 0 1.78-3.4 4.86-8.55 9.54L12 18.5z"
          fill="rgba(255,255,255,0.3)"
          opacity="0.5"
        />
        {/* Partículas alrededor del corazón */}
        <circle cx="6" cy="7" r="1.5" fill="#e8cd7a" opacity="0.4">
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="1.5;2;1.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="18" cy="7" r="1.5" fill="#e8cd7a" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="1.5;2.5;1.5"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="12" cy="4" r="1" fill="#e8cd7a" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;0.05;0.3"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="1;1.8;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="8" cy="16" r="1" fill="#e8cd7a" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;0.05;0.2"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="16;15;16"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="16" cy="16" r="1" fill="#e8cd7a" opacity="0.2">
          <animate
            attributeName="opacity"
            values="0.2;0.05;0.2"
            dur="2.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="16;15;16"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Componente: ScrollProgress - barra de progreso dorada en el scroll
 * Versión ultra fluida usando transform scaleX
 * ---------------------------------------------------------------------- */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = total > 0 ? current / total : 0;

      // Limitar entre 0 y 1
      const clampedProgress = Math.min(1, Math.max(0, progress));

      // Solo actualizar si hay cambio significativo
      if (Math.abs(clampedProgress - currentProgressRef.current) > 0.0001) {
        currentProgressRef.current = clampedProgress;
        // Usar transform scaleX para mejor rendimiento
        bar.style.transform = `scaleX(${clampedProgress})`;
      }
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        updateProgress();
        rafRef.current = null;
      });
    };

    const handleResize = () => {
      updateProgress();
    };

    // Actualizar al montar
    updateProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-transparent overflow-hidden">
      <div
        ref={barRef}
        className="h-full w-full bg-dorado origin-left"
        style={{
          transform: "scaleX(0)",
          willChange: "transform",
          transition: "transform 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Reveal: envuelve una sección y le agrega un fade-up cuando entra en
 * pantalla. Respeta prefers-reduced-motion.
 * Solo animación de entrada.
 * ---------------------------------------------------------------------- */
function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale" | "fade";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-50px 0px -50px 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (visible) return "translate(0) scale(1)";
    switch (direction) {
      case "left":
        return "translateX(-50px)";
      case "right":
        return "translateX(50px)";
      case "scale":
        return "scale(0.92)";
      case "fade":
        return "translate(0)";
      default:
        return "translateY(30px)";
    }
  };

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        willChange: "transform, opacity",
      }}
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
 * cada vez que cambia, como un reloj de estación vintage.
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
const EYEBROW = "font-display text-[16px] tracking-widest2";

export default function Home() {
  const countdown = useCountdown(WEDDING_DATE);
  const heroRef = useParallax(0.2);

  /* RSVP: estado local del formulario. Todavía no hay backend
   * conectado, así que por ahora solo confirmamos en pantalla. */
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [nombre, setNombre] = useState("");
  const [acompanantes, setAcompanantes] = useState("0");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main className="overflow-x-hidden bg-secundario">
      <ScrollProgress />
      <FloatingHeart />

      {/* ================= HERO ================= */}
      <section className="hero-gradient fondo-prueba grain-hero relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        <FloatingParticles />
        <div
          ref={heroRef}
          className="relative z-[2] flex w-full max-w-2xl flex-col items-center"
        >
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
      <Reveal direction="fade" delay={100}>
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
      <Reveal direction="scale" delay={150}>
        <section className="container-reloj relative px-6 py-20 text-center sm:py-24">
          <p className="texto-reloj">FALTA POCO</p>
          <div className="relative z-[2] mx-auto mt-8 grid max-w-md grid-cols-4 gap-3 sm:gap-6">
            <FlipUnit value={countdown?.days} label="Días" />
            <FlipUnit value={countdown?.hours} label="Horas" />
            <FlipUnit value={countdown?.minutes} label="Min" />
            <FlipUnit value={countdown?.seconds} label="Seg" />
          </div>
        </section>
      </Reveal>

      {/* ================= CEREMONIA Y FIESTA ================= */}
      <Reveal direction="up" delay={100}>
        <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
          <div className="text-center">
            <p className={EYEBROW}>LA CELEBRACIÓN</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[62px]">
              Dónde y cuándo
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10">
            {/* Ceremonia - con efecto de brillo al hover */}
            <div className="card-glow rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center transition-all duration-300 hover:shadow-xl hover:shadow-dorado/5">
              <p className="font-display text-[22px] tracking-widest2 text-principal">
                CEREMONIA
              </p>
              <div className="mx-auto my-5 w-10">
                <Divider />
              </div>
              <p className="font-body text-[28px] text-principal">
                Iglesia Nuestra Señora del Pilar
              </p>
              <p className="mt-2 font-body text-[24px] text-principal/70">
                19:00 hs
              </p>
              <p className="font-body text-[24px] text-principal/70">
                Recoleta, Buenos Aires
              </p>
            </div>

            {/* Fiesta - con efecto de brillo al hover */}
            <div className="card-glow rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center transition-all duration-300 hover:shadow-xl hover:shadow-dorado/5">
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

      {/* ================= ITINERARIO (Comentado) ================= */}
      {/* <Reveal direction="left" delay={100}>
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
      <Reveal direction="right" delay={100}>
        <section className="mx-auto max-w-xl px-6 py-24 text-center sm:py-28">
          <p className={EYEBROW}>CÓDIGO DE VESTIMENTA</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[62px]">
            Elegante formal
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-principal/80">
            Le pedimos a las invitadas que eviten el color blanco, para que sea
            únicamente el vestido de la novia. ¡Gracias por acompañarnos
            vestidos de gala!
          </p>
        </section>
      </Reveal>

      {/* ================= MESA DE REGALOS ================= */}
      <Reveal direction="scale" delay={150}>
        <section className="grain relative bg-principal px-6 py-24 text-center sm:py-28">
          <div className="relative z-[2] mx-auto max-w-xl">
            <p className={EYEBROW}>REGALOS</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
              Tu presencia ya es un regalo
            </h2>
            <div className="mx-auto my-8 w-10">
              <Divider />
            </div>
            <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-blanco/80">
              Si además querés tener un gesto con nosotros, vamos a estar muy
              felices de recibir tu aporte para nuestra luna de miel.
            </p>
            <button className="mt-8 border border-dorado px-8 py-3 font-display text-[20px] tracking-widest2 text-dorado-claro transition-all duration-300 hover:bg-dorado hover:text-principal hover:scale-105">
              VER DATOS BANCARIOS
            </button>
          </div>
        </section>
      </Reveal>

      {/* ================= RSVP ================= */}
      <Reveal direction="up" delay={100}>
        <section className="mx-auto max-w-lg px-6 py-24 sm:py-28">
          <div className="text-center">
            <p className={EYEBROW}>CONFIRMACIÓN</p>
            <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
              Confirmá tu asistencia
            </h2>
            <p className="mt-4 font-body text-[24px] text-principal/70">
              Por favor confirmá antes del 1º de octubre de 2026.
            </p>
          </div>

          {enviado ? (
            <div className="mt-12 rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center animate-fade-in">
              <p className="font-script text-[38px] tracking-[0.02em] text-principal">
                ¡Gracias, {nombre || "querido invitado"}!
              </p>
              <p className="mt-3 font-body text-[24px] text-principal/70">
                Recibimos tu confirmación. Te esperamos con muchas ganas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div className="form-group">
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
                  className="mt-2 w-full border-b border-principal/30 bg-transparent py-2 font-body text-[26px] text-principal outline-none transition-all duration-300 focus-visible:border-dorado focus-visible:border-b-2"
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
                    className={`flex-1 border px-4 py-3 font-body text-[24px] transition-all duration-300 ${
                      asistencia === "si"
                        ? "border-dorado bg-dorado text-principal shadow-lg shadow-dorado/20"
                        : "border-principal/30 text-principal/80 hover:border-dorado/50 hover:bg-dorado/5"
                    }`}
                  >
                    Sí, ahí voy a estar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsistencia("no")}
                    className={`flex-1 border px-4 py-3 font-body text-[24px] transition-all duration-300 ${
                      asistencia === "no"
                        ? "border-dorado bg-dorado text-principal shadow-lg shadow-dorado/20"
                        : "border-principal/30 text-principal/80 hover:border-dorado/50 hover:bg-dorado/5"
                    }`}
                  >
                    No voy a poder ir
                  </button>
                </div>
              </fieldset>

              {asistencia === "si" && (
                <div className="form-group animate-slide-down">
                  <label
                    htmlFor="acompanantes"
                    className="font-display text-[20px] tracking-widest text-principal/70"
                  >
                    ACOMPAÑANTES
                  </label>
                  <input
                    id="acompanantes"
                    type="number"
                    min={0}
                    max={6}
                    value={acompanantes}
                    onChange={(e) => setAcompanantes(e.target.value)}
                    className="mt-2 w-full border-b border-principal/30 bg-transparent py-2 font-body text-[26px] text-principal outline-none transition-all duration-300 focus-visible:border-dorado focus-visible:border-b-2"
                  />
                </div>
              )}

              <div className="form-group">
                <label
                  htmlFor="mensaje"
                  className="font-display text-[20px] tracking-widest text-principal/70"
                >
                  MENSAJE PARA LOS NOVIOS (OPCIONAL)
                </label>
                <textarea
                  id="mensaje"
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="mt-2 w-full resize-none border-b border-principal/30 bg-transparent py-2 font-body text-[26px] text-principal outline-none transition-all duration-300 focus-visible:border-dorado focus-visible:border-b-2"
                />
              </div>

              <button
                type="submit"
                disabled={!asistencia}
                className="w-full bg-principal py-4 font-display text-[20px] tracking-widest2 text-blanco transition-all duration-300 hover:bg-principal2 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                CONFIRMAR ASISTENCIA
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
