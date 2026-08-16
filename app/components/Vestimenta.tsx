import { Reveal } from "./Reveal";
import { Divider } from "./Divider";
import { EYEBROW } from "../utils/constants";

export function Vestimenta() {
  return (
    <Reveal>
      <section className="mx-auto max-w-xl px-6 py-6 text-center sm:py-14">
        <p className={EYEBROW}>CÓDIGO DE VESTIMENTA</p>
        <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-principal sm:text-[56px]">
          Elegante
        </h2>
        <div className="mx-auto my-6 w-10">
          <Divider />
        </div>
        <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-principal/80">
          Queremos que nos acompañen en este momento tan especial luciendo sus
          mejores vestidos de gala y trajes elegantes.
          <br />
          <br />
          Evitando la gama de azules y celestes que estarán reservados para la
          pareja. 💙
        </p>
      </section>
    </Reveal>
  );
}
