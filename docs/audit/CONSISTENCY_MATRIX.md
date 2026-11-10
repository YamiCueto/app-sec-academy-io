# AppSec Academy — Matriz de Consistencia y Trazabilidad (Consistency Matrix)

## 1. Propósito de la Matriz

Esta matriz valida la coherencia cruzada entre los Requisitos del Producto (PRD), la Delimitación del Alcance (Scope), la Arquitectura Técnica, los Registros de Decisión Arquitectónica (ADR), el Currículo Oficial, el Backlog y los Criterios de Aceptación (DoD). 

Permite verificar que ninguna decisión técnica o pedagógica contradiga los principios rectores del sistema.

---

## 2. Matriz de Alineación Cruzada entre Dimensiones del Proyecto

| Dominio / Capacidad | Requisito PRD | Delimitación en Scope | Componente Arquitectónico & ADR | Referencia Curricular | Backlog & Sprint 1 | Criterio DoD / Aceptación | Estado de Consistencia |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Shell & Enrutamiento** | FR-01 / NFR-01 / NFR-13 | MVP (Fase 1) | `AppComponent`, `withHashLocation()`, [ADR-002](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/architecture/ADRs/ADR-002-STATIC-FIRST-GITHUB-PAGES.md) | N/A (Estructural) | US-01.1, US-01.2 (Sprint 1) | Cero errores 404 al refrescar (AC-07.1) | **CONSISTENTE** |
| **Sistema de Diseño Dark-First** | NFR-11 / NFR-12 | MVP (Fase 1) | `tokens.css`, Componentes UI Standalone, [ADR-001](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/architecture/ADRs/ADR-001-ANGULAR-STANDALONE-AND-SIGNALS.md) | N/A (Diseño) | US-02.1, US-02.2 (Sprint 1) | Cero overflow (360px-1440px), WCAG 2.2 AA (AC-06) | **CONSISTENTE** |
| **Gestión de Estado Reactivo** | FR-01.2 / FR-01.3 | MVP (Fase 1) | `ProgressStore` con Angular Signals, [ADR-001](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/architecture/ADRs/ADR-001-ANGULAR-STANDALONE-AND-SIGNALS.md) | M01 a M14 | US-03.1 (Sprint 1) | Reactividad sin dependencias externas (AC-01) | **CONSISTENTE** |
| **Persistencia Local Soberana** | FR-01.4 / FR-01.5 | MVP (Fase 1) | `StorageService` (`localStorage`/`IndexedDB`), [ADR-005](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/architecture/ADRs/ADR-005-LOCAL-PROGRESS-PERSISTENCE-INDEXEDDB.md) | N/A (Persistencia) | US-03.1, US-03.2 (Sprint 1 y 2) | Exportación/Importación con Digest SHA-256 (AC-01.3) | **CORREGIDO (AUD-01)** |
| **Motor de Lecciones (9 Secciones)** | FR-03.1 | MVP (Fase 1) | `LessonWorkspaceComponent`, [ADR-003](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/architecture/ADRs/ADR-003-CONTENT-MODEL-STRUCTURED-JSON-MARKDOWN.md) | 49 Lecciones troncales | US-04.1, US-07.1 (Sprint 1) | Renderizado estricto de las 9 secciones (AC-03.1) | **CORREGIDO (AUD-02)** |
| **AppSec Playground (Sandbox)** | FR-04.1 / FR-04.2 | MVP (Fase 1) | `SandboxService`, Web Workers Pool, [ADR-004](file:///c:/Users/YAMI/Documents/projects/app-sec-academy-io/docs/architecture/ADRs/ADR-004-CLIENT-SIDE-SANDBOX-LABS.md) | 49 Labs interactivos | US-05.1, US-05.4 (Sprint 1) | Watchdog 2s, aserciones en memoria (AC-04) | **CORREGIDO (AUD-03/07)** |
| **Editor de Código en Cliente** | FR-04.1 | MVP (Fase 1) | `CodeEditorComponent` (CodeMirror 6 / Prism) | N/A (Herramienta) | US-05.1 (Sprint 1) | Peso $< 50$ KB, soporte táctil móvil | **CORREGIDO (AUD-04)** |
| **Motor de Quizzes Formativos** | FR-05.1 / FR-05.2 | MVP (Fase 1) | `QuizRunnerComponent` con barajado dinámico | 49 Baterías de Quizzes | US-06.1, US-06.2 (Sprint 1) | Umbral $\ge 80\%$, feedback inmediato (AC-05) | **CONSISTENTE** |
| **Módulo 01: OWASP Fundamentals** | FR-02 | MVP (Fase 1) | Chunks de datos lazy `m01-lesson-*.data.ts` | Lecciones 1.1 a 1.4 (130 min) | US-07.1 (Sprint 1) | 4 lecciones, Lab BAC-01, Insignia desbloqueada | **CONSISTENTE** |
| **Módulos 02 a 14** | FR-02 | MVP (Fase 1) | Chunks de datos desacoplados | Lecciones 2.1 a 14.4 (1,775 min) | US-07.2 a US-07.14 (Sprints 2 a 4) | Cobertura integral de estándares oficiales | **CORREGIDO (AUD-02)** |
| **Threat Modeling Studio** | FR-06 | Fase 1: Guiado / Fase 2: Canvas libre | `ThreatModelingComponent` (SVG declarativo) | Módulo 09 (STRIDE / DFDs) | US-09.1, US-09.2 (Fase 2) | DFDs preconfigurados en MVP, lienzo en Fase 2 | **CORREGIDO (AUD-05)** |
| **Security Architecture Visualizer**| FR-07 | Fase 1: Paso a paso / Fase 2: Simulación | `ArchitectureVisualizerComponent` | M06, M08 (OAuth, mTLS) | Backlog Épica 7 (Fase 2) | Flujos paso a paso en SVG accesibles | **CORREGIDO (AUD-05)** |
| **Knowledge Graph** | FR-08 | Fase 1: Explorador / Fase 2: Grafo 3D | `KnowledgeGraphComponent` (Dataset JSON) | Nodos CWE, CVE, ASVS | US-08.1, US-08.2 (Fase 2) | Búsqueda indexada y panel de relaciones | **CORREGIDO (AUD-05)** |
| **CI/CD y Despliegue Automatizado** | NFR-13 / NFR-14 | MVP (Fase 1) | GitHub Actions `.github/workflows/deploy.yml` | N/A (Infraestructura) | US-010.1, US-010.2 (Sprint 1) | Despliegue automático a GitHub Pages | **CONSISTENTE** |

---

## 3. Matriz de Verificación de Integridad Matemática Curricular

Se recalcularon todas las cantidades y métricas tras la auditoría del Sprint 0.9:

| Módulo | Lecciones | Duración Lectura | Duración Lab | Duración Quiz | Duración Total Módulo |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **M01: OWASP Fundamentals** | 4 | 55 min | 55 min | 20 min | **130 min** |
| **M02: Secure Coding** | 4 | 55 min | 80 min | 20 min | **155 min** |
| **M03: API Security** | 4 | 60 min | 85 min | 20 min | **165 min** |
| **M04: Vulnerability Management** | 3 | 45 min | 45 min | 15 min | **105 min** |
| **M05: Supply Chain Security** | 3 | 45 min | 65 min | 15 min | **125 min** |
| **M06: Cloud Security** | 3 | 45 min | 55 min | 15 min | **115 min** |
| **M07: Container Security** | 3 | 45 min | 55 min | 15 min | **115 min** |
| **M08: Identity & JWT** | 4 | 60 min | 85 min | 20 min | **165 min** |
| **M09: Threat Modeling** | 4 | 60 min | 85 min | 20 min | **165 min** |
| **M10: Applied Cryptography** | 4 | 60 min | 70 min | 20 min | **150 min** |
| **M11: DevSecOps & Governance** | 3 | 45 min | 50 min | 15 min | **110 min** |
| **M12: CI/CD Pipeline Security** | 3 | 45 min | 60 min | 15 min | **120 min** |
| **M13: AppSec Testing** | 3 | 45 min | 55 min | 15 min | **115 min** |
| **M14: AI & LLM Security** | 4 | 60 min | 90 min | 20 min | **170 min** |
| **TOTALES RECALCULADOS** | **49 lecciones** | **725 min (~12.1h)** | **940 min (~15.7h)** | **240 min (4.0h)** | **1,905 min (31.75 horas)** |

---

## 4. Auditoría de Trazabilidad hacia las Disciplinas del Propietario

| Disciplina Original Solicitada | Módulo Asignado | Lecciones Cubiertas | Estándar Oficial Normativo |
| :--- | :---: | :---: | :--- |
| **1. OWASP** | `M01` | 1.1 a 1.4 | OWASP Top 10:2021, ASVS 4.0.3, SAMM 2.0.1 |
| **2. Secure Coding** | `M02` | 2.1 a 2.4 | MITRE CWE Top 25 (2024), SEI CERT |
| **3. API Security** | `M03` | 3.1 a 3.4 | OWASP API Security Top 10 (2023), RFC 6749 |
| **4. Vulnerability Management** | `M04` | 4.1 a 4.3 | FIRST CVSS v4.0 (Nov 2023), EPSS v3, CISA KEV |
| **5. Software Supply Chain Security**| `M05` | 5.1 a 5.3 | OpenSSF SLSA v1.0 (2023), CycloneDX v1.5/1.6 |
| **6. Cloud Security** | `M06` | 6.1 a 6.3 | NIST SP 800-145, CIS Cloud Benchmarks, IMDSv2 |
| **7. Container Security** | `M07` | 7.1 a 7.3 | CIS Docker Benchmark v1.6.0, K8s Pod Security |
| **8. Identity and Session Management**| `M08` | 8.1 a 8.4 | OAuth 2.1 Draft, RFC 7519, W3C WebAuthn |
| **9. Threat Modeling** | `M09` | 9.1 a 9.4 | Shostack 4 Questions, STRIDE, PASTA |
| **10. Cryptography** | `M10` | 10.1 a 10.4 | NIST FIPS 140-3, RFC 8446 (TLS 1.3), Argon2id |
| **11. DevSecOps** | `M11` | 11.1 a 11.3 | NIST SP 800-204D, OPA / Rego CNCF |
| **12. CI/CD Security** | `M12` | 12.1 a 12.3 | OWASP CI/CD Risks (2024), OIDC Trust |
| **13. Application Security Testing** | `M13` | 13.1 a 13.3 | OWASP WSTG v4.2, Semgrep AST, OSS-Fuzz |
| **14. AI Security** | `M14` | 14.1 a 14.4 | OWASP Top 10 for LLM (2025), MITRE ATLAS |
| **COBERTURA TOTAL** | **14 / 14** | **49 / 49** | **100.0% CONSERVADO Y TRAZABLE** |
