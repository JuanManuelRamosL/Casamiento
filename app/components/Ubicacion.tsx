import { Reveal } from "./Reveal";
import { Divider } from "./Divider";
import { EYEBROW } from "../utils/constants";

const DIRECCION = "Corrientes 1682, Bella Vista, Provincia de Buenos Aires, Argentina";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  DIRECCION
)}&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  DIRECCION
)}`;

export function Ubicacion() {
  return (
    <Reveal>
      <section className="mx-auto max-w-4xl px-6 py-6 text-center sm:py-6">
        <div className="text-center">
          <p className={EYEBROW}>CÓMO LLEGAR</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Ubicación
          </h2>
        </div>

        <Divider />

        <div className="mt-10 overflow-hidden rounded-sm border border-dorado/30">
          <iframe
            title="Ubicación del salón"
            src={MAPS_EMBED_SRC}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-display text-[16px] tracking-widest2 text-principal underline underline-offset-4"
        >
          Ver en Google Maps
        </a>
      </section>
    </Reveal>
  );
}
