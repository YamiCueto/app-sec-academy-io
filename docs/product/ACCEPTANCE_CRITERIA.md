# AppSec Academy — Criterios de Aceptación del Producto (Product Acceptance Criteria)

## 1. Introducción y Marco de Aceptación

Este documento establece los criterios formales de aceptación (en formato *Given-When-Then* y métricas cuantitativas) requeridos para dar por concluido el MVP de AppSec Academy y validar la idoneidad de sus componentes principales.

---

## 2. Criterios por Capacidad Funcional

### AC-01: Centro de Mando de Aprendizaje (Security Learning Dashboard)
- **AC-01.1 — Visualización de Métricas de Progreso**:
  - *Given* un usuario que ha completado lecciones y laboratorios en su navegador,
  - *When* ingresa a la vista principal del Dashboard,
  - *Then* el sistema debe mostrar el porcentaje exacto de avance global, el número de lecciones finalizadas, los laboratorios aprobados y la insignia más reciente obtenida.
- **AC-01.2 — Persistencia y Resiliencia**:
  - *Given* un usuario que interactúa con la plataforma,
  - *When* recarga el navegador, cierra la pestaña o reinicia la computadora,
  - *Then* todos los datos de avance, código guardado en borradores de laboratorios y respuestas de cuestionarios deben restaurarse de manera idéntica sin pérdida de información.
- **AC-01.3 — Exportación e Importación de Progreso**:
  - *Given* un usuario que desea migrar su progreso a otro dispositivo,
  - *When* hace clic en "Exportar Progreso",
  - *Then* el sistema descarga un archivo JSON validado con firma hash que contiene su perfil de aprendizaje.
  - *Given* un archivo de progreso exportado previamente,
  - *When* el usuario lo carga mediante "Importar Progreso",
  - *Then* el sistema valida la integridad del esquema JSON y restaura inmediatamente el estado en el almacenamiento local.

---

### AC-02: Explorador y Visualizador Curricular
- **AC-02.1 — Filtrado Dinámico de Módulos**:
  - *Given* el catálogo curricular completo con 14 disciplinas,
  - *When* el usuario selecciona un filtro por estándar (ej. "OWASP Top 10") o nivel (ej. "Intermedio"),
  - *Then* la lista de módulos y lecciones se actualiza instantáneamente en menos de 50 ms mostrando únicamente los elementos concordantes.
- **AC-02.2 — Indicadores de Prerrequisitos**:
  - *Given* una lección avanzada que requiere conocimientos previos (ej. "JWT Vulnerabilities" que requiere "Identity & Session"),
  - *When* el usuario visualiza la ficha de la lección,
  - *Then* el sistema muestra claramente las lecciones recomendadas previas y su estado de completitud.

---

### AC-03: Espacio de Trabajo de Lección (Lesson Workspace)
- **AC-03.1 — Estructura Uniforme de 9 Secciones**:
  - *Given* cualquier lección del currículo oficial,
  - *When* el usuario abre la lección,
  - *Then* la vista debe renderizar estrictamente las 9 secciones estandarizadas: (1) Introducción, (2) Objetivos de Aprendizaje, (3) Explicación Conceptual, (4) Ejemplos Técnicos, (5) Escenarios Reales, (6) Laboratorio Práctico, (7) Knowledge Check, (8) Resumen, (9) Referencias Oficiales.
- **AC-03.2 — Resaltado de Sintaxis y Copia Segura**:
  - *Given* fragmentos de código vulnerable y remediado dentro de la lección,
  - *When* se presentan en pantalla,
  - *Then* deben contar con resaltado sintáctico accesible y un botón de copia al portapapeles que confirme visualmente la acción mediante indicador accesible (ARIA live region).

---

### AC-04: Laboratorio Interactivo en Sandbox (AppSec Playground)
- **AC-04.1 — Aislamiento de Ejecución**:
  - *Given* un estudiante que ingresa código o payloads en el editor del laboratorio,
  - *When* ejecuta la prueba de verificación,
  - *Then* la ejecución debe realizarse en un Web Worker aislado con límite de tiempo de ejecución (timeout de 2 segundos) para evitar bloqueos del hilo principal del navegador.
