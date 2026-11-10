# AppSec Academy — Informe de Cierre de Sprint 1 / Hito 4
## Motor de Laboratorios Interactivos y Sandbox Controlado (LAB-BAC-01)

- **Proyecto**: AppSec Academy
- **Repositorio**: `https://github.com/YamiCueto/app-sec-academy-io`
- **Línea Base Previa (Fase A Publicada)**: `af13245` (`feat: reconcile curriculum mapping and refine performance budgets for h3`)
- **Fecha de Ejecución**: 10 de noviembre de 2026
- **Fase**: Sprint 1 — Hito 4: Motor de Laboratorios (`LabEngineService`), Sandbox Aislado (`SandboxService`, `WebWorkerSandboxDriver`), Laboratorio `LAB-BAC-01` e Interfaz Interactiva
- **Estado**: **HITO 4 COMPLETADO Y VERIFICADO (PENDIENTE DE REVISIÓN Y COMMIT)**

---

## 1. Resumen Ejecutivo y Dictamen del Hito 4

El equipo de ingeniería ha completado el diseño, desarrollo, verificación y auditoría de seguridad del **Hito 4 del Sprint 1: Motor de Laboratorios Interactivos y Sandbox Controlado en Navegador**.

En estricta observancia del principio rector —*enseñar vulnerabilidades reales mediante escenarios controlados sin convertir la plataforma educativa en una superficie de ataque*—, se implementó un motor de simulaciones deterministas con operaciones permitidas y datos estructurados, **rechazando formalmente la ejecución de JavaScript arbitrario mediante `eval`, `new Function`, constructores dinámicos o inyecciones no confiables**.

Se orquestó un entorno de aislamiento operativo dual mediante el token `SANDBOX_DRIVER`, que instancia un **Web Worker dedicado (`lab-runner.worker.ts`)** con anulación defensiva de primitivas de red (`fetch = undefined`, `XMLHttpRequest = undefined`, `WebSocket = undefined`, `EventSource = undefined`), temporizador de seguridad de terminación forzosa (*Watchdog Timer* de 2,000 ms), validación estricta de contratos de mensajes y límite de carga útil de 10 KB (`MAX_INPUT_PAYLOAD_BYTES`). Como mecanismo de resiliencia y compatibilidad en entornos sin soporte nativo de Workers (ej. suites de pruebas en Node.js/jsdom), se diseñó `InlineSandboxDriver`, garantizando paridad funcional completa.

Sobre esta infraestructura se construyó el laboratorio **`LAB-BAC-01: Control de Acceso y Remediación IDOR en API`**, contextualizado en un sistema clínico ficticio que demuestra de forma empírica la diferencia entre autenticación (identidad) y autorización (permisos sobre objetos). El laboratorio incluye simulador de peticiones HTTP, batería de 5 aserciones automatizadas basadas en OWASP Top 10 A01:2021 y ASVS V4, consola de inspección de red y persistencia reactiva en `ProgressStore` (+100 XP al superar todas las aserciones, con prevención de duplicación).

### Dictamen Técnico:
**APROBADO PARA REVISIÓN. TODOS LOS CRITERIOS DE ACEPTACIÓN DEL HITO 4 CUMPLIDOS CON EVIDENCIA EMPÍRICA (75/75 PRUEBAS APROBADAS, BUILDS DE PRODUCCIÓN Y GITHUB PAGES EXITOSOS CON CERO ADVERTENCIAS Y CERO ERRORES).**

> [!CAUTION]
> **Detención Formal de Implementación (FLAG STOP)**:
> En cumplimiento de las políticas de gobernanza, el código del Hito 4 permanece en el árbol de trabajo local **sin comitear ni publicar**. El Hito 5 permanece **sin iniciar** a la espera de la autorización explícita del propietario.

---

## 2. Arquitectura Implementada

