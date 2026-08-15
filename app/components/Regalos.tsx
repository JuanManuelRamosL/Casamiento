"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { Divider } from "./Divider";
import { EYEBROW, CBU, ALIAS } from "../utils/constants";

export function Regalos() {
  const [copied, setCopied] = useState<"cbu" | "alias" | null>(null);

  const copyToClipboard = (text: string, type: "cbu" | "alias") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <Reveal>
      <section className="grain relative bg-principal px-6 py-12 text-center sm:py-14">
        <div className="relative z-[2] mx-auto max-w-xl">
          <h2 className="mt-3 font-script text-[44px] tracking-[0.02em] text-blanco sm:text-[56px]">
            Regalos
          </h2>
          <div className="mx-auto my-8 w-10">
            <Divider />
          </div>
          <p className="mx-auto max-w-md font-body text-[26px] leading-relaxed text-blanco/80">
            Si desean obsequiarnos algo, agradeceremos mucho una contribución en
            efectivo para ayudarnos a comenzar esta nueva etapa juntos. Habrá
            sobres a disposición en la entrada del evento. ¡Gracias por ser
            parte de nuestro futuro!
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-dorado/20">
              <span className="text-blanco/70 text-sm font-display tracking-wider">
                CBU:
              </span>
              <span className="text-blanco font-mono text-sm select-all">
                {CBU}
              </span>
              <button
                onClick={() => copyToClipboard(CBU, "cbu")}
                className="w-full sm:w-auto sm:ml-auto px-3 py-1 text-xs font-display tracking-wider text-dorado-claro border border-dorado/30 rounded hover:bg-dorado hover:text-principal transition-all duration-300"
              >
                {copied === "cbu" ? "✓ COPIADO" : "COPIAR"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-dorado/20">
              <span className="text-blanco/70 text-sm font-display tracking-wider">
                ALIAS:
              </span>
              <span className="text-blanco font-mono text-sm select-all">
                {ALIAS}
              </span>
              <button
                onClick={() => copyToClipboard(ALIAS, "alias")}
                className="w-full sm:w-auto sm:ml-auto px-3 py-1 text-xs font-display tracking-wider text-dorado-claro border border-dorado/30 rounded hover:bg-dorado hover:text-principal transition-all duration-300"
              >
                {copied === "alias" ? "✓ COPIADO" : "COPIAR"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
