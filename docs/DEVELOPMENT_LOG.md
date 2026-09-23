# LUMAGOSA — Development Log

Este documento registra la evolución funcional y arquitectónica de LUMAGOSA.

El objetivo no es únicamente indicar qué código cambió, sino conservar por qué se tomaron las principales decisiones.

---

## Etapa inicial — Ride Recommendation

Se estableció el dominio inicial de recomendación de rodada.

Se definieron perfiles para diferentes disciplinas ciclistas:

- road;
- XC;
- trail;
- enduro;
- gravel;
- urban.

El motor utiliza información meteorológica para generar un índice de recomendación, razones y advertencias.

---

## Rider Profile Foundation

Se introdujo RiderProfile para separar las características del ciclista de la disciplina practicada.

Se incorporaron:

- experiencia: beginner, intermediate y advanced;
- objetivos: recreation, fitness, performance y exploration.

Se añadió persistencia local y sincronización mediante useSyncExternalStore.

Motivo:

dos ciclistas que practican la misma disciplina no necesariamente deben recibir exactamente la misma interpretación de las condiciones.

---

## Ride Context

Se creó RideContext como objeto de entrada unificado para los motores de evaluación.

Conceptualmente:

Weather
+
RideProfile
+
RiderProfile
+
RouteProfile
=
RideContext

Esto evita que los motores dependan directamente de componentes React o mecanismos de almacenamiento.

---

## Personalized Recommendation Engine

Se añadió una capa de personalización mediante riderModifiers.

Los modificadores ajustan determinadas tolerancias según experiencia y objetivo.

Decisión de seguridad:

la experiencia del ciclista no elimina peligros objetivos como viento severo, precipitación o exposición.

---

## Route Domain Foundation

Se creó un dominio específico para rutas.

RouteProfile incorpora información física, técnica, de superficie, exposición, procedencia y validación.

Se introdujo un catálogo piloto.

Los datos piloto se clasificaron deliberadamente como draft y partial para evitar presentarlos como rutas verificadas.

---

## Risk Engine

Se incorporó un motor separado para evaluar riesgo.

La plataforma distingue:

Ride Recommendation Score
≠
Risk Assessment

La recomendación indica qué tan favorables son las condiciones.

El riesgo expresa la severidad de combinar ruta, ciclista, exposición y clima.

---

## Route Data Quality

Se incorporó una evaluación de calidad de los datos de ruta.

El sistema puede identificar información incompleta y advertir que una ruta es provisional.

Principio introducido:

el motor no sólo debe conocer los datos, también debe conocer su calidad y procedencia.

---

## GPX Analysis

Se añadió procesamiento local de archivos GPX.

El navegador puede extraer:

- geometría;
- distancia;
- elevación;
- desnivel;
- tiempos;
- duración;
- inicio;
- final.

No se requiere cargar el archivo a un servidor.

---

## GPX to RouteProfile

Los resultados de un GPX pueden convertirse en un RouteProfile temporal.

Los datos geométricos proceden del archivo.

Los valores que un GPX no puede demostrar permanecen provisionales.

---

## GPX Visualization

Se incorporaron:

- vista aproximada del trazado;
- perfil altimétrico;
- ascenso;
- descenso;
- altitud mínima;
- altitud máxima.

La visualización no se considera cartografía y no sustituye un mapa real.

---

## GPX Route Enrichment

Se añadió enriquecimiento humano para rutas importadas.

El usuario puede indicar:

- superficie;
- dificultad técnica;
- exposición;
- disciplinas compatibles.

Los cambios modifican el RouteProfile y son utilizados inmediatamente por RiskEngine.

La información declarada permanece diferenciada de una verificación formal.

---

## Sprint 014 — Personal Route Library

### Objetivo

Permitir conservar RouteProfile creados a partir de GPX después de recargar o cerrar la aplicación.

### Implementación

Se introducen:

- routeLibraryStorage;
- RouteLibraryProvider;
- RouteLibraryPanel.

La persistencia inicial utiliza localStorage.

### Decisión

No se almacenan todavía todos los puntos del archivo GPX.

Se conserva el RouteProfile derivado y enriquecido.

Esto reduce el tamaño de almacenamiento y evita acoplar la biblioteca personal al formato GPX.

### Arquitectura

RouteProfile
↓
RouteLibraryProvider
↓
routeLibraryStorage
↓
localStorage

### Evolución prevista

La capa de almacenamiento podrá ser reemplazada posteriormente por:

API
+
base de datos
+
identidad de usuario

sin modificar RiskEngine ni el modelo principal de evaluación.