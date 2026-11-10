# AppSec Academy — Registro de Hipótesis Arquitectónicas (Architectural Assumptions)

## 1. Propósito del Registro

Este documento cataloga las **hipótesis técnicas críticas** asumidas durante la fase de diseño del Sprint 0. 

De acuerdo con la [Política de Evidencia](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/governance/EVIDENCE_POLICY.md), ninguna de estas hipótesis se considera un hecho comprobado ni una garantía de ingeniería hasta que se ejecute la prueba de validación empírica correspondiente en el sprint asignado y se documenten evidencias reproducibles.

---

## 2. Inventario de Hipótesis Técnicas

### HYP-01: Compatibilidad de Enrutamiento Hash de Angular con GitHub Pages
- **Descripción**: La adopción de `withHashLocation()` en Angular Router garantiza que todas las rutas internas (`/#/leccion/...`) se resuelvan en el cliente sin generar errores HTTP 404 al refrescar la página (`F5`) o acceder directamente desde enlaces externos en el subdirectorio de GitHub Pages (`/app-sec-academy-io/`).
- **Fundamento Técnico**: El servidor web estático de GitHub Pages solo procesa la parte de la URL anterior al fragmento `#`, sirviendo siempre `index.html` con código 200 OK. El fragmento hash es interpretado exclusivamente por el motor de enrutamiento en JavaScript en el navegador.
- **Riesgo**: Que rutas anidadas complejas o redirecciones internas generen pérdida de estado o problemas con herramientas de análisis que no interpreten correctamente los fragmentos hash.
- **Estado Actual**: **VERIFICADO**.
- **Prueba de Validación Ejecutada**: Despliegue en GitHub Pages (`https://yamicueto.github.io/app-sec-academy-io/`), navegación automática por rutas hash (`#/inicio`, `#/dashboard`, `#/curriculum`, `#/leccion/1.1`, `#/laboratorio/LAB-BAC-01`) y recarga directa forzada (`Page.reload`) sobre `#/laboratorio/LAB-BAC-01` en Google Chrome Headless 157.0.8103.39 vía CDP.
- **Criterio Objetivo de Aceptación**: Cero errores 404 registrados en la pestaña de red de Chrome DevTools al recargar cualquier ruta profunda desplegada en GitHub Pages.
- **Sprint de Validación**: **Sprint 1 (Hito 5)**.
- **Evidencia Registrada**: Archivo `scratch/validation_results.json`. Cero respuestas 404 en navegación y recarga. Fallback SPA `404.html` presente con idéntico hash SHA al `index.html`.

---

### HYP-02: Reactividad con Angular Signals y Persistencia Local
- **Descripción**: El uso exclusivo de Angular Signals (`signal`, `computed`, `effect`) combinado con `LocalStorage` es suficiente para gestionar el estado reactivo global de progreso, XP e insignias sin requerir librerías externas de estado (NgRx, Akita) ni introducir desincronizaciones de UI.
- **Fundamento Técnico**: Los efectos reactivos (`effect()`) ejecutan automáticamente la sincronización al almacenamiento local ante cambios en las señales de estado con granularidad fina.
- **Riesgo**: Que los efectos reactivos introduzcan ciclos infinitos de actualización (*glitches*) o que el almacenamiento local alcance su límite de cuota (típicamente 5 MB a 10 MB).
- **Estado Actual**: **VERIFICADO**.
- **Prueba de Validación Ejecutada**: Suite de 40 pruebas automatizadas en Vitest sobre `StorageService` y `ProgressStore`. Verificación empírica en el despliegue de GitHub Pages: tras resolver `LAB-BAC-01` y recargar la página (`Page.reload`), el estado en `localStorage` (`appsec_academy_progress_v1`) retuvo los 100 XP y el récord del laboratorio aprobado, reflejándose reactivamente en el badge de cabecera.
- **Criterio Objetivo de Aceptación**: Tiempo de actualización de UI $< 16$ ms por evento; cero excepciones `QuotaExceededError` con el dataset completo de 49 lecciones.
- **Sprint de Validación**: **Sprint 1 (Hitos 2 y 5)**.
- **Evidencia Registrada**: Tests unitarios en CI/CD y trazabilidad en `scratch/validation_results.json`.

---

