import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Imagen de fondo */}
      <Image
        src="/images/hero.jpg"
        alt="Invitación de Casamiento"
        fill
        priority
        className={styles.background}
      />

      {/* Oscurece ligeramente la imagen */}
      <div className={styles.overlay}></div>

      {/* Contenido */}
      <div className={styles.content}>
        <div className={styles.date}>29 • NOVIEMBRE • 2026</div>

        <h1 className={styles.names}>
          Valentina
          <span>&</span>
          Nicolás
        </h1>

        <p className={styles.invitation}>
          Te invitamos a compartir uno de los días más importantes de nuestras
          vidas.
        </p>
      </div>

      {/* Indicador de scroll */}

      <div className={styles.scrollIndicator}>
        <span>Desliza</span>

        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </div>

      {/* Degradado inferior */}

      <div className={styles.bottomFade}></div>
    </section>
  );
}
