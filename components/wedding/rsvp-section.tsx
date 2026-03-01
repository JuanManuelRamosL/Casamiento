"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useState } from "react"
import { Heart } from "lucide-react"

export function RsvpSection() {
  const { ref, isVisible } = useScrollAnimation()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    guests: "1",
    attendance: "yes",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Confirmacion
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-foreground">
            Confirma tu asistencia
          </h2>
          <p
            className="text-muted-foreground mt-4 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Nos encantaria contar con tu presencia en este dia tan especial.
            Por favor confirma antes del 15 de octubre de 2026.
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {submitted ? (
            <div className="text-center py-12 bg-linen rounded-sm border border-border">
              <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-light text-foreground mb-2">
                Gracias por confirmar
              </h3>
              <p className="text-muted-foreground" style={{ fontFamily: "var(--font-lato)" }}>
                Estamos emocionados de celebrar contigo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm tracking-[0.15em] uppercase text-muted-foreground"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-card border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary text-base"
                  style={{ fontFamily: "var(--font-lato)" }}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="guests"
                    className="text-sm tracking-[0.15em] uppercase text-muted-foreground"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Invitados
                  </label>
                  <select
                    id="guests"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="bg-card border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-base appearance-none"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    <option value="1">1 persona</option>
                    <option value="2">2 personas</option>
                    <option value="3">3 personas</option>
                    <option value="4">4 personas</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="attendance"
                    className="text-sm tracking-[0.15em] uppercase text-muted-foreground"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Asistencia
                  </label>
                  <select
                    id="attendance"
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                    className="bg-card border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-base appearance-none"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    <option value="yes">Asistire con gusto</option>
                    <option value="no">No podre asistir</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm tracking-[0.15em] uppercase text-muted-foreground"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Mensaje para los novios
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="bg-card border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary text-base resize-none"
                  style={{ fontFamily: "var(--font-lato)" }}
                  placeholder="Escribe un mensaje especial (opcional)"
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-primary text-primary-foreground py-4 rounded-sm text-sm tracking-[0.2em] uppercase transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Confirmar asistencia
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