### HYP-03: Viabilidad del Presupuesto de Rendimiento (Bundle $\le 250$ KB y LCP $< 2.0$s)
- **Descripción**: La aplicación completa (shell, estilos base, enrutador, componentes visuales e infraestructura de renderizado) puede compilarse para producción con un tamaño inicial transferido inferior a 250 KB y un tiempo de carga LCP inferior a 2.0 segundos en conexiones móviles 4G simuladas.
- **Fundamento Técnico**: Uso de Angular Standalone, esbuild, compresión Brotli/Gzip, purga estricta de CSS y exclusión de librerías pesadas como Monaco Editor.
- **Riesgo**: Que librerías de resaltado sintáctico, renderizadores de Markdown o diagramadores Mermaid inflen el bundle inicial.
- **Estado Actual**: **VALIDADO PARCIALMENTE / PENDIENTE DE VALIDACIÓN COMPLETA (LCP FORMAL Y LIGHTHOUSE)**.
- **Prueba de Validación Ejecutada**: Compilación de producción en pipeline CI/CD y medición en despliegue real en GitHub Pages vía Chrome Headless. Resultados empíricos: HTML ~2.5 kB, `styles.css` 2.86 kB (gzip transferido) / 18.00 kB (bruto), `main.js` 66.69 kB (gzip transferido) / 246.57 kB (bruto). Paquete inicial transferido: ~69.55 kB ($\ll 250$ kB). TTFB: 27 ms. First Contentful Paint (FCP): 64 ms. No obstante, el LCP de campo y el puntaje integral de Lighthouse permanecen en evaluación continua y no se dan por cerrados hasta contar con mediciones completas de laboratorio.
- **Criterio Objetivo de Aceptación**: Bundle inicial comprimido $\le 250$ KB; Score Lighthouse Performance $\ge 90$; LCP $< 2.0$ s.
- **Sprint de Validación**: **Sprint 1 (Hito 5 y 5.1)**.
- **Evidencia Registrada**: Métricas de `performance.getEntriesByType('resource')` en `scratch/validation_results.json`.

---

### HYP-04: Compatibilidad de Política de Seguridad de Contenido (CSP) con Web Workers y WebAssembly
- **Descripción**: La política CSP estricta inyectada en `<meta>` con directivas `script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:;` permite compilar y ejecutar parsers en WebAssembly (SQLite Wasm, OPA Rego) y crear Web Workers desde blobs en memoria sin ser bloqueados por el navegador.
- **Fundamento Técnico**: Las especificaciones W3C CSP Nivel 3 reconocen `'wasm-unsafe-eval'` para compilación de módulos Wasm y `worker-src ... blob:` para workers generados dinámicamente.
- **Riesgo**: Que implementaciones específicas de navegadores (ej. Safari WebKit en iOS) apliquen interpretaciones dispares que bloqueen la creación de workers o módulos Wasm desde etiquetas meta.
- **Estado Actual**: **VALIDADO (Web Workers en Producción) / PENDIENTE DE VALIDACIÓN (WebAssembly)**.
- **Prueba de Validación Ejecutada**: Inyección de meta CSP en `index.html` desplegado en GitHub Pages. Carga y ejecución del Web Worker `worker-RBZIIOM4.js` bajo aislamiento estricto. Registro de eventos de consola CDP: 0 errores de `SecurityError` y 0 bloqueos de CSP. WebAssembly se mantiene pendiente para los laboratorios del Sprint 2.
- **Criterio Objetivo de Aceptación**: Cero violaciones reportadas en la consola de seguridad de Chrome, Firefox y WebKit/Safari.
- **Sprint de Validación**: **Sprint 1 (Web Worker)** y **Sprint 2 (Wasm)**.
- **Evidencia Registrada**: Logs de consola en `scratch/validation_results.json`.

---

### HYP-05: Límites Reales del Aislamiento de Código en el Navegador
- **Descripción**: La combinación de Web Workers y Sandboxed Iframes es suficiente para aislar la ejecución de ejercicios de laboratorio sin que un exploit pueda tomar control de la sesión del usuario ni vulnerar la aplicación anfitriona.
- **Fundamento Técnico**: El modelo de seguridad de procesos del navegador aísla los workers en hilos sin DOM y los iframes sin `allow-same-origin` en orígenes opacos (`null`).
- **Riesgo**: Exploits dirigidos a vulnerabilidades del propio motor de JavaScript del navegador (ataques tipo V8 0-day, fuga de memoria masiva o Spectre/Meltdown en microarquitectura de CPU).
- **Estado Actual**: **ANALIZADO / PENDIENTE DE VALIDACIÓN**.
- **Prueba de Validación Necesaria**: Batería de payloads agresivos ejecutados contra el sandbox (intento de lectura de `window.parent`, prototipo global, consumo masivo de memoria).
- **Criterio Objetivo de Aceptación**: Los payloads de ataque son contenidos o abortados por el sandbox sin impactar la interfaz anfitriona.
- **Sprint de Validación**: **Sprint 1**.
- **Evidencia Requerida**: Informe de pruebas de penetración internas sobre el sandbox con matriz de payloads.

