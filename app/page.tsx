"use client";

import { useCountdown } from "./hooks/useCountdown";
import { WEDDING_DATE } from "./utils/constants";
import { FlipUnit } from "./components/FlipUnit";
import { ClockSection } from "./components/ClockSection";
import { PhotoGallery } from "./components/PhotoGallery";
import { Hero } from "./components/Hero";
import { Bienvenida } from "./components/Bienvenida";
import { Celebracion } from "./components/Celebración";
import { Vestimenta } from "./components/Vestimenta";
import { Regalos } from "./components/Regalos";
import { Rsvp } from "./components/Rsvp";
import { Versiculo } from "./components/Versiculo";
import { Footer } from "./components/Footer";
import { Reveal } from "./components/Reveal";
import { Divider } from "./components/Divider";

export default function Home() {
  const countdown = useCountdown(WEDDING_DATE);

  return (
    <main className="overflow-x-hidden bg-secundario">
      <Hero />

      <Bienvenida />

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

      <Celebracion />

      <Vestimenta />

      <Reveal>
        <section className="mx-auto max-w-xl px-6 py-6 text-center sm:py-14">
          <p className="font-display text-[16px] tracking-widest2">GALERÍA</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Nosotros
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <PhotoGallery />
        </section>
      </Reveal>

      <Regalos />

      <Rsvp />

      <Versiculo />

      <Footer />
    </main>
  );
}