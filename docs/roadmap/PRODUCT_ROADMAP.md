# AppSec Academy — Hoja de Ruta del Producto (Product Roadmap)

## 1. Visión Cronológica y Fases de Maduración

El desarrollo de AppSec Academy se planifica en **cuatro horizontes evolutivos**, transitando de forma segura desde la infraestructura base y el MVP inicial hasta un ecosistema integral de ingeniería de seguridad:

```mermaid
gantt
    title Hoja de Ruta de Producto — AppSec Academy
    dateFormat  YYYY-MM
    section Fase 0: Fundación
    Sprint 0 (Discovery, UX, Arq, Currículo) :done, 2026-11, 2026-11
    section Fase 1: MVP Core
    Sprint 1 (Shell, Design System, M01 OWASP) :active, 2026-11, 2026-12
    Sprint 2 (Sandbox Runner, M02 Secure Coding, M03 APIs) : 2026-12, 2027-01
    Sprint 3 (M04 a M08: Vuln, Supply Chain, Cloud, JWT) : 2027-01, 2027-02
    Sprint 4 (M09 a M14: TM, Crypto, CI/CD, AI Security) : 2027-02, 2027-03
    section Fase 2: Ecosistema
    Threat Modeling Studio Avanzado : 2027-03, 2027-04
    Security Architecture Visualizer : 2027-04, 2027-05
    Knowledge Graph Bidireccional Completo : 2027-05, 2027-06
    section Fase 3: Avanzada
    PWA Offline & Desafíos CTF Comunitarios : 2027-06, 2027-07
```

---

## 2. Descripción de Fases y Entregables Clave

### Fase 0: Fundación y Sprint 0 (Actual)
- **Objetivo**: Descubrimiento de producto, arquitectura técnica Angular Standalone, mapa curricular de 14 módulos (100% trazable), sistema de diseño accesible y estrategia de calidad estática en GitHub Pages.
- **Estado**: **Completado al 100% documentalmente.**

### Fase 1: MVP Núcleo Educativo y Sandbox en Cliente (Sprints 1 a 4)
- **Sprint 1 (Fundación Técnica y M01)**:
  - Inicialización del proyecto Angular 22 standalone con TypeScript estricto.
  - Implementación del sistema de diseño (tokens CSS, layout responsive, tema dark-first).
  - Shell de aplicación con Hash Routing (`/#/`).
  - Capa de persistencia local en `LocalStorage`/`IndexedDB` con Signals (`ProgressStore`).
  - Módulo Troncal 01 completo: Fundamentos OWASP (4 lecciones, labs en Web Worker y quizzes).
- **Sprint 2 (Expansión de Sandbox y Módulos 02 y 03)**:
  - Consolidación del sandbox Web Worker y orquestador de pruebas.
  - Módulo 02: Codificación Segura (labs de Inyección SQL y XSS).
  - Módulo 03: Seguridad en APIs (labs de BOLA, BFLA y SSRF).
  - Mecanismo de exportación e importación de snapshots JSON firmados con SHA-256.
- **Sprint 3 (Infraestructura, Nube y Cadena de Suministro: M04 a M08)**:
  - Módulo 04: Vulnerability Management (Calculador interactivo CVSS v4.0).
  - Módulo 05: Supply Chain Security (Validador de SBOM CycloneDX y SLSA).
  - Módulo 06: Cloud Security (IAM Least Privilege & IMDSv2).
  - Módulo 07: Container Security (Dockerfile Hardening & Pod Security).
  - Módulo 08: Identidad y Sesiones (OAuth 2.1, PKCE y Auditoría JWT).
- **Sprint 4 (Especialización Avanzada y Cierre Curricular: M09 a M14)**:
  - Módulo 09: Threat Modeling (Lienzo interactivo STRIDE básico).
  - Módulo 10: Criptografía Aplicada (AES-GCM, Argon2id con Web Crypto API).
  - Módulo 11: DevSecOps & Policy as Code (OPA / Rego).
  - Módulo 12: CI/CD Security (Hardening de GitHub Actions).
  - Módulo 13: Application Security Testing (Reglas SAST semánticas y Fuzzing).
  - Módulo 14: AI & LLM Security (Prompt Injection Guardrails y RAG).

### Fase 2: Consolidación del Ecosistema de Ingeniería (Post-MVP)
- **Threat Modeling Studio Avanzado**: Exportación Open Threat Model (OTM), generador automático de mitigaciones ASVS.
- **Security Architecture Visualizer Interactivo**: Flujos paso a paso de Zero Trust, mTLS y federación OIDC.
- **AppSec Knowledge Graph Completo**: Visualización tridimensional/bidimensional interactiva de relaciones entre CWEs, vulnerabilidades, controles y herramientas.

### Fase 3: Capacidades Avanzadas y Comunidad
- **Soporte PWA 100% Offline**: Service Worker con almacenamiento local para estudio sin conectividad.
- **Banco de Retos de Seguridad Comunitarios**: Creación e importación de retos prácticos creados por la comunidad mediante especificación abierta.
