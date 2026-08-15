"use client";

import { useEffect, useState } from "react";

export function ClockSection({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      className="relative px-6 py-16 text-center sm:py-20 overflow-hidden flex items-center justify-center"
      style={{ minHeight: "50vh", minHeight: "50dvh" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Reloj.jpeg')",
          backgroundPosition: isMobile ? "center 30%" : "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-[2] w-full max-w-2xl mx-auto">{children}</div>
    </section>
  );
}
