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

---

## Sprint 015 — Development Environment Foundation

### Objetivo

Normalizar el entorno de desarrollo de LUMAGOSA después de la migración de la estación de trabajo principal desde Windows hacia Debian GNU/Linux.

El objetivo de este sprint no es modificar funcionalidad de la aplicación, sino establecer una base de desarrollo reproducible y reducir diferencias de comportamiento entre sistemas operativos.

### Estado previo

El proyecto se desarrollaba originalmente en Windows.

Durante la recuperación y migración del repositorio a Debian se detectó una diferencia relevante entre ambos sistemas: la sensibilidad a mayúsculas y minúsculas en los nombres de archivo.

El caso concreto se presentó entre:

`routequality.ts`

y:

`routeQuality.ts`

Windows había permitido que esta inconsistencia pasara inadvertida, mientras que el sistema de archivos utilizado en Debian provocó que el build detectara correctamente el problema.

El archivo quedó normalizado como:

`lib/routes/routeQuality.ts`

Este incidente justificó formalizar reglas de desarrollo multiplataforma dentro del repositorio.

### Entorno de desarrollo

El entorno principal queda establecido sobre:

- Debian GNU/Linux 13;
- NVM para administración de versiones de Node.js;
- Node.js 24;
- npm 11;
- Git;
- OpenSSH;
- Visual Studio Code.

El acceso al repositorio remoto mediante SSH fue validado correctamente.

### Node.js

Se añadió:

`.nvmrc`

con la versión mayor:

`24`

Esto permite que un desarrollador situado en la raíz del proyecto pueda ejecutar:

`nvm use`

y utilizar la versión de Node.js definida para LUMAGOSA.

Durante la validación del sprint se utilizó:

`Node.js v24.21.0`

con:

`npm v11.19.0`

### Normalización de finales de línea

Se añadió:

`.gitattributes`

El repositorio establece LF como final de línea para código fuente, configuración, documentación, scripts Unix y formatos de intercambio utilizados por el proyecto.

Los scripts específicos de Windows conservan CRLF.

Los recursos binarios se identifican explícitamente para impedir conversiones de contenido por parte de Git.

Esta configuración reduce diferencias innecesarias entre estaciones Windows y Linux y evita cambios masivos provocados exclusivamente por finales de línea.

### Visual Studio Code

Se creó configuración compartida del proyecto en:

`.vscode/settings.json`

Las decisiones principales son:

- utilizar LF;
- insertar una línea final en los archivos;
- eliminar espacios finales;
- no activar formateo global automático al guardar;
- permitir correcciones explícitas mediante ESLint;
- utilizar la versión de TypeScript instalada en el proyecto;
- excluir `.next` y `node_modules` de búsquedas innecesarias.

No se introdujo Prettier en este sprint.

La decisión busca evitar reformateos masivos del código existente antes de definir una política específica de formato para el proyecto.

### Extensiones recomendadas

Se añadió:

`.vscode/extensions.json`

Por el momento únicamente se recomienda:

`dbaeumer.vscode-eslint`

El soporte principal de TypeScript y JavaScript continúa utilizando las capacidades integradas de Visual Studio Code.

La estrategia es mantener las recomendaciones del workspace deliberadamente mínimas y añadir herramientas únicamente cuando exista una necesidad concreta.

### Validación de sensibilidad a mayúsculas y minúsculas

Se realizó una búsqueda sobre:

- `app`;
- `components`;
- `lib`.

No se detectaron archivos duplicados cuya diferencia fuera únicamente el uso de mayúsculas o minúsculas.

También se verificó específicamente el dominio de rutas.

El archivo existente es:

`routeQuality.ts`

y no existe simultáneamente una variante `routequality.ts`.

### Validaciones técnicas

Después de introducir la configuración del entorno se ejecutaron las siguientes comprobaciones:

`nvm use`

Resultado:

Node.js 24 fue detectado correctamente desde `.nvmrc`.

`npm run lint`

Resultado:

ESLint terminó sin errores.

`npm run build`

Resultado:

Next.js 16.2.10 completó correctamente el build de producción mediante Turbopack, incluyendo compilación, validación TypeScript, generación de páginas estáticas y optimización final.

`git diff --check`

Resultado:

no se detectaron errores de whitespace.

### Archivos incorporados

Nuevos:

- `.nvmrc`;
- `.gitattributes`;
- `.vscode/settings.json`;
- `.vscode/extensions.json`.

Actualizado:

- `docs/DEVELOPMENT_LOG.md`.

