# AppSec Academy

> **Estación de Trabajo de Ingeniería y Plataforma Interactiva de Aprendizaje de Application Security (AppSec)**

AppSec Academy es una plataforma interactiva de aprendizaje de seguridad en aplicaciones diseñada para desarrolladores de software, ingenieros, arquitectos y profesionales de tecnología.

---

## 1. Visión del Producto

A diferencia de los sistemas de aprendizaje tradicionales (LMS) pasivos basados en videos pregrabados, AppSec Academy opera como una **estación de trabajo de ingeniería (*Engineering Workstation*) y laboratorio interactivo**.

La plataforma permite a los estudiantes comprender, experimentar, analizar y aplicar conocimientos de seguridad mediante código ejecutable, simulaciones en sandbox confinado y modelado de amenazas en el navegador.

### Principios Fundamentales:
1. **Learning by doing**: Cada concepto se valida mediante resolución técnica interactiva.
2. **Mobile first**: Experiencia ergonómica y responsive completa desde viewports de 360 px.
3. **Español técnico de alta calidad**: Traducción y adaptación rigurosa de estándares internacionales.
4. **Contenido técnico riguroso**: Mapeo estricto a especificaciones oficiales (OWASP, NIST, CWE, SLSA, CSA).
5. **Experiencias interactivas**: Entornos de prueba en el navegador del cliente.
6. **Arquitectura modular**: Desacoplamiento estricto entre contenido, lógica y presentación.
7. **Accesibilidad**: Conformidad con WCAG 2.2 Nivel AA.
8. **Rendimiento**: Arquitectura *static-first* ligera optimizada para GitHub Pages.
9. **Seguridad por diseño**: Confinamiento hermético en Web Workers y origen nulo sin objetivos externos.
10. **Evolución incremental y trazable**: Gobernanza de evidencia y trazabilidad completa.

---

## 2. Estado del Proyecto: Línea Base Documental

El repositorio se encuentra actualmente en su **corte documental de cierre de Sprint 0 y Sprint 0.9 (Auditoría y Gobernanza)**, previo al inicio de la fase de implementación de software (Sprint 1).

```text
Historial de Fases:
[x] Sprint 0   — Definiciones de producto, arquitectura, UX/UI y currículo troncal
[x] Sprint 0.9 — Auditoría de consistencia, modelo de riesgos y política de evidencia
[x] Corte Git  — Línea base documental versionada y trazable
[ ] Sprint 1   — Implementación de software base en Angular Standalone (Sin iniciar)
```

---

## 3. Mapa de la Documentación (`docs/`)

La documentación oficial está organizada en los siguientes módulos:

- **[docs/governance/](docs/governance/)**:
  - [`EVIDENCE_POLICY.md`](docs/governance/EVIDENCE_POLICY.md): Política de evidencia, rigor técnico y taxonomía epistémica.
- **[docs/audit/](docs/audit/)**:
  - [`SPRINT_0_AUDIT.md`](docs/audit/SPRINT_0_AUDIT.md): Informe de auditoría del Sprint 0.
  - [`CONSISTENCY_MATRIX.md`](docs/audit/CONSISTENCY_MATRIX.md): Matriz de consistencia cruzada y recálculo curricular.
  - [`SECURITY_RISK_REGISTER.md`](docs/audit/SECURITY_RISK_REGISTER.md): Registro de riesgos AppSec y modelo STRIDE.
  - [`ARCHITECTURAL_ASSUMPTIONS.md`](docs/audit/ARCHITECTURAL_ASSUMPTIONS.md): Registro de 11 hipótesis técnicas pendientes de validación.
  - [`SPRINT_1_READINESS.md`](docs/audit/SPRINT_1_READINESS.md): Evaluación de preparación para Sprint 1 y DoR checklist.
- **[docs/product/](docs/product/)**:
  - [`PRODUCT_VISION.md`](docs/product/PRODUCT_VISION.md): Declaración de visión, principios y ecosistema.
  - [`PRD.md`](docs/product/PRD.md): Documento de requisitos de producto y métricas.
  - [`PERSONAS.md`](docs/product/PERSONAS.md): Arquetipos de usuario de ingeniería.
  - [`SCOPE.md`](docs/product/SCOPE.md): Delimitación de alcance (MVP vs Futuro vs Exclusiones).
  - [`ACCEPTANCE_CRITERIA.md`](docs/product/ACCEPTANCE_CRITERIA.md): Criterios de aceptación funcionales.
- **[docs/curriculum/](docs/curriculum/)**:
  - [`CURRICULUM_MAP.md`](docs/curriculum/CURRICULUM_MAP.md): Mapa curricular de 14 módulos troncales y 49 lecciones.
  - [`LEARNING_PATH.md`](docs/curriculum/LEARNING_PATH.md): Rutas guiadas de especialización y grafo DAG.
  - [`CONTENT_INVENTORY.md`](docs/curriculum/CONTENT_INVENTORY.md): Inventario de contenido, trazabilidad y estándares.
  - [`LEARNING_OBJECTIVES.md`](docs/curriculum/LEARNING_OBJECTIVES.md): Objetivos instruccionales (Taxonomía de Bloom).
  - [`CONTENT_GAPS.md`](docs/curriculum/CONTENT_GAPS.md): Análisis de brechas y reconciliación temática.
