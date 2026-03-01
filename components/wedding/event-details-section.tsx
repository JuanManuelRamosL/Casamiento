"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { MapPin, Clock, Church, Wine } from "lucide-react"

function EventCard({
  icon: Icon,
  title,
  time,
  location,
  address,
  delay,
  isVisible,
}: {
  icon: typeof MapPin
  title: string
  time: string
  location: string
  address: string
  delay: string
  isVisible: boolean
}) {
  return (
    <div
      className={`bg-card p-8 md:p-10 text-center rounded-sm border border-border transition-all duration-1000 ${delay} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full bg-linen">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-2xl md:text-3xl font-light text-foreground mb-4">{title}</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground" style={{ fontFamily: "var(--font-lato)" }}>
          <Clock className="w-4 h-4" />
          <span className="text-sm">{time}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground" style={{ fontFamily: "var(--font-lato)" }}>
          <MapPin className="w-4 h-4" />
          <div className="text-sm">
            <p className="font-medium text-foreground">{location}</p>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventDetailsSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Celebracion
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground">
            Detalles del evento
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <EventCard
            icon={Church}
            title="Ceremonia"
            time="17:00 hrs"
            location="Capilla del Rosario"
            address="Av. de los Olivos 245, Valle de Bravo"
            delay="delay-300"
            isVisible={isVisible}
          />
          <EventCard
            icon={Wine}
            title="Recepcion"
            time="19:00 hrs"
            location="Hacienda Los Laureles"
            address="Camino al Mirador 89, Valle de Bravo"
            delay="delay-500"
            isVisible={isVisible}
          />
        </div>

        <div
          className={`text-center mt-12 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-sm text-muted-foreground italic"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Codigo de vestimenta: Formal / Cocktail
          </p>
        </div>
      </div>
    </section>
  )
}