### Decisiones y limitaciones

Este sprint no modifica la arquitectura funcional de Ride Recommendation, RiskEngine, RouteProfile ni la biblioteca personal de rutas.

Las vulnerabilidades actualmente reportadas por `npm audit` no se corrigen automáticamente dentro de este sprint.

Se evita deliberadamente utilizar `npm audit fix --force` sin analizar previamente el impacto sobre el árbol de dependencias.

La revisión de dependencias deberá realizarse como una actividad separada.

La advertencia de Next.js relacionada con accesos al servidor de desarrollo desde otros dispositivos de la red local tampoco se modifica en este sprint.

Si se formalizan pruebas desde otros dispositivos de la LAN, deberá evaluarse explícitamente la configuración de `allowedDevOrigins`.

### Resultado

LUMAGOSA dispone ahora de una base de desarrollo más reproducible para Debian y de reglas explícitas para reducir inconsistencias entre Windows y Linux.

La migración de estación de trabajo queda separada de los cambios funcionales del producto y documentada dentro del historial técnico del proyecto.

---

## Sprint 016 — Route Library Experience

### Objetivo

Evolucionar la biblioteca personal de rutas introducida en Sprint 014 para integrarla correctamente con el flujo de evaluación de LUMAGOSA y convertirla en una interfaz más informativa para el ciclista.

El sprint aborda dos aspectos:

- separación del estado de las distintas procedencias de ruta;
- mejora de la experiencia de consulta y gestión de rutas personales.

### Estado previo

La biblioteca personal ya permitía persistir `RouteProfile` mediante `localStorage`.

Sin embargo, al seleccionar una ruta guardada para evaluarla, `ReadinessDashboard` la asignaba también a `importedRoute`.

Esto mezclaba dos conceptos distintos:

- un GPX recién importado y actualmente en edición;
- una ruta persistida previamente en la biblioteca personal.

Como consecuencia, una ruta guardada podía volver a aparecer conceptualmente como si acabara de ser importada.

### Separación de procedencias

Se reorganizó la composición de rutas disponibles para evaluación.

Conceptualmente:

Catálogo LUMAGOSA
+
Biblioteca personal
+
GPX en edición
=
availableRoutes

`availableRoutes` se construye utilizando el identificador de cada `RouteProfile` como clave para evitar duplicados.

La selección continúa realizándose mediante:

`selectedRouteId`

y la ruta resultante alimenta posteriormente a `RideContext`.

### Estado de GPX importado

`importedRoute` conserva ahora un significado específico:

representa únicamente el GPX que está siendo preparado o enriquecido en la sesión actual.

Seleccionar una ruta desde la biblioteca personal ya no modifica `importedRoute`.

Esto evita acoplar el concepto de persistencia con el flujo temporal de importación.

### Procedencia en RouteContextSelector

`RouteContextSelector` recibió información explícita para distinguir:

- Catálogo LUMAGOSA;
- Biblioteca personal;
- GPX en edición.

La procedencia de una ruta no se deduce únicamente a partir de `source.type`.

Esta decisión es importante porque una ruta almacenada en la biblioteca puede conservar legítimamente una fuente de tipo `gpx` sin ser por ello un GPX temporal en edición.

La clasificación de procedencia corresponde al estado de la aplicación y no al dominio persistente de `RouteProfile`.

### Precedencia de estado

Cuando una misma ruta puede coincidir temporalmente con más de una categoría, se utiliza la siguiente precedencia visual:

GPX en edición
↓
Biblioteca personal
↓
Catálogo LUMAGOSA

Esto permite representar correctamente una ruta que acaba de ser importada incluso si su identificador ya existe en la biblioteca.

### Biblioteca personal enriquecida

`RouteLibraryPanel` evolucionó desde una lista básica hacia una vista informativa de las rutas guardadas.

Cada tarjeta puede mostrar:

- nombre;
- región;
- distancia;
- desnivel acumulado;
- dificultad física;
- dificultad técnica;
- superficie;
- exposición;
- estado de validación;
- nivel de calidad;
- puntuación de calidad;
- observaciones de calidad.

### Reutilización de Route Data Quality

La interfaz no implementa reglas propias para determinar la calidad de una ruta.

En su lugar reutiliza:

`assessRouteDataQuality(route)`

Por tanto:

RouteProfile
↓
assessRouteDataQuality
↓
RouteLibraryPanel

La responsabilidad de decidir la calidad de los datos continúa perteneciendo al dominio de rutas y no a la capa de presentación.