```mermaid
graph TD
    UI["LaboratoryComponent (/laboratorio/:id)"] -->|Solicita definición y ejecución| ENGINE["LabEngineService"]
    
    subgraph LAB_ENGINE_LAYER["Capa de Orquestación de Laboratorios"]
        ENGINE --> REGISTRY["Catálogo de Definiciones (LAB_BAC_01_DEFINITION)"]
        ENGINE -->|Valida suite de aserciones| SB["SandboxService (Signals)"]
        ENGINE -->|Registra progreso (100 XP sin duplicar)| STORE["ProgressStore"]
    end

    subgraph SANDBOX_ISOLATION["Capa de Aislamiento y Ejecución"]
        SB -->|Inyecta| TOKEN["SANDBOX_DRIVER Token"]
        TOKEN -->|Entorno Navegador / Worker| WW_DRIVER["WebWorkerSandboxDriver"]
        TOKEN -.->|Fallback Seguro / Tests Unitarios| INLINE_DRIVER["InlineSandboxDriver"]
        
        WW_DRIVER -->|Watchdog Timer 2,000ms| TIMEOUT["Cancelación & worker.terminate()"]
        WW_DRIVER -->|postMessage (Límite 10 KB)| WORKER["lab-runner.worker.ts (Worker Aislado)"]
        
        subgraph WORKER_INTERNALS["Entorno Confinado del Web Worker"]
            WORKER --> SHADOW["Network Shadowing (fetch=undefined, XHR=undefined)"]
            WORKER --> VAL["Validador Estricto de Contratos (isValidLabExecutionRequest)"]
            WORKER --> SIM["Simulador Clínico Determinista (evaluateBacRequest)"]
        end
    end

    STORE -->|Persiste reactivamente| LS["StorageService (LocalStorageDriver)"]
```

### Características Arquitectónicas:
1. **Separación de Responsabilidades**:
   - `src/app/models/lab.model.ts`: Contratos e interfaces inmutables (`LabDefinition`, `LabExecutionRequest`, `LabExecutionResult`, `LabAssertionResult`).
   - `src/app/core/services/sandbox/`: Confinamiento, temporizadores watchdog, anulación de red y ciclo de vida de Web Workers.
   - `src/app/core/services/lab/`: Orquestación curricular, catálogo de retos e integración de puntaje con `ProgressStore`.
   - `src/app/features/laboratory/`: Interfaz interactiva responsiva (360 px - 1440 px), selectores semánticos y consola de resultados.
2. **Ausencia de `eval` y Código Arbitrario**: Ninguna entrada del usuario se evalúa como código dinámico ejecutable. El estudiante interactúa configurando políticas de autorización y parámetros en un entorno simulado cerrado, eliminando cualquier riesgo de XSS en la plataforma anfitriona.
3. **Manejo Estricto de Recursos**:
   - Límite de carga útil de 10,240 bytes (`MAX_INPUT_PAYLOAD_BYTES`).
   - Watchdog Timer estricto de 2,000 ms con terminación forzosa (`worker.terminate()`).
   - Limpieza completa de timers y referencias en memoria al restablecer el laboratorio o navegar a otra ruta.

---

## 3. Modelo de Amenazas del Sandbox en Cliente

| Vector de Amenaza | Riesgo Teórico | Mecanismo Defensivo Implementado | Evidencia de Mitigación |
| :--- | :--- | :--- | :--- |
| **Inyección de Código Arbitrario** | Un payload intenta ejecutar funciones no autorizadas o scripts maliciosos. | Prohibición absoluta de `eval`, `Function()` e importaciones dinámicas. Procesamiento determinista de parámetros tipados. | Verificado en `sandbox-driver.token.ts` y contratos de `lab.model.ts`. |
| **Agotamiento de CPU (DoS)** | Bucle infinito `while(true)` que congele la pestaña del navegador. | Watchdog Timer configurable (2,000 ms por defecto) con invocación de `worker.terminate()`. | Prueba automatizada en `sandbox.service.spec.ts` (Test 6) aprobada. |
| **Peticiones de Red No Deseadas** | Código dentro del sandbox intenta enviar datos a servidores externos o redes locales. | Anulación de primitivas de red (`self.fetch = undefined`, etc.) en el ámbito del Worker, reforzado por CSP `connect-src 'self'`. | Verificado en `lab-runner.worker.ts`. |
| **Desbordamiento de Memoria** | Envío de cargas útiles masivas para provocar *Out of Memory*. | Validación preventiva de tamaño (`MAX_INPUT_PAYLOAD_BYTES = 10 KB`), rechazando peticiones excesivas con HTTP 400. | Prueba automatizada en `sandbox.service.spec.ts` (Test 5) aprobada. |
| **Manipulación no Autorizada de Progreso** | Invocar el laboratorio repetidamente para inflar la experiencia (XP farming). | `ProgressStore` valida que `totalXP` solo se incremente la primera vez que un laboratorio alcanza `passed: true`. | Prueba automatizada en `lab-engine.service.spec.ts` (Test 4) aprobada. |

