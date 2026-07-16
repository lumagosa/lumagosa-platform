import { routes } from "../../data/home";
import { SectionHeading } from "../ui/SectionHeading";

export function RoutesSection() {
  return (
    <section className="section" id="explora">
      <SectionHeading eyebrow="EXPLORA" title="Rutas para comenzar cerca de casa.">
        <a className="text-link" href="#explora">Ver todas →</a>
      </SectionHeading>

      <div className="card-grid route-grid">
        {routes.map((route) => (
          <article className="content-card route-card" key={route.title}>
            <div className={`route-visual ${route.visualClassName}`} aria-hidden="true">
              <span className="topographic-lines" />
            </div>
            <div className="card-body">
              <span className="card-tag">{route.tag}</span>
              <h3>{route.title}</h3>
              <p>{route.meta}</p>
              <a className="text-link" href="#explora">Explorar ruta →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
