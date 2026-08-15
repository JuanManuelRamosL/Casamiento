import { Divider } from "./Divider";

export function Footer() {
  return (
    <footer className="grain relative bg-principal px-6 py-10 text-center">
      <div className="relative z-[2]">
        <p className="font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
          Evelyn <span className="text-dorado">y</span> Juan Manuel
        </p>
        <div className="mx-auto my-4 w-16">
          <Divider />
        </div>
        <p className="font-body text-[28px] tracking-wide text-blanco/60">
          15 DE NOVIEMBRE de 2026
        </p>
        <br />
        <p className="font-display text-[22px] tracking-widest2 text-blanco/60">
          Jano's Bella vista 1
        </p>
        <div className="mx-auto my-5 w-10"></div>
        <p className="font-body text-[28px] text-blanco/60">
          Corrientes 1682, Provincia de Buenos Aires
        </p>
        <p className="mt-2 font-body text-[24px] text-blanco/60">16:30 hs</p>
      </div>
    </footer>
  );
}
