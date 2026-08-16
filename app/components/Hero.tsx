export function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-12 text-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/Hero.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-[2] flex w-full max-w-2xl flex-col items-center">
        <p
          className="fade-in-up font-display text-[17px] tracking-widest2 text-dorado sm:text-[20px]"
          style={{ animationDelay: "0.1s" }}
        >
          NOS CASAMOS
        </p>

        <h1
          className="write-in mt-6 font-script text-[54px] leading-[0.95] tracking-[0.02em] text-blanco sm:text-[80px]"
          style={{ animationDelay: "0.4s" }}
        >
          Evelyn
        </h1>

        <div className="my-3 flex items-center gap-3 sm:my-4 sm:gap-5">
          <span className="h-px w-16 bg-blanco/40 sm:w-24" />
          <span
            className="write-in font-script text-[30px] tracking-[0.02em] text-dorado sm:text-[44px]"
            style={{ animationDelay: "1.6s", animationDuration: "0.6s" }}
          >
            y
          </span>
          <span className="h-px w-16 bg-blanco/40 sm:w-24" />
        </div>

        <h1
          className="write-in font-script text-[54px] leading-[1] tracking-[0.02em] text-blanco sm:text-[80px]"
          style={{ animationDelay: "2.1s", animationDuration: "1.3s" }}
        >
          Juanma
        </h1>

        <div className="mt-14 sm:mt-16">
          <p
            className="fade-in-up mt-3 font-display text-[18px] tracking-widest2 text-dorado-claro sm:text-[24px]"
            style={{ animationDelay: "3.6s" }}
          >
            15 DE NOVIEMBRE, 2026
          </p>
        </div>
      </div>

      <svg
        className="fade-in-up absolute bottom-6 left-1/2 z-[2] h-6 w-6 -translate-x-1/2 text-dorado sm:h-7 sm:w-7"
        style={{ animationDelay: "4.2s" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 9l6 6 6-6"
        />
      </svg>
    </section>
  );
}
