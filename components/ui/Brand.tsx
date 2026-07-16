type BrandProps = { footer?: boolean };

export function Brand({ footer = false }: BrandProps) {
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href="#inicio" aria-label="LUMAGOSA, ir al inicio">
      <span className="brand-mark" aria-hidden="true">⌃</span>
      <span>LUMAGOSA</span>
    </a>
  );
}