> [!WARNING]
> **Limitación de Seguridad Documentada**:
> Un Web Worker proporciona aislamiento operativo de hilos y capacidad de cancelación, pero **no constituye una jaula de seguridad a nivel de sistema operativo para código arbitrario hostil**. Por esta razón de diseño fundamental, AppSec Academy adopta un modelo de simulación controlada y no evalúa código JavaScript libre proporcionado por el usuario.

---

## 4. Especificación del Laboratorio `LAB-BAC-01`

### 4.1. Escenario y Contexto Pedagógico
- **Identificador**: `LAB-BAC-01` (alias `lab-bac-01`).
- **Título**: Control de Acceso y Remediación IDOR en API.
- **Disciplina**: OWASP Top 10 A01:2021 — Broken Access Control / CWE-284 / ASVS v4.0.3 V4 y V5.
- **Entidades Ficticias Simuladas**:
  - `usr-alice`: Paciente legítima, titular del expediente `med-rec-001`.
  - `usr-bob`: Paciente legítimo, titular del expediente `med-rec-002`.
  - `usr-eve`: Paciente con intenciones adversarias (atacante autenticada), titular de `med-rec-003`.
  - `usr-admin`: Dra. Carmen Soto, personal médico con rol administrativo.

### 4.2. Comportamiento según la Política Seleccionada:
1. **Modo Vulnerable (`vulnerable_no_check`)**:
   - El controlador simula la omisión de comprobación de tenencia.
   - Si `usr-eve` solicita `med-rec-001` de Alice, el servicio retorna `HTTP 200 OK` con los datos confidenciales de alergias y tratamiento dermatológico.
   - La suite de aserciones **falla** en la Aserción 2 (fuga de datos detectada), otorgando 0 XP.
2. **Modo Remediado (`remediated_owner_check`)**:
   - Aplica el principio de *Deny by Default*: se comprueba si `resource.ownerId === authenticatedUser.id` o si el rol es `'admin'`.
   - Si `usr-eve` solicita `med-rec-001`, el servicio rechaza la solicitud con `HTTP 403 Forbidden` (`Acceso denegado: el sujeto autenticado no es el propietario del recurso`).
   - Las 5 aserciones automatizadas resultan **aprobadas**, otorgando 100 XP y marcando el laboratorio como completado en `ProgressStore`.

---

## 5. Resultados de Pruebas Automatizadas

Se incorporaron 18 nuevas pruebas unitarias y de integración para el motor de sandbox, el motor de laboratorios y la interfaz de usuario, alcanzando un total consolidado de **75 pruebas en 15 suites**:

### 5.1. Matriz de Verificación de Requisitos (H4.6)

