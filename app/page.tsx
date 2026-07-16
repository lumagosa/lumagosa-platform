export default function Home() {
  const routes = [
    { title: "Valle de Teotihuacán", meta: "26 km · Intermedia", tag: "Ruta piloto" },
    { title: "Senderos de Otumba", meta: "18 km · Principiante", tag: "Explora" },
    { title: "Circuito volcánico", meta: "34 km · Intermedia", tag: "Próximamente" },
  ];

  const insights = [
    ["LUMALAB", "Qué debe tener una buena bomba portátil", "Analizar"],
    ["APRENDE", "Presión de llantas: una guía para comenzar", "Aprender"],
    ["TALLER", "Checklist después de una rodada con polvo", "Preparar"],
  ];

  const gear = [
    ["Lubricante para clima seco", "En stock LUMAGOSA", "$189 MXN"],
    ["Kit de parches compacto", "Disponible con socio", "Desde $89 MXN"],
    ["Cámara 29 × 2.20", "En stock LUMAGOSA", "$149 MXN"],
  ];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="LUMAGOSA, ir al inicio">
          <span className="brand-mark" aria-hidden="true">△</span>
          <span>LUMAGOSA</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#hoy">Hoy para rodar</a><a href="#explora">Explora</a><a href="#aprende">Aprende</a><a href="#equipa">Equípate</a>
        </nav>
        <a className="header-action" href="#hoy">Comenzar</a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="mountain far"/><div className="mountain near"/><div className="trail"/></div>
        <div className="hero-copy">
          <p className="eyebrow">PROYECTO TEPETL · VALLE DE TEOTIHUACÁN</p>
          <h1>Tu próxima rodada empieza aquí.</h1>
          <p className="hero-text">Tecnología, conocimiento y equipo útil para ayudarte a decidir, prepararte y disfrutar más cada salida.</p>
          <div className="hero-actions"><a className="button primary" href="#hoy">Ver condiciones de hoy</a><a className="button secondary" href="#explora">Explorar rutas</a></div>
        </div>
      </section>

      <section className="section readiness-section" id="hoy">
        <div className="section-heading"><div><p className="eyebrow">HOY PARA RODAR</p><h2>Una respuesta clara antes de salir.</h2></div><p>Primera versión visual. Después la conectaremos con una fuente meteorológica real.</p></div>
        <article className="readiness-card">
          <div className="score-block"><span className="score">86</span><span>de 100</span></div>
          <div className="readiness-copy"><span className="status-pill">Buen día para rodar</span><h3>Sal temprano y disfruta condiciones estables.</h3><p>Ventana recomendada: <strong>07:00–10:30</strong>. Lleva hidratación y revisa la presión de tus llantas.</p></div>
          <div className="weather-grid"><div><span>Temperatura</span><strong>18–25 °C</strong></div><div><span>Lluvia</span><strong>10%</strong></div><div><span>Viento</span><strong>Ligero</strong></div><div><span>Terreno</span><strong>Seco</strong></div></div>
        </article>
      </section>

      <section className="section" id="explora">
        <div className="section-heading"><div><p className="eyebrow">EXPLORA</p><h2>Rutas para comenzar cerca de casa.</h2></div><a className="text-link" href="#explora">Ver todas →</a></div>
        <div className="card-grid">{routes.map((route,index)=><article className="content-card" key={route.title}><div className={`route-visual route-${index+1}`}><span className="topo"/></div><div className="card-body"><span className="tag">{route.tag}</span><h3>{route.title}</h3><p>{route.meta}</p><a className="text-link" href="#explora">Explorar ruta →</a></div></article>)}</div>
      </section>

      <section className="section dark" id="aprende">
        <div className="section-heading"><div><p className="eyebrow light">CONOCIMIENTO QUE SÍ AYUDA</p><h2>Aprende antes de comprar.</h2></div><p>Contenido para principiantes, intermedios y cicloturistas.</p></div>
        <div className="card-grid">{insights.map(([eyebrow,title,action])=><article className="knowledge-card" key={title}><span>{eyebrow}</span><h3>{title}</h3><a href="#aprende">{action} →</a></article>)}</div>
      </section>

      <section className="section" id="equipa">
        <div className="section-heading"><div><p className="eyebrow">EQUÍPATE</p><h2>Productos pequeños. Utilidad inmediata.</h2></div><p>El catálogo inicial priorizará consumibles y refacciones de alta rotación.</p></div>
        <div className="card-grid">{gear.map(([name,state,price])=><article className="product-card" key={name}><div className="product-visual">L</div><div><span className="stock-pill">{state}</span><h3>{name}</h3><p className="price">{price}</p><a className="button dark-button" href="#equipa">Ver producto</a></div></article>)}</div>
      </section>

      <section className="closing"><p className="eyebrow light">LUMAGOSA</p><h2>Tecnología al servicio y utilidad del ciclista.</h2><p>La plataforma nace en el Valle de Teotihuacán con herramientas útiles para cualquier ciclista.</p></section>
      <footer><a className="brand" href="#inicio"><span className="brand-mark">△</span><span>LUMAGOSA</span></a><p>Proyecto Tepetl · Versión 0.1</p></footer>
    </main>
  );
}
