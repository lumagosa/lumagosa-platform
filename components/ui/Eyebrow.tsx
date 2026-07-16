import type { ReactNode } from "react";

type EyebrowProps = { children: ReactNode; light?: boolean };

export function Eyebrow({ children, light = false }: EyebrowProps) {
  return <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>{children}</p>;
}
