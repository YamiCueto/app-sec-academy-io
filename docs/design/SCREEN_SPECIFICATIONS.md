# AppSec Academy — Especificaciones Detalladas de Pantallas (Screen Specifications)

## 1. Relación de Pantallas Diseñadas

Este documento detalla la estructura, jerarquía visual, comportamiento responsive y accesibilidad de las diez pantallas fundamentales del sistema:

1. **Landing Page** (`#/`)
2. **Security Learning Dashboard** (`#/dashboard`)
3. **Curriculum Explorer** (`#/curriculum`)
4. **Module Overview** (`#/modulo/:id`)
5. **Lesson Workspace** (`#/leccion/:id`)
6. **Interactive Laboratory (AppSec Playground)** (`#/playground/:labId`)
7. **Quiz Interface (Knowledge Check)** (`#/leccion/:id#quiz`)
8. **Progress & Achievements** (`#/profile#achievements`)
9. **Knowledge Graph Explorer** (`#/knowledge-graph`)
10. **Profile & Settings** (`#/profile`)

---

## 2. Especificación Pantalla por Pantalla

### 2.1. Pantalla 1: Landing Page (`#/`)
- **Propósito**: Presentar la propuesta de valor y permitir el inicio inmediato del aprendizaje con un solo clic.
- **Estructura Wireframe**:
  ```text
  +-----------------------------------------------------------------------+
  | [Logo] AppSec Academy          [Currículo] [Playground] [Dashboard]   |
  +-----------------------------------------------------------------------+
  |                             HERO SECTION                              |
  |             "Aprende Seguridad de Aplicaciones de Verdad"             |
  |      La estación de trabajo interactiva de ingeniería en español.     |
  |                                                                       |
  |         [ Iniciar Ruta Fundacional ]     [ Explorar Laboratorios ]    |
  +-----------------------------------------------------------------------+
  |                           METRICS TICKER                              |
  |   14 Módulos Troncales  |  49 Labs en Sandbox  |  100% Client-Side    |
  +-----------------------------------------------------------------------+
  |                      ECOSYSTEM CAPABILITIES (CARDS)                   |
  | [Learning Dashboard] [AppSec Playground] [Threat Modeling Studio]     |
  | [Security Visualizer] [Security Challenges] [Knowledge Graph]         |
  +-----------------------------------------------------------------------+
  | FOOTER: Open Source | Static-First | GitHub Pages | WCAG 2.2 AA       |
  +-----------------------------------------------------------------------+
  ```
- **Comportamiento Responsive**:
  - En móvil ($\le 768px$): Los botones de llamada a la acción se apilan verticalmente a ancho completo ($100\%$, altura 48px). Las 6 tarjetas del ecosistema se distribuyen en una sola columna con espaciado vertical de 16px.

---

### 2.2. Pantalla 2: Security Learning Dashboard (`#/dashboard`)
- **Propósito**: Centro de control del estudiante con métricas clave, lección activa y radar de competencias.
- **Estructura Wireframe**:
  ```text
  +-----------------------------------------------------------------------+
  | Dashboard de Aprendizaje                            Alias: [carlos-dev]
  +-----------------------------------------------------------------------+
  | RESUMEN DE PROGRESO                                                   |
  | [ 42% Curriculo ]  [ 18/49 Lecciones ]  [ 12 Labs OK ]  [ 4,200 XP ]  |
  +-----------------------------------+-----------------------------------+
  | LECCIÓN ACTIVA EN CURSO           | RADAR DE HABILIDADES TÉCNICAS     |
  | M01.2: Broken Access Control      |      [Gráfico SVG Multiaxial]     |
  | Estado: Lab pendiente             | - Código Seguro: 65%              |
  | [ Continuar Workspace ]           | - Arquitectura: 40%               |
  |                                   | - APIs: 50%                       |
  |                                   | - Cloud/Containers: 20%           |
  |                                   | - CI/CD & Supply Chain: 30%       |
  +-----------------------------------+-----------------------------------+
  | ÚLTIMAS INSIGNIAS OBTENIDAS                                           |
  | [Badge: OWASP Defender] [Badge: Secure Code Guardian]                 |
  +-----------------------------------------------------------------------+
  ```
- **Comportamiento Responsive**:
  - En móvil ($360px - 767px$): Los bloques de métricas se muestran en un grid de $2 \times 2$. El radar de habilidades se simplifica a barras horizontales de progreso porcentual para facilitar la lectura sin pérdida de precisión.

---

### 2.3. Pantalla 3: Curriculum Explorer (`#/curriculum`)
- **Propósito**: Exploración estructurada de los 14 módulos troncales con filtros avanzados.
- **Estructura Wireframe**:
  ```text
  +-----------------------------------------------------------------------+
  | Explorador Curricular                                                 |
  | Filtros: [ Todos ] [ Básicos ] [ Intermedios ] [ Avanzados ]          |
  | Estándar: [ OWASP ] [ CWE ] [ ASVS ] [ NIST ] [ SLSA ]                 |
  +-----------------------------------------------------------------------+
  | [M01: Fundamentos OWASP] 4 Lecciones | 130 min | Básico | [80% OK]    |
  | [M02: Secure Coding]     4 Lecciones | 155 min | Básico | [50% OK]    |
  | [M03: API Security]      4 Lecciones | 165 min | Intermedio | [0%]    |
  | [M04: Vulnerability Mgmt]3 Lecciones | 105 min | Básico | [0%]        |
  | [M05: Supply Chain Sec]  3 Lecciones | 125 min | Avanzado | [0%]      |
  | ...                                                                   |
  +-----------------------------------------------------------------------+
  ```
