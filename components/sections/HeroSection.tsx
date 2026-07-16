import { ButtonLink } from "../ui/ButtonLink";
import { Eyebrow } from "../ui/Eyebrow";

export function HeroSection() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-backdrop" aria-hidden="true">
        <div className="sun" />
        <div className="mountain mountain-far" />
        <div className="mountain mountain-near" />
        <div className="trail" />
      </div>
      <div className="hero-copy">
        <Eyebrow>PROYECTO TEPETL · VALLE DE TEOTIHUACÁN</Eyebrow>
        <h1>Tu próxima rodada empieza aquí.</h1>
        <p className="hero-text">
          Tecnología, conocimiento y equipo útil para ayudarte a decidir,
          prepararte y disfrutar más cada salida.
        </p>
        <div className="hero-actions">
          <ButtonLink href="#hoy">Ver condiciones de hoy</ButtonLink>
          <ButtonLink href="#explora" variant="secondary">Explorar rutas</ButtonLink>
        </div>
      </div>
      <a className="scroll-cue" href="#hoy" aria-label="Bajar a Hoy para rodar">↓</a>
    </section>
  );
}
