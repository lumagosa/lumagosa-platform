import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, children, light = false }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
