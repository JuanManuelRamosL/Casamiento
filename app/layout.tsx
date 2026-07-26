import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Alex_Brush } from "next/font/google";
import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const body = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

const script = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Evelyn & Juan Manuel | 15 de noviembre, 2026",
  description:
    "Nos casamos y queremos que seas parte de este día. Acompañanos a celebrar nuestro casamiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${display.variable} ${body.variable} ${script.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