- **[docs/learning/](docs/learning/)**:
  - [`LEARNING_EXPERIENCE.md`](docs/learning/LEARNING_EXPERIENCE.md): Experiencia formativa y ergonomía de aprendizaje.
  - [`LESSON_TEMPLATE.md`](docs/learning/LESSON_TEMPLATE.md): Plantilla estandarizada de 9 secciones por lección.
  - [`ASSESSMENT_MODEL.md`](docs/learning/ASSESSMENT_MODEL.md): Modelo formativo y fórmulas de cálculo.
  - [`GAMIFICATION.md`](docs/learning/GAMIFICATION.md): Reconocimiento técnico (*Proof of Skill*) y radares.
  - [`LABORATORY_STRATEGY.md`](docs/learning/LABORATORY_STRATEGY.md): Estrategia de sandboxing en cliente.
- **[docs/design/](docs/design/)**:
  - [`BRAND_IDENTITY.md`](docs/design/BRAND_IDENTITY.md): Identidad de marca y dirección creativa *Dark-First*.
  - [`DESIGN_SYSTEM.md`](docs/design/DESIGN_SYSTEM.md): Tokens CSS, componentes accesibles y WCAG 2.2 AA.
  - [`INFORMATION_ARCHITECTURE.md`](docs/design/INFORMATION_ARCHITECTURE.md): Arquitectura de información y rutas hash.
  - [`USER_FLOWS.md`](docs/design/USER_FLOWS.md): Flujos principales de usuario.
  - [`SCREEN_SPECIFICATIONS.md`](docs/design/SCREEN_SPECIFICATIONS.md): Especificaciones de las 10 pantallas principales.
- **[docs/architecture/](docs/architecture/)**:
  - [`SYSTEM_ARCHITECTURE.md`](docs/architecture/SYSTEM_ARCHITECTURE.md): Arquitectura general *Static-First*.
  - [`FRONTEND_ARCHITECTURE.md`](docs/architecture/FRONTEND_ARCHITECTURE.md): Arquitectura Angular Standalone y Signals.
  - [`CONTENT_ARCHITECTURE.md`](docs/architecture/CONTENT_ARCHITECTURE.md): Desacoplamiento de contenido tipado.
  - [`DATA_MODEL.md`](docs/architecture/DATA_MODEL.md): Modelos de datos TypeScript.
  - [`ROUTING_AND_DEPLOYMENT.md`](docs/architecture/ROUTING_AND_DEPLOYMENT.md): Enrutamiento hash y GitHub Pages.
  - [`SECURITY_ARCHITECTURE.md`](docs/architecture/SECURITY_ARCHITECTURE.md): Política CSP y seguridad de la plataforma.
  - **ADRs**: [`ADR-001`](docs/architecture/ADRs/ADR-001-ANGULAR-STANDALONE-AND-SIGNALS.md) a [`ADR-005`](docs/architecture/ADRs/ADR-005-LOCAL-PROGRESS-PERSISTENCE-INDEXEDDB.md).
- **[docs/labs/](docs/labs/)**:
  - [`LAB_ARCHITECTURE.md`](docs/labs/LAB_ARCHITECTURE.md): Arquitectura del sandbox en cliente.
  - [`LAB_CATALOG.md`](docs/labs/LAB_CATALOG.md): Catálogo de 12 laboratorios troncales.
  - [`LAB_SECURITY_MODEL.md`](docs/labs/LAB_SECURITY_MODEL.md): Modelo de seguridad y contención en cliente.
- **[docs/quality/](docs/quality/)**:
  - [`QUALITY_STRATEGY.md`](docs/quality/QUALITY_STRATEGY.md): Estrategia de calidad y compuertas técnicas.
  - [`TESTING_STRATEGY.md`](docs/quality/TESTING_STRATEGY.md): Estrategia de pruebas (Unit, E2E Playwright, Axe).
  - [`CI_CD_STRATEGY.md`](docs/quality/CI_CD_STRATEGY.md): Pipeline en GitHub Actions.
  - [`PERFORMANCE_BUDGET.md`](docs/quality/PERFORMANCE_BUDGET.md): Presupuestos de Core Web Vitals.
- **[docs/roadmap/](docs/roadmap/)**:
  - [`PRODUCT_ROADMAP.md`](docs/roadmap/PRODUCT_ROADMAP.md): Hoja de ruta en 4 horizontes.
  - [`PRODUCT_BACKLOG.md`](docs/roadmap/PRODUCT_BACKLOG.md): Backlog priorizado con MoSCoW.
  - [`SPRINT_1.md`](docs/roadmap/SPRINT_1.md): Plan de ejecución detallado para el Sprint 1.
  - [`DEFINITION_OF_DONE.md`](docs/roadmap/DEFINITION_OF_DONE.md): Definición formal de terminado (DoD).
- **[`docs/SPRINT_0_REPORT.md`](docs/SPRINT_0_REPORT.md)**: Informe consolidado de cierre de Sprint 0.

---

## 4. Licencia y Gobernanza

Este proyecto se distribuye bajo principios de código abierto para fines educativos y defensivos de ingeniería de software.