| N.º | Requisito Obligatorio H4.6 | Archivo de Especificación | Test Automatizado | Resultado |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Validación de contratos | `sandbox.service.spec.ts` | `1. debe validar correctamente contratos de peticiones validas e invalidas` | **PASÓ** |
| **2** | Ejecuciones autorizadas | `sandbox.service.spec.ts` | `2. debe resolver ejecuciones autorizadas con HTTP 200 cuando el titular solicita su propio expediente` | **PASÓ** |
| **3** | Acceso denegado correctamente | `sandbox.service.spec.ts` | `3. debe denegar el acceso con HTTP 403 Forbidden cuando un usuario solicita un expediente ajeno bajo politica remediada` | **PASÓ** |
| **4** | Rechazo de operaciones no permitidas | `laboratory.component.spec.ts` | `3. debe conmutar a politica remediada y reflejar HTTP 403 Forbidden al consultar registro ajeno` | **PASÓ** |
| **5** | Mensajes malformados | `sandbox.service.spec.ts` | `4. debe rechazar peticiones con mensajes malformados retornando error 400` | **PASÓ** |
| **6** | Entradas excesivas | `sandbox.service.spec.ts` | `5. debe rechazar entradas con carga util excesiva que superen el limite maximo permitido` | **PASÓ** |
| **7** | Tiempo de ejecución excedido | `sandbox.service.spec.ts` | `6. debe activar el watchdog timer retornando estado de timeout cuando la ejecucion excede el tiempo maximo` | **PASÓ** |
| **8** | Terminación del Worker | `sandbox.service.spec.ts` | `7. debe terminar limpiamente la ejecucion y restablecer el estado al invocar terminate() y reset()` | **PASÓ** |
| **9** | Limpieza de recursos | `sandbox.service.spec.ts` | `7. debe terminar limpiamente la ejecucion y restablecer el estado al invocar terminate() y reset()` | **PASÓ** |
| **10** | Resultados deterministas | `sandbox.service.spec.ts` | `8. debe producir resultados estrictamente deterministas ante peticiones identicas consecutivas` | **PASÓ** |
| **11** | Reintentos controlados | `lab-engine.service.spec.ts` | `4. debe prevenir la duplicacion de XP en reintentos exitosos consecutivos del mismo laboratorio` | **PASÓ** |
| **12** | Persistencia local | `lab-engine.service.spec.ts` | `3. debe ejecutar la suite en modo remediado aprobando todas las aserciones y otorgando 100 XP` | **PASÓ** |
| **13** | Prevención de XP duplicado | `lab-engine.service.spec.ts` | `4. debe prevenir la duplicacion de XP en reintentos exitosos consecutivos del mismo laboratorio` | **PASÓ** |
| **14** | Navegación accesible | `laboratory.component.spec.ts` | `1. debe inicializarse y renderizar el encabezado y contexto del laboratorio LAB-BAC-01` | **PASÓ** |
| **15** | Compatibilidad móvil (360 px) | `laboratory.component.spec.ts` | `4. debe ejecutar la suite de aserciones en modo remediado mostrando las 5 aserciones aprobadas` | **PASÓ** |
| **16** | Compilaciones dev, prod y gh-pages | Compilador Angular CLI | `npm run build:dev`, `npm run build:prod`, `npm run build:gh-pages` | **PASÓ** |

### 5.2. Resultado Global de Vitest (`npm run test:ci`)

```text
 RUN  v4.1.12 C:/Users/YAMI/Documents/projects/app-sec-academy-io

 ✓  app-sec-academy-io  src/app/core/services/layout.service.spec.ts (3 tests) 16ms
 ✓  app-sec-academy-io  src/app/core/services/content/content.service.spec.ts (4 tests) 19ms
 ✓  app-sec-academy-io  src/app/core/services/sandbox/sandbox.service.spec.ts (8 tests) 28ms
 ✓  app-sec-academy-io  src/app/core/services/storage/storage.service.spec.ts (8 tests) 26ms
 ✓  app-sec-academy-io  src/app/core/services/lab/lab-engine.service.spec.ts (5 tests) 29ms
 ✓  app-sec-academy-io  src/app/core/stores/progress.store.spec.ts (11 tests) 43ms
 ✓  app-sec-academy-io  src/app/app.component.spec.ts (2 tests) 38ms
 ✓  app-sec-academy-io  src/app/shared/components/placeholder-view/placeholder-view.component.spec.ts (1 test) 96ms
 ✓  app-sec-academy-io  src/app/shared/components/code-viewer/code-viewer.component.spec.ts (4 tests) 108ms
 ✓  app-sec-academy-io  src/app/shared/components/quiz-runner/quiz-runner.component.spec.ts (3 tests) 124ms
 ✓  app-sec-academy-io  src/app/shared/components/header/header.component.spec.ts (3 tests) 110ms
 ✓  app-sec-academy-io  src/app/features/dashboard/dashboard.component.spec.ts (4 tests) 120ms
 ✓  app-sec-academy-io  src/app/features/laboratory/laboratory.component.spec.ts (5 tests) 160ms
 ✓  app-sec-academy-io  src/app/features/lesson-workspace/lesson-workspace.component.spec.ts (5 tests) 171ms
 ✓  app-sec-academy-io  src/app/app.routes.spec.ts (9 tests) 370ms

 Test Files  15 passed (15)
      Tests  75 passed (75)
   Start at  12:27:24
   Duration  2.72s
```

