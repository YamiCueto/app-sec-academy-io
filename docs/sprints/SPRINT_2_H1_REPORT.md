# AppSec Academy — Informe Técnico de Implementación
## Sprint 2 / Hito 1: Navegación Curricular, Continuidad del Aprendizaje y Publicación Controlada

- **Proyecto**: AppSec Academy (`app-sec-academy-io`)
- **Repositorio**: `https://github.com/YamiCueto/app-sec-academy-io`
- **Línea Base Inicial**: Commit [`78faa75`](https://github.com/YamiCueto/app-sec-academy-io/commit/78faa75) (`main`)
- **Hito**: Sprint 2 / Hito 1 (H1)
- **Estado del Hito**: Completado, Auditado y Publicado en `origin/main`
- **Fecha de Ejecución**: 11 de noviembre de 2026

---

## 1. Resumen Ejecutivo

El Hito 1 del Sprint 2 implementa de manera rigurosa y verificable la navegación curricular y continuidad del aprendizaje, superando las limitaciones diagnosticadas en la línea base (`SPRINT_2_BASELINE.md`):

1. **Explorador Curricular Real (`CurriculumComponent`)**: Sustitución definitiva del componente marcador de posición por un catálogo estructurado con los 14 módulos troncales en sus 3 niveles formativos (Fundacional, Intermedio, Avanzado). El Módulo 01 se presenta 100 % interactivo con acceso a sus 4 lecciones y seguimiento reactivo, mientras los módulos M02 a M14 indican su disponibilidad en fases futuras mediante insignias accesibles `Próximamente`.
2. **Detalle de Módulo Dinámico (`ModuleDetailComponent`)**: Vista detallada con metadatos, desglose de Objetivos Pedagógicos (Taxonomía de Bloom: Recordar, Comprender, Aplicar, Analizar) y Estándares de la Industria (OWASP Top 10:2021, ASVS v4.0.3, SAMM, NIST, CWE), soporte de parámetros dinámicos y manejo robusto de rutas inexistentes (404).
3. **Navegación Secuencial Entre Lecciones (`LessonWorkspaceComponent`)**: Barra de navegación inter-lecciones contiguas (1.1 ↔ 1.2 ↔ 1.3 ↔ 1.4) sin mutaciones indebidas de estado ni otorgamiento erróneo de XP por mera navegación. En la lección 1.4 se integra una tarjeta informativa de fin de bloque indicando que la lección 2.1 está en desarrollo.
4. **Reanudación Contextual en Panel (`DashboardComponent`)**: Tarjeta destacada "Continuar Aprendizaje" con cuatro estados reactivos basados en el progreso real del estudiante (*comienza aquí*, *lección en curso*, *siguiente lección sugerida*, *módulo completado*).
5. **Retorno Contextualizado desde Laboratorio (`LaboratoryComponent`)**: Enlace directo y accesible de retorno hacia la Lección 1.2 desde el entorno `LAB-BAC-01`.
6. **Auditoría de Persistencia y Retrocompatibilidad**: Verificación y blindaje del esquema de almacenamiento ante estados legados del Sprint 1, idempotencia en la asignación de recompensas de XP e inmunidad ante fallos de `localStorage`.
7. **Auditoría en Navegador Real (CDP + Headless Chrome + Axe-Core)**: 0 desbordamiento horizontal en 4 resoluciones (360x640, 390x844, 768x1024, 1440x900) a lo largo de 11 rutas auditadas, 0 violaciones de accesibilidad Axe-Core y validación completa de los flujos de interacción del estudiante.

---

## 2. Fase A: Rectificación del Plan de Ejecución (`SPRINT_2_PLAN.md`)

Siguiendo las directrices del Product Owner, se subsanaron las observaciones sobre la planificación:
1. **Recálculo de Puntos de Historia**: Se corrigió la suma total del backlog del Sprint 2 de 46 SP a **52 SP** (H1 en ejecución: 11 SP; propuestas H2 a H6: 41 SP).
2. **Estado de Aprobación**: Se documentó formalmente que el Hito 1 es el único hito autorizado para implementación; los Hitos 2 a 6 permanecen como propuestas técnicas pendientes de aprobación.
3. **Terminología Criptográfica**: Se rectificó la denominación del mecanismo de exportación/respaldo de datos, catalogándolo formalmente como **hash de comprobación de integridad SHA-256** mediante `WebCrypto API`, corrigiendo la denominación impropia de "firma criptográfica autenticada".
4. **Foco del Sprint**: Se reafirmó que el núcleo rector del Sprint 2 es la experiencia de aprendizaje, la continuidad pedagógica y la accesibilidad universal WCAG 2.1 AA.
5. **Preservación Histórica**: La documentación histórica del Sprint 1 permaneció inalterada.

---

## 3. Fase B: Detalle de Componentes e Infraestructura

### 3.1 — Explorador Curricular (`CurriculumComponent`)
- **Ruta**: `#/curriculum`
- **Archivos**: [`src/app/features/curriculum/curriculum.component.ts`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/features/curriculum/curriculum.component.ts), `.html`, `.scss`, `.spec.ts`
- **Características**:
  - Reemplazo total del marcador de posición (`PlaceholderViewComponent`).
  - Representación de los 14 módulos distribuidos en 3 bloques oficiales:
    - **Bloque 1 — Nivel Fundacional**: M01, M02, M04, M10.
    - **Bloque 2 — Nivel Intermedio**: M03, M08, M09, M13.
    - **Bloque 3 — Nivel Avanzado**: M05, M06, M07, M11, M12, M14.
  - Indicador reactivo de progreso en M01 (*X de 4 lecciones completadas*).
  - Insignia accesible `Próximamente` para módulos no activos (M02–M14).
  - Enlaces directos a detalle de módulo (`#/modulo/:id`).

### 3.2 — Detalle de Módulo (`ModuleDetailComponent`)
- **Ruta**: `#/modulo/:id`
- **Archivos**: [`src/app/features/module-detail/module-detail.component.ts`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/features/module-detail/module-detail.component.ts), `.html`, `.scss`, `.spec.ts`
- **Características**:
  - Normalización robusta del parámetro `:id` (`m01`, `M01`, `m01-owasp-top-10`).
  - Metadatos completos: código, título, nivel, duración estimada, bloque curricular.
  - Sección estructurada de **Objetivos Pedagógicos (Taxonomía de Bloom)** desglosando los 4 niveles formativos (*Recordar, Comprender, Aplicar, Analizar*).
  - Sección de **Estándares y Marcos Normativos** con enlaces externos a especificaciones oficiales (OWASP Top 10:2021, ASVS v4.0.3, SAMM v2.0.1, NIST, CWE).
  - Lista de lecciones con estados interactivos en M01 (`✓ Completada`, `Disponible`) y deshabilitados accesibles en módulos futuros (`aria-disabled="true"`).
  - Manejo de error 404 para módulos inexistentes con enlace de regreso a `#/curriculum`.

### 3.3 — Navegación Secuencial Entre Lecciones (`LessonWorkspaceComponent`)
- **Rutas**: `#/leccion/1.1`, `#/leccion/1.2`, `#/leccion/1.3`, `#/leccion/1.4`
- **Archivos**: [`src/app/features/lesson-workspace/lesson-workspace.component.ts`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/features/lesson-workspace/lesson-workspace.component.ts), `.html`, `.scss`, `.spec.ts`
- **Características**:
  - Barra de navegación inferior y enlaces superiores en el workspace:
    - **1.1**: Enlace a `Siguiente Lección (1.2) →`.
    - **1.2**: Enlaces a `← Lección Anterior (1.1)` y `Siguiente Lección (1.3) →`.
    - **1.3**: Enlaces a `← Lección Anterior (1.2)` y `Siguiente Lección (1.4) →`.
    - **1.4**: Enlace a `← Lección Anterior (1.3)` y tarjeta informativa de cierre de bloque indicando que la lección 2.1 se encuentra en desarrollo.
  - Retorno directo al módulo de pertenencia (`#/modulo/m01`).
  - **Garantía pedagógica**: La navegación secuencial no modifica el estado de aprobación ni confiere XP indebido.

### 3.4 — Reanudación Contextual en Panel (`DashboardComponent`)
- **Ruta**: `#/dashboard`
- **Archivos**: [`src/app/features/dashboard/dashboard.component.ts`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/features/dashboard/dashboard.component.ts), `.html`, `.scss`, `.spec.ts`
- **Características**:
  - Tarjeta destacada "Continuar Aprendizaje" reactiva a las señales de `ProgressStore`:
    - *Estado Inicial Vacío*: Sugiere iniciar con la Lección 1.1 (*"Comienza Aquí"*).
    - *Lección en Curso*: Sugiere reanudar la lección registrada en `lastActiveLessonId` (*"Reanudar Lección X"*).
    - *Siguiente Paso Sugerido*: Identifica la primera lección pendiente del Módulo 01 (*"Iniciar Lección Y"*).
    - *Módulo Completado*: Felicitaciones al 100 % con invitación a repasar o explorar el currículo.

### 3.5 — Retorno Contextualizado desde Laboratorio (`LaboratoryComponent`)
- **Ruta**: `#/laboratorio/LAB-BAC-01`
- **Archivos**: [`src/app/features/laboratory/laboratory.component.html`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/features/laboratory/laboratory.component.html), `.scss`, `.spec.ts`
- **Características**:
  - Botón de retorno directo `← Volver a la Lección 1.2` tanto en el encabezado activo como en la pantalla de error.
  - Preservación íntegra del motor de ejecución Web Worker, drivers de ejecución y las 5 aserciones de seguridad de `LAB-BAC-01`.

---

## 4. Auditoría de Persistencia y Retrocompatibilidad (Fase 2)

Se auditó de forma exhaustiva la capa de persistencia (`StorageService`) y el almacén reactivo (`ProgressStore`):

1. **Compatibilidad con Estados Legados (Sprint 1)**:
   - El esquema original no incluía la propiedad `lastActiveLessonId`.
   - Se validó que un estado guardado bajo el esquema antiguo se cargue correctamente sin arrojar errores ni corromper el estado; `lastActiveLessonId` se inicializa limpiamente en `null`.
2. **Defensa en Profundidad y Sanitización de Entradas**:
   - Se incorporó validación defensiva en `StorageService.isValidProgressState`: `lastActiveLessonId`, de estar presente, debe ser de tipo `string` o `null`/`undefined`.
   - Se reforzó `ProgressStore.setLastActiveLesson()` y `recordLessonCompletion()` para recortar cadenas en blanco e ignorar identificadores vacíos.
3. **Idempotencia en Asignación de XP**:
   - Se verificó que llamadas repetidas a `recordLessonCompletion()` sobre la misma lección no dupliquen los puntos de experiencia (XP) ni dupliquen identificadores en `completedLessons`.
4. **Resistencia ante Fallos de Almacenamiento**:
   - `StorageService` maneja de forma controlada las excepciones de `localStorage` (`QuotaExceededError`, `SecurityError`), preservando el estado en memoria y exponiendo señales observables de error para el usuario sin exponer trazas técnicas internas.
5. **Cobertura Específica de Persistencia**:
   - Pruebas unitarias dedicadas en [`storage.service.spec.ts`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/core/services/storage/storage.service.spec.ts) (9 pruebas) y [`progress.store.spec.ts`](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/src/app/core/stores/progress.store.spec.ts) (15 pruebas).

---

## 5. Control de Alcance e Identidad Visual (Fase 3)

1. **Alineación de Versión en Pie de Página**:
   - Se ajustó el pie de página para reflejar exactamente la versión registrada en `package.json` (`0.1.0`), presentando `"v0.1.0"` sin inconsistencias.
2. **Aislamiento de Perfil (`ProfileComponent`)**:
   - El componente de perfil se mantuvo estrictamente como marcador de posición ordenado (`PlaceholderViewComponent`), etiquetado con `"Próximamente"` y `"Vista en desarrollo"`, evitando incorporar prematuramente funcionalidades de exportación/importación del Hito 6.
3. **Erradicación de Etiquetas Anacrónicas**:
   - Se eliminaron todas las etiquetas obsoletas de sprint o hito en las vistas principales (`header.component.html`, `home.component.html`, `footer.component.html`, `placeholder-view.component.html`), reemplazándolas por textos orientados al estudiante (*"Módulo 01 Disponible"*, *"Explora la Academia"*, *"Vista en desarrollo"*).
4. **Localización**:
   - El 100 % de los textos de interfaz de usuario, mensajes de orientación y retroalimentación se encuentran redactados en español formal y accesible.

---

## 6. Auditoría en Navegador Real y Accesibilidad (Fase 4)

Se desplegó la compilación de producción en un servidor estático local y se ejecutó una auditoría automatizada en navegador real con **Headless Chrome** vía **Chrome DevTools Protocol (CDP)** y el motor **Axe-Core 4.10.2**:

### 6.1 — Verificación de Desbordamiento Horizontal
Se auditaron 4 resoluciones viewport representativas en las 11 rutas de la aplicación:
- **360 x 640 px** (Mobile Small)
- **390 x 844 px** (Mobile Standard)
- **768 x 1024 px** (Tablet)
- **1440 x 900 px** (Desktop)

**Rutas auditadas (11 rutas x 4 resoluciones = 44 evaluaciones)**:
- `#/inicio`
- `#/curriculum`
- `#/modulo/m01`
- `#/modulo/m02`
- `#/modulo/inexistente` (404)
- `#/dashboard`
- `#/leccion/1.1`
- `#/leccion/1.2`
- `#/leccion/1.3`
- `#/leccion/1.4`
- `#/laboratorio/LAB-BAC-01`

**Resultado**: **0 desbordamiento horizontal en el 100 % de las combinaciones** (`document.scrollingElement.scrollWidth === document.documentElement.clientWidth`).

### 6.2 — Auditoría de Accesibilidad WCAG 2.1 AA con Axe-Core
- **Hallazgo inicial remediado**: Se detectó una deficiencia de contraste de color en la insignia de error (`.warning-badge`), cuyo color original `#f43f5e` ofrecía un ratio de 4.18:1 sobre el fondo oscuro.
- **Remediación**: Se actualizó el color a `#fb7185`, alcanzando un ratio de contraste de **5.7:1** (superando el umbral mínimo exigido de 4.5:1 para texto normal).
- **Resultado final**: **0 violaciones de accesibilidad** en todas las rutas analizadas.

### 6.3 — Flujos de Interacción Real en Navegador
Se validó la cadena completa de interacción con eventos reales del ratón y verificación de cambios de hash en la barra de direcciones:
1. `#/curriculum` → clic en botón *"Ver Módulo M01 →"* → navegación efectiva a `#/modulo/m01`.
2. `#/modulo/m01` → clic en *"Iniciar Lección →"* → navegación efectiva a `#/leccion/1.1`.
3. `#/leccion/1.1` → clic en *"Siguiente Lección (1.2) →"* → navegación efectiva a `#/leccion/1.2`.
4. `#/laboratorio/LAB-BAC-01` → clic en *"← Volver a la Lección 1.2"* → navegación efectiva a `#/leccion/1.2`.
5. `#/dashboard` con persistencia en `localStorage` tras recarga completa de página (`Page.reload`) → renderizado exitoso de la tarjeta de reanudación:
   - Título: *"Reanudar Lección 1.2"*
   - Insignia: *"LECCIÓN EN CURSO"*
   - Botón: *"Reanudar Lección 1.2 →"*
   - Experiencia acumulada: *"250 XP"*

---

## 7. Puertas de Calidad por Regresión (Fase 5)

| Control | Comando | Resultado | Estado |
| :--- | :--- | :--- | :---: |
| **Tipado Estricto** | `npm run type-check` | `tsc --noEmit` finalizado con 0 errores. | **APROBADO** |
| **Auditoría de Cero Comentarios** | `npm run audit:comments` | Superada exitosamente en 85 archivos fuente. | **APROBADO** |
| **Pruebas Automatizadas** | `npm run test:ci` | **112 pruebas aprobadas** en 17 archivos de prueba. | **APROBADO** |
| **Seguridad de Dependencias (SCA)** | `npm audit --audit-level=high` | 0 vulnerabilidades detectadas. | **APROBADO** |
| **Compilación de Producción** | `npm run build:prod` | Compilación exitosa sin errores de compilador. | **APROBADO** |
| **Compilación GitHub Pages** | `npm run build:gh-pages` | Compilación exitosa con base-href `/app-sec-academy-io/`. | **APROBADO** |

### Métricas de Rendimiento y Presupuesto de Carga
- **Paquete Inicial Total**: `265.27 kB` bruto.
- **Paquete Inicial Transferido (Gzip)**: **`69.58 kB`**.
- **Presupuesto Máximo Establecido**: $\le 250.00$ kB.
- **Margen de Cumplimiento**: **180.42 kB** por debajo del límite (utilización del 27.83 % del presupuesto).
- **Fragmentos Diferidos (Lazy Chunks)**:
  - `module-detail-component`: 16.18 kB (3.87 kB transferido)
  - `curriculum-component`: 14.70 kB (3.51 kB transferido)
  - `dashboard-component`: 13.77 kB (3.55 kB transferido)
  - `lesson-workspace-component`: 39.44 kB (9.03 kB transferido)
  - `laboratory-component`: 35.35 kB (8.88 kB transferido)
  - `profile-component`: 5.89 kB (1.69 kB transferido)

---

## 8. Matriz de Cumplimiento de Criterios de Aceptación (Hito 1)

| Criterio | Descripción | Estado | Evidencia |
| :---: | :--- | :---: | :--- |
| **AC-H1.1** | Ruta `#/curriculum` renderiza 14 módulos en 3 bloques; M01 disponible, M02–M14 próximamente. | **APROBADO** | `curriculum.component.spec.ts` (6/6 passing) + auditoría CDP. |
| **AC-H1.2** | Ruta `#/modulo/:id` muestra metadatos, objetivos Bloom, estándares y lecciones ordenadas; maneja 404. | **APROBADO** | `module-detail.component.spec.ts` (7/7 passing) + auditoría CDP. |
| **AC-H1.3** | Navegación inter-lecciones contiguas; alternativa en 1.4; retorno a módulo; sin XP indebido por navegación. | **APROBADO** | `lesson-workspace.component.spec.ts` (12/12 passing) + auditoría CDP. |
| **AC-H1.4** | Tarjeta "Continuar Aprendizaje" en `/dashboard` en los 4 estados según store. | **APROBADO** | `dashboard.component.spec.ts` (8/8 passing) + prueba de recarga CDP. |
| **AC-H1.5** | Botón de retorno a `/leccion/1.2` en `LaboratoryComponent`. | **APROBADO** | `laboratory.component.spec.ts` (6/6 passing) + auditoría CDP. |
| **AC-H1.6** | Textos anacrónicos erradicados y versión de pie de página consistente con `package.json`. | **APROBADO** | `footer.component.html` ajustado a "v0.1.0"; Header y Home actualizados. |
| **AC-H1.7** | Cero comentarios en todo el código fuente TypeScript, HTML y SCSS. | **APROBADO** | `npm run audit:comments` en 85 archivos. |
| **AC-H1.8** | Presupuesto inicial transferido $\le 250$ kB. | **APROBADO** | `69.58 kB` transferido en `build:prod`. |
| **AC-H1.9** | Retrocompatibilidad de persistencia y resistencia ante esquemas legados sin `lastActiveLessonId`. | **APROBADO** | `storage.service.spec.ts` y `progress.store.spec.ts` (15/15 passing). |
| **AC-H1.10** | Accesibilidad WCAG 2.1 AA y cero desbordamiento horizontal en 4 resoluciones (360 px a 1440 px). | **APROBADO** | Auditoría Axe-Core 0 violaciones; 0 desbordamientos en 44 rutas. |

---

## 9. Consideraciones y Riesgos para el Hito 2

Antes de dar inicio formal al **Hito 2 (Expansión Curricular: Módulos 02 y 03)**, se identifican los siguientes puntos de atención:
1. **Volumen de Contenidos y Presupuesto de Paquete**: La incorporación de nuevas lecciones (M02: Secure Coding, M03: Criptografía Práctica) debe continuar empleando la estrategia de carga diferida (*lazy loading*) para evitar que los datos estáticos de lecciones sobrecarguen el paquete inicial.
2. **Aislamiento de Laboratorios en Web Workers**: Los nuevos ejercicios prácticos que se planifiquen para M02/M03 deberán ceñirse a las interfaces seguras de `LabEngineService` sin invocar APIs dinámicas (`eval` o `new Function`).
3. **Persistencia Progresiva**: Mantener la regla de idempotencia para lecciones completadas y respetar el umbral de aprobación establecido en el modelo pedagógico.
4. **FLAG STOP**: Se concluye la entrega formal del Hito 1 sin iniciar desarrollo alguno del Hito 2 hasta recibir la autorización explícita.