- **Comportamiento Responsive**:
  - Los filtros son botones de píldora deslizables horizontalmente en móvil (`overflow-x: auto` con scroll suave táctil).

---

### 2.4. Pantalla 4: Module Overview (`#/modulo/:id`)
- **Propósito**: Ficha técnica del módulo, objetivos pedagógicos, prerrequisitos e índice secuencial de lecciones.
- **Estructura**:
  - Encabezado: Título formal, identificador del módulo (ej. `M01`), nivel, duración estimada acumulada y estándares asociados.
  - Bloque de Prerrequisitos: Módulos recomendados previos con indicadores de estado.
  - Lista de Lecciones: Tarjetas numeradas (1.1, 1.2, 1.3...) con tiempo individual, descripción del laboratorio práctico y estado de completitud.

---

### 2.5. Pantalla 5: Lesson Workspace (`#/leccion/:id`)
- **Propósito**: Entorno de estudio principal con renderizado de las 9 secciones estandarizadas.
- **Estructura Wireframe (Desktop)**:
  ```text
  +---------------------------------------+-------------------------------+
  | Encabezado: Lección 1.2 Broken Access | Acciones: [Laboratorio] [Quiz]|
  +---------------------------------------+-------------------------------+
  | PANEL DE CONTENIDO (Izquierdo 60%)    | PANEL DE LABORATORIO (Der 40%)|
  | 1. Introducción                       | Editor de Código:             |
  | 2. Objetivos de Aprendizaje           | [auth.middleware.ts]          |
  | 3. Explicación Conceptual             | 1: export function checkAuth  |
  |    [Diagrama Mermaid de Arquitectura] | 2:   // Inseguro:             |
  | 4. Ejemplos Técnicos (Tabs Diff)      | 3:   const id = req.params.id;|
  | 5. Escenarios Reales                  |                               |
  | 6. Laboratorio Embebido               | Terminal de Salida:           |
  | 7. Knowledge Check                    | > Verificando aserciones...   |
  | 8. Resumen de Ingeniería              | [ Ejecutar Pruebas ] [Pistas] |
  | 9. Referencias Oficiales              |                               |
  +---------------------------------------+-------------------------------+
  ```
- **Comportamiento Responsive**:
  - En móvil ($< 1024px$): Los paneles izquierdo y derecho se organizan en pestañas superiores accesibles: `[ Teoría (9 secciones) ]` y `[ Estación de Laboratorio ]`. El usuario alterna entre ambas con un solo toque sin perder el scroll ni el estado de edición.

---

### 2.6. Pantalla 6: Interactive Laboratory (AppSec Playground) (`#/playground/:labId`)
- **Propósito**: Espacio de trabajo dedicado para resolución de laboratorios a pantalla completa.
- **Componentes**:
  - Selector de archivos virtuales del laboratorio (ej. `vulnerable.ts`, `tests.ts`).
  - Editor de código con resaltado y soporte de atajos de teclado.
  - Barra de herramientas: Botón "Verificar Mitigación", Botón "Pistas Graduadas", Botón "Restaurar Código Original".
  - Consola de salida de aserciones del Web Worker en tiempo real.

---

### 2.7. Pantalla 7: Quiz Interface (Knowledge Check) (`#/leccion/:id#quiz`)
- **Propósito**: Evaluación formativa de 3 a 5 reactivos al final de la lección.
- **Componentes**:
  - Barra de progreso del cuestionario (ej. "Pregunta 2 de 4").
  - Enunciado claro y legible con formato enriquecido.
  - Opciones de respuesta en botones de selección accesibles.
  - Botón "Comprobar Respuesta" y Panel de justificación técnica inmediata con citas a estándares oficiales.

---

### 2.8. Pantalla 8: Progress & Achievements (`#/profile#achievements`)
- **Propósito**: Visualización del historial de logros técnicos y credenciales obtenidas.
- **Componentes**:
  - Galería de Insignias Técnicas (activas e inactivas con criterios de desbloqueo transparentes).
  - Resumen de Horas de Práctica y Laboratorios Aprobados.
  - Generador de la Credencial Criptográfica JSON (*Proof of Skill*).

---

### 2.9. Pantalla 9: Knowledge Graph Explorer (`#/knowledge-graph`)
- **Propósito**: Navegación visual ontológica entre vulnerabilidades, estándares y controles.
- **Componentes**:
  - Lienzo interactivo de nodos (SVG accesible con zoom, paneo y navegación por teclado).
  - Buscador global por palabra clave o código (ej. "CWE-89", "BOLA", "ASVS").
  - Panel lateral de inspección de nodo: definición formal, estándares asociados y enlaces directos a las lecciones y laboratorios relacionados.

---

### 2.10. Pantalla 10: Profile & Settings (`#/profile`)
- **Propósito**: Control local de datos y preferencias de usuario.
- **Componentes**:
  - Alias de ingeniería (modificable localmente sin autenticación externa).
  - Sección de Portabilidad de Datos: Botón "Descargar Snapshot JSON" y Botón "Cargar Snapshot JSON".
  - Zona de Peligro Local: Botón "Restablecer Todo el Progreso" con diálogo de confirmación explícito.
  - Preferencias de interfaz: Reducción de animaciones forzada, tamaño de tipografía de código.
