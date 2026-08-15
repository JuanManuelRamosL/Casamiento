import { Reveal } from "./Reveal";
import { Divider } from "./Divider";

export function Versiculo() {
  return (
    <Reveal>
      <section
        className="relative px-6 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Biblia.jpeg')",
          paddingTop: "3rem",
          paddingBottom: "3rem",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #eef3f8 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #102948 0%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-[2] mx-auto max-w-2xl">
          <p className="font-body text-[28px] italic leading-relaxed text-blanco sm:text-[34px]">
            “Y sobre todas estas cosas vestíos de amor, que es el vínculo
            perfecto.”
          </p>
          <p className="mt-4 font-display text-[18px] tracking-widest2 text-dorado-claro">
            Colosenses 3:14
          </p>
          <div className="mt-6">
            <Divider tone="dorado" />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
