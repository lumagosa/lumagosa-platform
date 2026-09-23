# LUMAGOSA — Arquitectura de la plataforma

## Propósito

LUMAGOSA es una plataforma de apoyo a la decisión para ciclismo que combina información meteorológica, características del ciclista y contexto de ruta para generar recomendaciones y evaluaciones de riesgo.

La arquitectura busca mantener separadas las fuentes de datos, el dominio de negocio, los motores de evaluación y la interfaz de usuario.

---

## Flujo principal

El flujo actual de evaluación es:

WeatherSnapshot
+
RideProfile
+
RiderProfile
+
RouteProfile
↓
RideContext
↓
RecommendationEngine
+
RiskEngine
↓
RideRecommendation

La recomendación de rodada y la evaluación de riesgo son conceptos distintos.

El Ride Recommendation Score expresa qué tan favorables son las condiciones para realizar la actividad.

El Risk Assessment expresa el riesgo derivado de combinar clima, ruta, exposición y características del ciclista.

---

## Dominio del ciclista

El RiderProfile describe características relevantes del ciclista.

Actualmente considera:

- nivel de experiencia;
- objetivo principal de la rodada.

Estos datos modifican determinadas tolerancias del perfil de rodada, pero no eliminan peligros meteorológicos o de exposición.

---

## Dominio de rutas

RouteProfile es el modelo canónico utilizado por LUMAGOSA para representar una ruta.

Puede contener:

- nombre;
- región;
- distancia;
- desnivel;
- duración estimada;
- dificultad física;
- dificultad técnica;
- superficie;
- exposición;
- disciplinas recomendadas;
- puntos de seguridad;
- procedencia de los datos;
- estado de validación.

La procedencia y calidad de los datos forman parte explícita del modelo.

---

## Importación GPX

Los archivos GPX son procesados localmente en el navegador.

Actualmente se extraen:

- puntos geográficos;
- distancia;
- elevación;
- desnivel positivo;
- altitud mínima y máxima;
- marcas de tiempo;
- duración;
- inicio y final;
- límites geográficos.

El GPX también puede visualizarse mediante:

- trazado normalizado;
- perfil altimétrico.

---

## Limitaciones del GPX

Un GPX no permite determinar de forma fiable por sí solo:

- dificultad técnica;
- tipo real de superficie;
- exposición;
- obstáculos;
- estado actual del sendero;
- puntos de escape;
- disponibilidad de asistencia.

Por esta razón estos valores no deben considerarse verificados únicamente por existir un archivo GPX.

LUMAGOSA permite enriquecer manualmente una ruta importada manteniendo su estado de validación provisional.

---

## Risk Engine

RiskEngine evalúa factores asociados a:

- dificultad física;
- dificultad técnica;
- experiencia del ciclista;
- distancia;
- desnivel;
- exposición;
- superficie;
- precipitación;
- viento;
- temperatura;
- radiación UV;
- nivel de confianza de los datos.

La experiencia del ciclista puede modificar algunos factores, pero no debe hacer desaparecer peligros objetivos.

---

## Calidad y procedencia de datos

LUMAGOSA distingue entre datos:

- de catálogo;
- importados mediante GPX;
- declarados por el usuario;
- comunitarios;
- provenientes de proveedores externos;
- verificados.

Una ruta puede permanecer en estado draft o field-review aunque tenga suficiente información para ser evaluada.

Evaluable no significa verificada.

---

## Biblioteca personal de rutas

Sprint 014 introduce Route Library.

Su responsabilidad es conservar RouteProfile creados o enriquecidos por el usuario.

La primera implementación utiliza localStorage.

Arquitectura:

UI
↓
RouteLibraryProvider
↓
routeLibraryStorage
↓
localStorage

Esta separación permite sustituir posteriormente localStorage por persistencia remota sin acoplar los componentes de interfaz al mecanismo de almacenamiento.

La biblioteca almacena RouteProfile, no el archivo GPX completo ni todos sus puntos.

---

## Persistencia actual

Actualmente LUMAGOSA utiliza almacenamiento local para determinadas preferencias y datos personales de aplicación.

Esta persistencia es una etapa de desarrollo.

Una arquitectura futura podrá utilizar:

API
+
autenticación
+
base de datos

para sincronizar información entre dispositivos.

---

## Principios arquitectónicos

1. Separar dominio, infraestructura y presentación.
2. No presentar datos inferidos como datos verificados.
3. Mantener trazabilidad de la procedencia de los datos.
4. Mantener Recommendation Score y Risk Assessment como conceptos distintos.
5. Favorecer componentes sustituibles mediante abstracciones.
6. Procesar localmente información cuando no sea necesario enviarla a un servidor.
7. Diseñar la aplicación para permitir futuras fuentes de datos sin reescribir el dominio.