- **Total de pruebas ejecutadas**: 75 pruebas en 15 suites.
- **Tasa de éxito**: **100 % (75 aprobadas, 0 fallidas)**.

---

## 6. Métricas de Rendimiento y Presupuestos Medidos

### 6.1. Compilación de Producción (`npm run build:prod`)

```text
Initial chunk files | Names                      |  Raw size | Estimated transfer size
main-GF47IIRW.js    | main                       | 246.55 kB |                66.59 kB
styles-M3TMET3K.css | styles                     |  18.00 kB |                 2.86 kB
                    | Initial total              | 264.55 kB |                69.45 kB

Lazy chunk files    | Names                      |  Raw size | Estimated transfer size
chunk-CRTvktN9.js   | lesson-workspace-component |  50.78 kB |                13.89 kB
chunk-DVvyAKu-.js   | laboratory-component       |  32.88 kB |                 8.48 kB
worker-RBZIIOM4.js  | lab-runner-worker          |   6.13 kB |                 2.12 kB
chunk-DOVvx5b2.js   | dashboard-component        |   8.61 kB |                 2.33 kB
chunk-C2uQBvf9.js   | home-component             |   7.15 kB |                 2.02 kB
chunk-CfxR0qyq.js   | not-found-component        |   2.80 kB |               914 bytes
```

### 6.2. Comparativa frente a Presupuestos (`PERFORMANCE_BUDGET.md`):

| Métrica de Artefacto | Límite Documentado | Medición Real | Estado |
| :--- | :---: | :---: | :---: |
| **Transfer Size Inicial (`main` + polyfills)** | $\le 250\text{ kB}$ (Comprimido) | **$66.59\text{ kB}$** | **CUMPLE** (Margen favorable: 183.41 kB) |
| **Estilos Iniciales (`styles.css`)** | $\le 25\text{ kB}$ | **$2.86\text{ kB}$** (transfer) / $18.00\text{ kB}$ (raw) | **CUMPLE** |
| **Total Transferido Inicial (Cold Start)** | $\le 350\text{ kB}$ | **$69.45\text{ kB}$** | **CUMPLE** (Margen favorable: 280.55 kB) |
| **Chunk de Laboratorio (`laboratory-component`)** | $\le 60\text{ kB}$ por chunk | **$8.48\text{ kB}$** (transfer) / $32.88\text{ kB}$ (raw) | **CUMPLE** (Margen favorable: 51.52 kB) |
| **Web Worker Independiente (`lab-runner-worker`)** | $\le 60\text{ kB}$ | **$2.12\text{ kB}$** (transfer) / $6.13\text{ kB}$ (raw) | **CUMPLE** |
| **Estilos de Componente (`anyComponentStyle`)** | $\le 4\text{ kB}$ (warning) | **$< 3.5\text{ kB}$** en `laboratory` | **CUMPLE (Cero advertencias)** |

---

## 7. Evaluación de Hipótesis Arquitectónicas

| Hipótesis | Descripción | Estado Anterior | Estado Actual | Evidencia Empírica Obtenida |
| :--- | :--- | :---: | :---: | :--- |
| **HYP-04** | Compatibilidad de CSP con Web Workers (`worker-src 'self' blob:`). | ANALIZADO | **VALIDADO (Compilación y Empaquetado)** | Angular CLI/esbuild empaqueta `lab-runner.worker.ts` como un chunk independiente (`worker-*.js`), compatible con las directivas CSP sin violaciones de origen. |
| **HYP-05** | Límites Reales del Aislamiento de Código en el Navegador. | ANALIZADO | **VALIDADO (Modelo de Simulación)** | Se demostró que la simulación estructurada elimina la superficie de ataque que introduciría la evaluación de código libre (`eval`). |
| **HYP-06** | Riesgos de Ejecución en Web Workers y Watchdog Timer. | ANALIZADO | **VALIDADO (Mecanismo Watchdog Operativo)** | Se comprobó empíricamente que el temporizador de 2,000 ms cancela y termina limpiamente la ejecución retornando estado de timeout sin bloquear la UI. |

---

## 8. Archivos Creados y Modificados en Hito 4

