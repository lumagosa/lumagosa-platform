import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMAGOSA | Tecnología al servicio del ciclista",
  description: "Clima, rutas, conocimiento y equipo útil para ciclistas de montaña.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
