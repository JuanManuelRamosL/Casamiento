import { Reveal } from "./Reveal";
import { Divider } from "./Divider";

export function Bienvenida() {
  return (
    <Reveal>
      <section className="mx-auto max-w-2xl px-6 py-12 text-center sm:py-14">
        <p className="font-body text-[32px] italic leading-relaxed text-principal sm:text-[38px]">
          Nos casamos y queremos que seas parte de este día.
        </p>
        <div className="mt-8">
          <Divider />
        </div>
      </section>
    </Reveal>
  );
}
