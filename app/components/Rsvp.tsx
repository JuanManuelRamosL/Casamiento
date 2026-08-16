"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { EYEBROW } from "../utils/constants";
import { Divider } from "./Divider";

export function Rsvp() {
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [nombre, setNombre] = useState("");
  const [restricciones, setRestricciones] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <Reveal>
      <section className="mx-auto max-w-lg px-6 py-12 text-center sm:py-14">
        <div className="text-center">
          <p className={EYEBROW}>CONFIRMACIÓN</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Confirmá tu asistencia
          </h2>
          <p className="font-body text-[24px] text-principal/70">
            Los niños son parte hermosa de nuestras vidas, pero en este día tan
            especial hemos decidido que la celebración sea{" "}
            <b>sólo para adultos</b>.
            <b> Gracias por respetar nuestra decisión</b>.
          </p>
          <br />
          <Divider></Divider>
          <br />
          <p className="mt-4 font-body text-[24px] text-principal/70">
            Por favor, confirmá tu asistencia{" "}
            <b>antes del 20 de septiembre de 2026</b>. Esta <b>invitación</b> es
            individual por motivos de organización.
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
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
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
                  className={`flex-1 border px-4 py-3 font-body text-[24px] transition-colors hover:cursor-pointer hover:bg-dorado hover:border-dorado ${
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
                  className={`flex-1 border px-4 py-3 font-body text-[24px] transition-colors hover:cursor-pointer hover:bg-dorado hover:border-dorado ${
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
              <div className="mt-12">
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
                  className="mt-2 w-full border-b border-principal/30 bg-transparent py-2 font-body text-[26px] text-principal outline-none placeholder:text-principal/40"
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
  );
}
