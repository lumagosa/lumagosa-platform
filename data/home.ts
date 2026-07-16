export const routes = [
  { title: "Valle de Teotihuacán", meta: "26 km · Intermedia", tag: "Ruta piloto", visualClassName: "route-visual-1" },
  { title: "Senderos de Otumba", meta: "18 km · Principiante", tag: "Explora", visualClassName: "route-visual-2" },
  { title: "Circuito volcánico", meta: "34 km · Intermedia", tag: "Próximamente", visualClassName: "route-visual-3" },
] as const;

export const insights = [
  { eyebrow: "LUMALAB", title: "Qué debe tener una buena bomba portátil", action: "Analizar" },
  { eyebrow: "APRENDE", title: "Presión de llantas: una guía para comenzar", action: "Aprender" },
  { eyebrow: "TALLER", title: "Checklist básico después de una rodada con polvo", action: "Preparar" },
] as const;

export const gear = [
  { name: "Lubricante para clima seco", state: "En stock LUMAGOSA", price: "$189 MXN" },
  { name: "Kit de parches compacto", state: "Disponible con socio", price: "Desde $89 MXN" },
  { name: "Cámara 29 × 2.20", state: "En stock LUMAGOSA", price: "$149 MXN" },
] as const;

export const readiness = {
  score: 86,
  status: "Buen día para rodar",
  title: "Sal temprano y disfruta condiciones estables.",
  metrics: [
    { label: "Temperatura", value: "18–25 °C" },
    { label: "Lluvia", value: "10%" },
    { label: "Viento", value: "Ligero" },
    { label: "Terreno", value: "Seco" },
  ],
} as const;
