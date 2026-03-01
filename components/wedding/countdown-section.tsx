"use client"

import { useCountdown } from "@/hooks/use-countdown"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const WEDDING_DATE = new Date("2026-11-15T17:00:00")

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-6xl font-light text-foreground tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground mt-2"
        style={{ fontFamily: "var(--font-lato)" }}
      >
        {label}
      </span>
    </div>
  )
}

export function CountdownSection() {
  const countdown = useCountdown(WEDDING_DATE)
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div
        className={`max-w-3xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Faltan
        </p>

        <div className="flex items-center justify-center gap-6 md:gap-12">
          <CountdownUnit value={countdown.days} label="Dias" />
          <span className="text-3xl md:text-5xl font-light text-border self-start mt-2">:</span>
          <CountdownUnit value={countdown.hours} label="Horas" />
          <span className="text-3xl md:text-5xl font-light text-border self-start mt-2">:</span>
          <CountdownUnit value={countdown.minutes} label="Min" />
          <span className="text-3xl md:text-5xl font-light text-border self-start mt-2">:</span>
          <CountdownUnit value={countdown.seconds} label="Seg" />
        </div>
      </div>
    </section>
  )
}