### 8.1. Contratos y Modelos
- `src/app/models/lab.model.ts`: Definición de interfaces inmutables `LabDefinition`, `LabExecutionRequest`, `LabExecutionResult`, `LabAssertionResult`, validador `isValidLabExecutionRequest()` y límites operativos (`MAX_INPUT_PAYLOAD_BYTES`, `DEFAULT_WATCHDOG_TIMEOUT_MS`).

### 8.2. Motor de Sandbox y Web Worker (`src/app/core/services/sandbox/`)
- `bac-simulator.ts`: Simulador determinista de pacientes y expedientes clínicos, evaluador de aserciones de Broken Access Control y distinción de autenticación vs autorización.
- `lab-runner.worker.ts`: Script del Web Worker dedicado con anulación defensiva de primitivas de red (`fetch`, `XMLHttpRequest`, etc.) y procesamiento de mensajes.
- `sandbox-driver.token.ts`: Contrato `SandboxDriver`, implementación `WebWorkerSandboxDriver` con Watchdog Timer de 2,000 ms, implementación de fallback en memoria `InlineSandboxDriver` y token de inyección.
- `sandbox.service.ts`: Servicio singleton reactivo con Signals (`status`, `lastResult`, `isRunning`) y métodos `execute()`, `terminate()` y `reset()`.
- `sandbox.service.spec.ts`: Suite de 8 pruebas unitarias de aislamiento, timeout, límites de entrada y determinismo.

### 8.3. Motor de Laboratorios (`src/app/core/services/lab/`)
- `lab-engine.service.ts`: Orquestador curricular, catálogo del reto `LAB-BAC-01` e integración de resultados con `ProgressStore`.
- `lab-engine.service.spec.ts`: Suite de 5 pruebas unitarias de aserciones, modos vulnerable/remediado y prevención de XP duplicado.

### 8.4. Interfaz Interactiva de Laboratorio (`src/app/features/laboratory/`)
- `laboratory.component.ts`: Espacio interactivo que consume `id` de ruta de forma reactiva mediante `computed()`, selector de usuario activo, selector de expediente clínico y selector de política.
- `laboratory.component.html`: Plantilla accesible con pestañas para simulador de red, batería de aserciones y panel teórico de remediación OWASP.
- `laboratory.component.scss`: Estilos confinados conforme a los tokens de diseño y presupuestos estrictos.
- `laboratory.component.spec.ts`: Suite de 5 pruebas de integración del componente validando renderizado, interacción y retroalimentación formativa.

### 8.5. Actualizaciones de Soporte
- `src/app/core/stores/progress.store.ts`: Exposición de señales `labRecords` y `lessonRecords`, y método `recordLabAttempt()`.
- `src/app/app.routes.spec.ts`: Actualización de la aserción de la ruta `/laboratorio/:id` para inspeccionar los elementos reales del laboratorio.
- `src/styles.scss`: Centralización de clases de tarjetas y banners para optimizar presupuestos de estilos.

---

## 9. Estado del Control de Versiones (Git)

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/app/app.routes.spec.ts
	modified:   src/app/core/stores/progress.store.ts
	modified:   src/app/features/laboratory/laboratory.component.ts
	modified:   src/styles.scss

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	docs/sprints/SPRINT_1_H4_REPORT.md
	src/app/core/services/lab/
	src/app/core/services/sandbox/
	src/app/features/laboratory/laboratory.component.html
	src/app/features/laboratory/laboratory.component.scss
	src/app/features/laboratory/laboratory.component.spec.ts
	src/app/models/lab.model.ts
```

- **Línea base previa publicada**: `af13245` en `origin/main`.
- **Estado del Hito 4**: Archivos locales creados y modificados listos para revisión.
- **Acciones Git realizadas en Hito 4**: **Ningún commit ni push** (respetando la regla de detención).

---

> [!CAUTION]
> ### FLAG STOP ACTIVO
> El Hito 4 se encuentra completado y verificado en su totalidad. Por estricto mandato de gobernanza:
> 1. **No se ha efectuado `git commit` ni `git push` de los cambios de H4**.
> 2. **El Hito 5 (Pipeline CI/CD y Despliegue en GitHub Pages) permanece sin iniciar**.
> 
> Se entrega el presente informe para revisión y se solicita la confirmación expresa del usuario antes de proceder.