---

### HYP-06: Riesgos de Ejecución de JavaScript Arbitrario en Web Workers
- **Descripción**: Ejecutar código escrito por el estudiante dentro de un Web Worker es seguro siempre que se aplique un Watchdog Timer (2,000 ms) y se anulen las APIs de red (`fetch`, `XMLHttpRequest`, `WebSocket`).
- **Fundamento Técnico**: Los Web Workers carecen de acceso al DOM y a `localStorage`. La terminación mediante `worker.terminate()` interrumpe forzosamente bucles síncronos `while(true)` en hilos dedicados.
- **Riesgo**: Consumo abrupto de memoria que provoque que el sistema operativo mate el proceso de la pestaña completa del navegador (*Out of Memory - OOM crash*).
- **Estado Actual**: **ANALIZADO / PENDIENTE DE VALIDACIÓN**.
- **Prueba de Validación Necesaria**: Ejecutar un script con bucle infinito de reserva de memoria (`let a=[]; while(true) a.push(new Array(1e6))`) y verificar si el Watchdog de 2 segundos actúa antes del colapso del proceso.
- **Criterio Objetivo de Aceptación**: El Worker se destruye y el hilo principal notifica error de timeout o memoria sin que la pestaña se cierre inesperadamente.
- **Sprint de Validación**: **Sprint 1**.
- **Evidencia Requerida**: Registro de ejecución en consola de pruebas automatizadas en Playwright.

---

### HYP-07: Aislamiento Efectivo de Iframes con Origen Opaco (`null`)
- **Descripción**: Un `<iframe>` configurado con `sandbox="allow-scripts"` sin `allow-same-origin` previene ataques de Cross-Site Scripting (XSS) hacia la aplicación principal al residir en un origen nulo.
- **Fundamento Técnico**: La especificación HTML5 estipula que un iframe sin `allow-same-origin` recibe un origen único opaco (`null origin`), bloqueando el acceso a `window.parent.localStorage` o `window.parent.document` por la regla de Same-Origin Policy.
- **Riesgo**: Que el iframe interactúe mediante `postMessage` malicioso no validado con el documento principal.
- **Estado Actual**: **ANALIZADO / PENDIENTE DE VALIDACIÓN**.
- **Prueba de Validación Necesaria**: Inyectar un payload `<script>window.parent.postMessage({ malicious: true }, '*')</script>` y verificar que el receptor anfitrión valida el esquema y descarta mensajes no autorizados.
- **Criterio Objetivo de Aceptación**: Excepción `SecurityError` lanzada en el iframe ante intentos de acceso directo al parent; descarte inmediato de mensajes malformados en el listener `message`.
- **Sprint de Validación**: **Sprint 2**.
- **Evidencia Requerida**: Test unitario de integración verificando el validador de mensajes de canal seguro.

---

### HYP-08: Integridad de Exportaciones JSON mediante Hash SHA-256
- **Descripción**: La inclusión de un digest SHA-256 en los archivos de snapshot JSON permite verificar que el archivo no ha sufrido corrupción accidental de datos durante su descarga, almacenamiento o importación entre dispositivos.
- **Fundamento Técnico**: Las propiedades matemáticas de la función hash criptográfica SHA-256 aseguran que cualquier alteración de un bit en el contenido genera un digest completamente distinto (efecto avalancha).
- **Riesgo**: Confusión del usuario asumiendo que el hash previene que él mismo modifique sus puntos o insignias en el archivo antes de importarlo.
- **Estado Actual**: **ANALIZADO / PENDIENTE DE VALIDACIÓN**.
- **Prueba de Validación Necesaria**: Exportar un snapshot, alterar un carácter en el cuerpo JSON, e intentar importarlo en la plataforma.
- **Criterio Objetivo de Aceptación**: El importador detecta la discrepancia de hash y rechaza el archivo con error explicativo de "Archivo corrupto o alterado".
- **Sprint de Validación**: **Sprint 2**.
- **Evidencia Requerida**: Test automatizado verificando rechazo de archivos manipulados.

---

