import { gear } from "../../data/home";
import { ButtonLink } from "../ui/ButtonLink";
import { SectionHeading } from "../ui/SectionHeading";

export function GearSection() {
  return (
    <section className="section" id="equipa">
      <SectionHeading eyebrow="EQUÍPATE" title="Productos pequeños. Utilidad inmediata.">
        <p>El catálogo inicial se enfocará en consumibles y refacciones de alta rotación.</p>
      </SectionHeading>

      <div className="card-grid">
        {gear.map((item) => (
          <article className="product-card" key={item.name}>
            <div className="product-visual" aria-hidden="true">L</div>
            <div>
              <span className="stock-pill">{item.state}</span>
              <h3>{item.name}</h3>
              <p className="price">{item.price}</p>
              <ButtonLink href="#equipa" variant="dark">Ver producto</ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
