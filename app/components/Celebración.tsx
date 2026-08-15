import { Reveal } from "./Reveal";
import { Divider } from "./Divider";
import { EYEBROW } from "../utils/constants";

export function Celebracion() {
  return (
    <Reveal>
      <section className="mx-auto max-w-4xl px-6 py-6 text-center sm:py-6">
        <div className="text-center">
          <p className={EYEBROW}>LA CELEBRACIÓN</p>
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
            Dónde y cuándo
          </h2>
        </div>

        <Divider />

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md rounded-sm border border-dorado/30 bg-blanco/60 px-8 py-10 text-center">
            <p className="font-display text-[22px] tracking-widest2 text-principal">
              Jano's Bella vista 1
            </p>
            <div className="mx-auto my-5 w-10">
              <Divider />
            </div>
            <p className="font-body text-[28px] text-principal">
              Corrientes 1682, PCia de Bs.As
            </p>
            <p className="mt-2 font-body text-[24px] text-principal/70">
              16:30 hs
            </p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