- **AC-04.2 — Verificación de Parche Defensivo**:
  - *Given* un laboratorio de remediación (ej. corregir un Input Sanitizer vulnerable a XSS),
  - *When* el usuario introduce la corrección correcta y hace clic en "Verificar Mitigación",
  - *Then* la suite de pruebas del cliente ejecuta las aserciones, confirma que los vectores maliciosos son neutralizados y los casos legítimos son procesados, marcando el laboratorio como "Aprobado".
- **AC-04.3 — Asistencia Progresiva (Pistas)**:
  - *Given* un estudiante atascado en un laboratorio,
  - *When* solicita una pista (*Hint*),
  - *Then* el sistema revela una pista progresiva (Nivel 1: conceptual, Nivel 2: ubicación del error, Nivel 3: fragmento de guía) con aviso previo del ajuste en la puntuación del ejercicio.

---

### AC-05: Motor de Evaluación (Knowledge Check)
- **AC-05.1 — Retroalimentación Formativa**:
  - *Given* una pregunta técnica del cuestionario,
  - *When* el usuario selecciona una respuesta y envía la evaluación,
  - *Then* el sistema indica si fue correcta o incorrecta e inmediatamente despliega la justificación técnica fundamentada en estándares reconocidos.
- **AC-05.2 — Umbral de Aprobación**:
  - *Given* un cuestionario de lección con 3 a 5 preguntas,
  - *When* el usuario obtiene una puntuación $\ge 80\%$,
  - *Then* la lección se registra como formalmente completada y se habilita el siguiente nivel.

---

### AC-06: Rendimiento, Accesibilidad y Usabilidad Responsive
- **AC-06.1 — Cero Desbordamiento Horizontal (Zero Horizontal Overflow)**:
  - *Given* cualquier pantalla del sistema visualizada en anchos de viewport de 360px, 390px, 768px, 1024px y 1440px,
  - *When* se inspecciona el scroll de la ventana (`document.documentElement.scrollWidth <= window.innerWidth`),
  - *Then* no debe existir desplazamiento horizontal indeseado en ninguna vista ni componente.
- **AC-06.2 — Accesibilidad WCAG 2.2 AA**:
  - *Given* la suite de auditoría automatizada Axe-Core / Lighthouse A11y,
  - *When* se auditan todas las rutas principales de la aplicación,
  - *Then* el puntaje debe ser del 100% sin violaciones críticas ni serias de contraste, roles ARIA, etiquetas de formulario o jerarquía de títulos.
- **AC-06.3 — Presupuesto de Rendimiento (Performance Budget)**:
  - *Given* una conexión móvil estándar simulada (Fast 4G, CPU Slowdown 4x),
  - *When* se carga la aplicación inicial,
  - *Then* LCP debe registrarse en $< 2.0$ segundos y el bundle JS inicial no debe exceder 250 KB comprimido.

---

### AC-07: Despliegue en GitHub Pages y Manejo de Rutas
- **AC-07.1 — Carga Directa y Refresh en Subdirectorio**:
  - *Given* la aplicación desplegada en `https://<usuario>.github.io/app-sec-academy-io/`,
  - *When* el usuario navega a una ruta secundaria (ej. `/app-sec-academy-io/#/leccion/owasp-top-10` o ruta directa vía SPA 404 handler) y refresca la página (F5),
  - *Then* el navegador debe recargar la lección exacta sin mostrar la página de error 404 genérica de GitHub.
- **AC-07.2 — Cero Enlaces Rotos Absolutos**:
  - *Given* assets estáticos (fuentes, iconos, imágenes, esquemas JSON),
  - *When* son referenciados en el código HTML, CSS o TypeScript,
  - *Then* deben utilizar rutas relativas o provistas dinámicamente por la base de la aplicación (`APP_BASE_HREF`), previniendo errores de carga 404.
