import type { Metadata } from "next";
import { RidePreferenceProvider } from "../components/shared/providers/RidePreferenceProvider";
import { RiderProfileProvider } from "../components/shared/providers/RiderProfileProvider";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "LUMAGOSA | Tecnología al servicio del ciclista",
  description:
    "Clima, rutas, conocimiento y equipo útil para ciclistas de montaña.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <RiderProfileProvider>
          <RidePreferenceProvider>
            {children}
          </RidePreferenceProvider>
        </RiderProfileProvider>
      </body>
    </html>
  );
}