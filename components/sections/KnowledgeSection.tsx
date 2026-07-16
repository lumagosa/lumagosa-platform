import { insights } from "../../data/home";
import { SectionHeading } from "../ui/SectionHeading";

export function KnowledgeSection() {
  return (
    <section className="section section-dark" id="aprende">
      <SectionHeading eyebrow="CONOCIMIENTO QUE SÍ AYUDA" title="Aprende antes de comprar." light>
        <p>Contenido pensado para principiantes, ciclistas intermedios y cicloturistas.</p>
      </SectionHeading>

      <div className="card-grid">
        {insights.map((item) => (
          <article className="knowledge-card" key={item.title}>
            <span>{item.eyebrow}</span>
            <h3>{item.title}</h3>
            <a href="#aprende">{item.action} →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