### Ruta en evaluación

La biblioteca muestra visualmente cuándo una ruta guardada coincide con `selectedRouteId`.

En ese caso se presenta el estado:

`En evaluación`

La acción de seleccionar una ruta desde la biblioteca actualiza el contexto de rodada y provoca que los motores utilicen ese `RouteProfile`.

No se activa el editor de GPX al seleccionar una ruta persistida.

### Protección contra eliminación accidental

La eliminación directa mediante un único clic fue reemplazada por una confirmación dentro de la propia tarjeta.

Flujo:

Eliminar
↓
Confirmación
├── Cancelar
└── Sí, eliminar

La confirmación utiliza estado local de interfaz y no modifica el contrato de `RouteLibraryProvider`.

Sólo puede existir una solicitud de eliminación activa simultáneamente.

Se evitó depender de `window.confirm()` para mantener la interacción integrada con la interfaz de LUMAGOSA y proporcionar un comportamiento más adecuado para dispositivos móviles.

### Arquitectura resultante

Las rutas disponibles para evaluación quedan conceptualmente organizadas como:

Catálogo LUMAGOSA ──────┐
                        │
Biblioteca personal ────┼──→ availableRoutes
                        │
GPX en edición ─────────┘
                               ↓
                        selectedRouteId
                               ↓
                         selectedRoute
                               ↓
                          RideContext
                               ↓
                    RecommendationEngine
                         + RiskEngine

La persistencia continúa separada:

RouteProfile
↓
RouteLibraryProvider
↓
routeLibraryStorage
↓
localStorage

### Archivos modificados

- `components/readiness/ReadinessDashboard.tsx`;
- `components/readiness/RouteContextSelector.tsx`;
- `components/readiness/RouteLibraryPanel.tsx`;
- `docs/DEVELOPMENT_LOG.md`.

No fue necesario modificar:

- `RouteProfile`;
- `RouteLibraryProvider`;
- `routeLibraryStorage`;
- `RiskEngine`;
- `RecommendationEngine`.

### Validaciones técnicas

Durante el sprint se ejecutaron:

`npm run lint`

Resultado:

ESLint terminó sin errores.

`npm run build`

Resultado:

Next.js 16.2.10 completó correctamente el build de producción y la validación TypeScript.

`git diff --check`

Resultado:

no se detectaron errores de whitespace.

### Validaciones funcionales

Se verificó el comportamiento de las tres procedencias de ruta.

Catálogo LUMAGOSA:

las rutas del catálogo permanecen disponibles y se identifican correctamente.

Biblioteca personal:

una ruta persistida puede seleccionarse y evaluarse sin convertirse en un GPX temporal ni activar el editor de importación.

GPX en edición:

una ruta recién importada se selecciona automáticamente, se identifica como GPX en edición y conserva el flujo de enriquecimiento.

También se verificó que:

- seleccionar una ruta de la biblioteca actualiza la ruta en evaluación;
- RiskEngine utiliza la ruta seleccionada;
- la tarjeta seleccionada refleja el estado `En evaluación`;
- las métricas y la calidad de datos se presentan correctamente;
- cancelar una eliminación conserva la ruta;
- confirmar una eliminación elimina la ruta de la biblioteca;
- la acción `Evaluar ruta` continúa funcionando después de incorporar la confirmación de eliminación.

### Commits funcionales

`e40f52a refactor: separate catalog library and imported route state`

Separa el estado del catálogo, biblioteca personal y GPX temporal.

`6af30d2 feat: improve personal route library experience`

Introduce la biblioteca enriquecida y la protección contra eliminación accidental.

### Decisiones y limitaciones

La biblioteca continúa siendo local al navegador.

Todavía no existe:

- autenticación de usuario;
- sincronización entre dispositivos;
- almacenamiento remoto;
- base de datos de rutas del usuario;
- cartografía real para las rutas guardadas;
- persistencia completa de la geometría GPX dentro de la biblioteca.

Estas capacidades permanecen fuera del alcance del Sprint 016.

### Resultado

La biblioteca personal deja de funcionar únicamente como almacenamiento de `RouteProfile` y pasa a integrarse explícitamente con el flujo de evaluación de LUMAGOSA.

La plataforma distingue ahora correctamente entre rutas del catálogo, rutas personales persistidas y GPX temporales en edición.

Esto prepara la base para evolucionar posteriormente `Mis rutas` hacia una biblioteca asociada a identidad de usuario, sincronización y cartografía sin acoplar esas capacidades a `RiskEngine`.
