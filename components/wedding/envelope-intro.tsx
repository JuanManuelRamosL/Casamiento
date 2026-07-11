"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Escena de apertura: el video del sobre (public/sobre-alpha.mp4) se reproduce
 * sincronizado con el scroll, recortado en vivo con WebGL (formato "stacked":
 * color arriba, mascara alfa abajo), sobre la imagen del hero que pasa de
 * desenfocada a nitida. Al abrirse, aparecen los nombres.
 *
 * Fluidez:
 *  - El fondo hace crossfade entre una capa nitida y una pre-desenfocada
 *    (animar opacidad es barato; animar el radio de blur no lo es).
 *  - El video se scrubbea por eventos: un solo seek en vuelo, cuantizado a
 *    frames, dibujando cuando el frame realmente esta listo.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2((a_pos.x + 1.0) * 0.5, (1.0 - a_pos.y) * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
varying vec2 v_uv;
void main() {
  vec3 col = texture2D(u_tex, vec2(v_uv.x, v_uv.y * 0.5)).rgb;        // mitad superior: color
  float a = texture2D(u_tex, vec2(v_uv.x, v_uv.y * 0.5 + 0.5)).r;    // mitad inferior: mascara
  a = smoothstep(0.15, 0.45, a); // endurece: sello opaco y bordes firmes (sin halo)
  gl_FragColor = vec4(col * a, a); // premultiplicado
}`;

const STEPS = 90; // pasos de scrubbing a lo largo del scroll

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function EnvelopeIntro() {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const seekRef = useRef<((p: number) => void) | null>(null);

  const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

  // ----- WebGL compositor + scrubbing por eventos -----
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let sized = false;
    const drawGL = () => {
      if (video.readyState < 2) return;
      if (!sized && video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight / 2;
        sized = true;
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // ---- scrubbing: un solo seek en vuelo, dibuja cuando el frame esta listo ----
    const useRVFC = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    let seeking = false;
    let pendingKey = -1;
    let lastKey = -1;

    const complete = () => {
      drawGL();
      seeking = false;
      if (pendingKey >= 0) {
        const k = pendingKey;
        pendingKey = -1;
        goToKey(k);
      }
    };
    const goToKey = (k: number) => {
      if (seeking) {
        pendingKey = k;
        return;
      }
      if (k === lastKey) return;
      lastKey = k;
      seeking = true;
      const dur = video.duration || 1.2;
      video.currentTime = Math.min((k / STEPS) * dur, dur - 0.001);
      if (useRVFC) {
        video.requestVideoFrameCallback(complete);
      }
    };
    if (!useRVFC) video.addEventListener("seeked", complete);

    seekRef.current = (p: number) => {
      const vp = clamp(p / 0.72); // abierto al 72% del scroll
      goToKey(Math.round(vp * STEPS));
    };

    // al cargar: pausar, resetear el estado del scrubber y posicionar en el
    // frame correcto segun el scroll actual (frame 0 = cerrado en el tope)
    const onReady = () => {
      video.pause();
      seeking = false;
      pendingKey = -1;
      lastKey = -1;
      seekRef.current?.(progressRef.current);
    };
    video.addEventListener("loadeddata", onReady);
    // iOS: iniciar reproduccion una vez para poder dibujar frames en canvas
    video.play().then(() => video.pause()).catch(() => {});

    return () => {
      seekRef.current = null;
      video.removeEventListener("seeked", complete);
      video.removeEventListener("loadeddata", onReady);
    };
  }, []);

  // ----- scroll -----
  useEffect(() => {
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
        progressRef.current = p;
        setProgress(p);
        seekRef.current?.(p);
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

  // ----- fases (DOM) -----
  const fadeP = clamp((progress - 0.75) / 0.25); // el sobre sube y se desvanece
  const focusP = clamp(progress / 0.82); // la imagen se enfoca
  const textIn = clamp((progress - 0.7) / 0.25); // aparecen los nombres

  const bgScale = 1 + 0.08 * (1 - focusP);
  const darkAlpha = 0.5 - 0.2 * focusP;
  const sealHintOpacity = (1 - clamp(progress / 0.12)) * (1 - fadeP);

  return (
    <section ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {/* ===== Imagen de fondo: crossfade nitida <- desenfocada (fluido) ===== */}
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${bgScale})`, willChange: "transform" }}
        >
          {/* capa nitida */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/pelo.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center 85%",
            }}
          />
          {/* capa desenfocada (blur estatico, solo cambia su opacidad) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/pelo.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center 85%",
              filter: "blur(20px)",
              opacity: 1 - focusP,
              willChange: "opacity",
            }}
          />
          {/* oscurecido (opacidad animada -> compositor) */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgb(30,25,20)", opacity: darkAlpha, willChange: "opacity" }}
          />
        </div>

        {/* ===== Nombres del hero (aparecen al abrirse el sobre) ===== */}
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

        {/* ===== Video del sobre recortado (WebGL) ===== */}
        <div
          className="pointer-events-none relative z-20 w-[90%] max-w-[540px]"
          style={{
            opacity: 1 - fadeP,
            transform: `translateY(${-fadeP * 12}vh) scale(${1 + fadeP * 0.08})`,
            willChange: "transform, opacity",
          }}
        >
          <canvas ref={canvasRef} width={744} height={678} className="block h-auto w-full" />
        </div>

        {/* video oculto que alimenta al compositor */}
        <video
          ref={videoRef}
          src="/sobre-alpha.mp4"
          muted
          playsInline
          preload="auto"
          className="pointer-events-none absolute h-px w-px opacity-0"
          style={{ left: "-9999px" }}
        />

        {/* Indicacion inicial */}
        <div
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
          style={{ opacity: sealHintOpacity, pointerEvents: "none" }}
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
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          style={{ opacity: textIn, pointerEvents: "none" }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce text-cream/60" />
        </div>
      </div>
    </section>
  );
}
