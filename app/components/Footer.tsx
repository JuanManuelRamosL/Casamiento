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
        <p className="font-body text-[22px] tracking-wide text-blanco/60">
          15 DE NOVIEMBRE, 2026 · BUENOS AIRES
        </p>
      </div>
    </footer>
  );
}
