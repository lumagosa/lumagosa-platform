import { Brand } from "../ui/Brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label="Navegación principal">
        <a href="#hoy">Hoy para rodar</a>
        <a href="#explora">Explora</a>
        <a href="#aprende">Aprende</a>
        <a href="#equipa">Equípate</a>
      </nav>
      <a className="header-action" href="#hoy">Comenzar</a>
    </header>
  );
}