### HYP-09: Viabilidad de Laboratorios Interactivos de AppSec 100% en Cliente (Sin Backend)
- **Descripción**: Los 12 laboratorios troncales (Broken Access Control, SQLi, SSRF, JWT, CSP, etc.) pueden representarse de forma fidedigna y pedagógicamente rigurosa utilizando parsers en memoria, ASTs y simuladores de red en TypeScript sin un servidor de backend real.
- **Fundamento Técnico**: La seguridad de aplicaciones evalúa contratos de datos, validación sintáctica, cabeceras y control de flujo, conceptos que pueden modelarse con alta fidelidad mediante librerías de análisis sintáctico y Web Crypto API en el navegador.
- **Riesgo**: Que ejercicios complejos (ej. SSRF contra servicios de nube reales o ataques de temporización criptográfica) pierdan realismo al depender de stubs simulados.
- **Estado Actual**: **VERIFICADO (para LAB-BAC-01) / PENDIENTE DE VALIDACIÓN (para los 11 laboratorios restantes)**.
- **Prueba de Validación Ejecutada**: Implementación y ejecución en vivo de `LAB-BAC-01` en GitHub Pages. Simulación HTTP vulnerable (HTTP 200 con fuga de datos clínicos ajenos entre Eve y Alice), simulación HTTP remediada (HTTP 403 Forbidden y Deny by Default) y ejecución de batería completa de 5 aserciones en Web Worker con duración de 1 ms, acreditando 100 XP en el `ProgressStore`.
- **Criterio Objetivo de Aceptación**: El estudiante puede explotar la vulnerabilidad en el código inicial y remediarla exitosamente en el editor, recibiendo aserciones automáticas en $< 20$ ms.
- **Sprint de Validación**: **Sprint 1 (Hitos 4 y 5)**.
- **Evidencia Registrada**: Resultados de ejecución en `scratch/validation_results.json` y tests de `sandbox.service.spec.ts`.

---

### HYP-10: Cumplimiento de Accesibilidad WCAG 2.2 Nivel AA
- **Descripción**: La interfaz y el editor de código pueden alcanzar conformidad con las pautas de accesibilidad WCAG 2.2 AA (contraste $\ge 4.5:1$, navegación 100% por teclado, roles ARIA y compatibilidad con lectores de pantalla).
- **Fundamento Técnico**: El sistema de diseño se construye con tokens CSS semánticos de alto contraste y componentes HTML nativos accesibles (`<button>`, `<main>`, `<nav>`, `<input type="radio">`).
- **Riesgo**: Que componentes complejos (árboles de navegación o editores de código en línea) presenten trampas de teclado (*keyboard traps*) o nombres accesibles ausentes.
- **Estado Actual**: **VALIDADO PARCIALMENTE / NO CONFORME EN SU TOTALIDAD (1 HALLAZGO SERIO DETECTADO)**.
- **Prueba de Validación Ejecutada**: Auditoría automatizada con el motor Axe-Core 4.10.2 inyectado sobre el despliegue real en GitHub Pages evaluando etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`. Resultados: 37 reglas superadas con éxito, 0 violaciones críticas, 1 violación seria: regla `color-contrast` en la clase `.version-tag` (12 nodos afectados). De acuerdo con la Política de Evidencia, la plataforma **NO** puede certificarse WCAG 2.2 AA hasta subsanar este hallazgo y auditar lectores de pantalla.
- **Criterio Objetivo de Aceptación**: Cero violaciones críticas o serias en el reporte Axe; foco visible en todos los controles interactivos.
- **Sprint de Validación**: **Sprint 1 (Hito 5)**.
- **Evidencia Registrada**: Objeto `axeResults` en `scratch/validation_results.json`.

---

### HYP-11: Compatibilidad Ergonómica Móvil desde 360 px
- **Descripción**: La estación de trabajo de ingeniería puede utilizarse ergonómicamente en pantallas móviles pequeñas (desde 360 px de ancho) garantizando cero desbordamiento horizontal y áreas de toque mínimas de 44x44 px.
- **Fundamento Técnico**: Maquetación fluida mediante CSS Flexbox, Grid, variables `clamp()` y adaptación de vistas duales a pestañas apiladas en pantallas estrechas.
- **Riesgo**: Que bloques de código o diagramas SVG desborden el ancho de la pantalla forzando scroll horizontal indeseado de la página completa.
- **Estado Actual**: **VERIFICADO**.
- **Prueba de Validación Ejecutada**: Emulación de viewport móvil de 360x640 px mediante Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride`). Lectura directa de métricas de renderizado: `document.documentElement.scrollWidth = 360`, `clientWidth = 360`, `hasOverflow = false`.
- **Criterio Objetivo de Aceptación**: Aserción `scrollWidth <= clientWidth` evaluada como verdadera en todas las rutas auditadas.
- **Sprint de Validación**: **Sprint 1 (Hito 5)**.
- **Evidencia Registrada**: Objeto `mobileMetrics` en `scratch/validation_results.json`.
