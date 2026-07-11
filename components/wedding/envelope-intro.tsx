"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Escena de apertura: el video del sobre (public/sobre-alpha.mp4, formato
 * "stacked": color arriba, mascara alfa abajo) se scrubbea con el scroll y se
 * recorta en vivo con WebGL, sobre la imagen del hero que pasa de desenfocada a
 * nitida. Un poster (sobre-poster.png) se ve al instante hasta que el video
 * decodifica su primer frame (mobile carga el video en diferido).
 *
 * Rendimiento: los estilos guiados por scroll se aplican de forma IMPERATIVA
 * por refs (sin re-render de React en cada frame) para que sea fluido en mobile.
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
  a = smoothstep(0.15, 0.45, a); // sello opaco y bordes firmes (sin halo)
  gl_FragColor = vec4(col * a, a); // premultiplicado
}`;

const FPS = 24; // el video del sobre es nativo 24fps (sin interpolacion)

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

export function EnvelopeIntro() {
  const [ready, setReady] = useState(false); // primer frame del sobre ya dibujado

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const seekRef = useRef<((p: number) => void) | null>(null);

  // refs de los elementos con estilos guiados por scroll (update imperativo)
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const chevRef = useRef<HTMLDivElement>(null);

  // ----- WebGL compositor + scrubbing del video -----
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
    let firstDone = false;
    const drawGL = () => {
      if (video.readyState < 2 || !video.videoWidth) return;
      if (!sized) {
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
      if (!firstDone) {
        firstDone = true;
        setReady(true); // ya hay un frame real: ocultar poster
      }
    };

    // ---- scrubbing: un solo seek en vuelo, cuantizado a los frames reales ----
    let seeking = false;
    let pendingKey = -1;
    let lastKey = -1;

    const afterSeek = () => {
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
      const dur = video.duration || 1.33;
      video.currentTime = Math.min((k + 0.5) / FPS, dur - 0.001);
    };
    video.addEventListener("seeked", afterSeek);

    seekRef.current = (p: number) => {
      const dur = video.duration || 1.33;
      const nFrames = Math.max(1, Math.round(dur * FPS));
      const vp = clamp(p / 0.72); // abierto al 72% del scroll
      goToKey(Math.round(vp * (nFrames - 1)));
    };

    // dibuja cada frame presentado (capta la decodificacion diferida de mobile;
    // idle cuando el video esta pausado y estatico)
    const useRVFC = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    let rvfcId = 0;
    const onFrame = () => {
      drawGL();
      if (useRVFC) rvfcId = video.requestVideoFrameCallback(onFrame);
    };
    if (useRVFC) rvfcId = video.requestVideoFrameCallback(onFrame);

    const onCanPlay = () => {
      video.pause();
      seeking = false;
      pendingKey = -1;
      lastKey = -1;
      seekRef.current?.(progressRef.current);
      drawGL();
    };
    video.addEventListener("loadeddata", onCanPlay);
    video.addEventListener("canplay", onCanPlay);

    video.load(); // forzar carga (mobile no respeta preload)
    // iOS/Android: iniciar reproduccion muteada una vez habilita dibujar frames
    video.play().then(() => video.pause()).catch(() => {});

    return () => {
      seekRef.current = null;
      video.removeEventListener("seeked", afterSeek);
      video.removeEventListener("loadeddata", onCanPlay);
      video.removeEventListener("canplay", onCanPlay);
      if (useRVFC && rvfcId && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(rvfcId);
      }
    };
  }, []);

  // ----- scroll (estilos imperativos, sin re-render de React) -----
  useEffect(() => {
    const applyStyles = (p: number) => {
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
        progressRef.current = p;
        applyStyles(p);
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

        {/* ===== Video del sobre recortado (WebGL) ===== */}
        <div
          ref={envRef}
          className="pointer-events-none relative z-20 w-[90%] max-w-[540px]"
          style={{ opacity: 1, transform: "translateY(0) scale(1)", willChange: "transform, opacity" }}
        >
          <canvas ref={canvasRef} width={744} height={678} className="block h-auto w-full" />
          {/* poster del sobre cerrado: visible al instante hasta el primer frame real */}
          <img
            src="/sobre-poster.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: ready ? 0 : 1, transition: "opacity 0.25s ease" }}
          />
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
