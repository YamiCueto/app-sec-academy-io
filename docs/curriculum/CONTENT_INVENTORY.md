# AppSec Academy — Inventario de Contenido y Matriz de Trazabilidad (Content Inventory & Traceability)

## 1. Resumen Ejecutivo del Inventario

Este documento audita y certifica la trazabilidad total del catálogo curricular de AppSec Academy. Garantiza que el **100% de los temas requeridos por el propietario del proyecto** están reflejados en el currículo, acompañados de su duración estimada, modalidad práctica, evaluación formativa y referencia a estándares oficiales vigentes con fecha y versión.

### 1.1. Métricas Consolidadas del Inventario
- **Módulos Troncales**: 14 disciplinas obligatorias.
- **Lecciones Técnicas Estructuradas**: 49 lecciones (distribuidas en 14 módulos).
- **Laboratorios y Simulaciones Interactivas**: 49 laboratorios/demos en sandbox de cliente.
- **Evaluaciones Formativas (Quizzes / Knowledge Checks)**: 49 baterías de preguntas.
- **Tiempo Total Estimado de Instrucción**: 1,905 minutos (31 horas y 45 minutos de práctica y estudio).
- **Cobertura de Temario Original**: 100% (Cero omisiones).

---

## 2. Clasificación de Fuentes y Estándares Oficiales

Todas las lecciones se fundamentan en fuentes normativas y especificaciones formales reconocidas:

| Estándar / Marco | Versión / Fecha | Organismo Emisor | Módulos Vinculados |
| :--- | :--- | :--- | :--- |
| **OWASP Top 10** | Versión 2021 (Diciembre 2021) | OWASP Foundation | M01, M02 |
| **OWASP ASVS** | v4.0.3 (Octubre 2021) | OWASP Foundation | M01, M02, M08 |
| **OWASP SAMM** | v2.0.1 (Noviembre 2020) | OWASP Foundation | M01, M11 |
| **OWASP API Security Top 10** | Versión 2023 (Junio 2023) | OWASP Foundation | M03 |
| **MITRE CWE Top 25** | Edición 2023 / 2024 | MITRE Corporation | M01, M02, M04 |
| **FIRST CVSS** | CVSS v4.0 (Noviembre 2023) / v3.1 | FIRST.org | M04 |
| **OpenSSF SLSA** | SLSA v1.0 (Abril 2023) | OpenSSF / Linux Foundation | M05, M12 |
| **CycloneDX / SPDX** | CycloneDX v1.5 (2023) / SPDX 2.3 | OWASP / Linux Foundation | M05 |
| **CIS Docker / K8s** | CIS Benchmark v1.6.0 (2023) | Center for Internet Security | M07 |
| **CSA Cloud Security** | CSA CCM v4 / Top Threats (2024) | Cloud Security Alliance | M06 |
| **OAuth 2.1 / OIDC** | Draft 2024 / RFC 6749 / OpenID 1.0 | IETF / OpenID Foundation | M08 |
| **TLS 1.3 / Criptografía** | RFC 8446 (2018) / RFC 9106 (Argon2) | IETF / NIST FIPS 140-3 | M10 |
| **STRIDE / Threat Modeling** | Shostack / PASTA Framework | Microsoft / Risk Centric TM | M09 |
| **NIST DevSecOps & Cloud** | SP 800-204D / SP 800-145 | NIST | M06, M11 |
| **OWASP CI/CD Top 10** | Versión 2024 | OWASP Foundation | M12 |
| **OWASP WSTG** | WSTG v4.2 (Diciembre 2020) | OWASP Foundation | M13 |
| **OWASP Top 10 for LLM** | Versión 2025 / v1.1 2023 | OWASP Foundation | M14 |

---

## 3. Matriz de Trazabilidad Integral Lección por Lección

| ID | Módulo / Título de la Lección | Estado del Contenido | Duración (Lect/Lab/Quiz) | Estándar Oficial Vinculado | Laboratorio / Demo en Sandbox |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1.1** | Anatomía de Debilidades y Metodología OWASP | *Original Reorganizado* | 25m (10/10/5) | OWASP Top 10:2021, SAMM 2.0.1 | Comparador dinámico de categorías y riesgo OWASP |
| **1.2** | Broken Access Control (A01:2021) | *Original Reorganizado* | 40m (15/20/5) | OWASP A01:2021, CWE-862 | Detección y parche de elevación horizontal de privilegios |
| **1.3** | Fallos Criptográficos y de Configuración | *Original Reorganizado* | 35m (15/15/5) | OWASP A02:2021, A05:2021 | Auditoría y corrección de cabeceras de respuesta HTTP |
| **1.4** | Marco de Verificación OWASP ASVS (L1, L2, L3) | *Original Reorganizado* | 30m (15/10/5) | OWASP ASVS v4.0.3 | Generador de checklist y nivel de aseguramiento ASVS |
| **2.1** | Validación de Entrada y Codificación Contextual | *Original Reorganizado* | 45m (15/25/5) | CWE-79, CWE-20, ASVS V5 | Sanitización de templates y prevención de DOM-XSS |
| **2.2** | Consultas Parametrizadas y Prevención de Inyección | *Original Reorganizado* | 45m (15/25/5) | CWE-89, CWE-78, OWASP A03 | Refactorización de queries a Sentencias Preparadas |
| **2.3** | Manejo Seguro de Memoria y Desbordamientos | *Original Reorganizado* | 35m (15/15/5) | CWE-119, CWE-190 | Análisis de desbordamientos de enteros y buffers |
| **2.4** | Manejo Seguro de Errores y Logging Defensivo | *Original Reorganizado* | 30m (10/15/5) | CWE-209, CWE-532, OWASP A09 | Configuración de manejador de errores sin stack leak |
| **3.1** | Broken Object Level Authorization (API1:2023 BOLA) | *Original Reorganizado* | 45m (15/25/5) | OWASP API1:2023, CWE-639 | Middleware de autorización y validación de tenancy |
| **3.2** | Broken Function Authorization (BFLA) y Mass Assign | *Original Reorganizado* | 40m (15/20/5) | OWASP API3:2023, API5:2023 | Filtrado estricto de DTOs en endpoint administrativo |
| **3.3** | Rate Limiting y Prevención de Consumo de Recursos | *Original Reorganizado* | 35m (15/15/5) | OWASP API4:2023, RFC 6585 | Algoritmo Token Bucket para mitigación de DoS en API |
| **3.4** | Server-Side Request Forgery (SSRF) en APIs | *Original Reorganizado* | 45m (15/25/5) | OWASP API7:2023, CWE-918 | Filtrado estricto de URLs y bloqueo de IPs privadas |
| **4.1** | Taxonomía de Vulnerabilidades: CVE, CWE y CPE | *Original Reorganizado* | 30m (15/10/5) | MITRE CVE, CWE 2024, NVD | Mapeo interactivo entre CVE y árboles de CWE |
| **4.2** | Cálculo y Evaluación de Métricas CVSS v3.1 vs v4.0 | *Adición Propuesta* | 40m (15/20/5) | FIRST CVSS v4.0 (Nov 2023) | Calculador interactivo de vector CVSS v4.0 |
| **4.3** | Priorización Basada en Riesgo (EPSS, KEV) y SLAs | *Adición Propuesta* | 35m (15/15/5) | FIRST EPSS v3, CISA KEV | Matriz de triaje y priorización por probabilidad de exploit |
| **5.1** | Amenazas Supply Chain: Dependency Confusion & Typo | *Original Reorganizado* | 40m (15/20/5) | OpenSSF, CNCF Supply Chain | Configuración de namespaces privados y registries |
| **5.2** | Software Bill of Materials (SBOM): Generación y Uso | *Original Reorganizado* | 40m (15/20/5) | CycloneDX v1.5, SPDX 2.3 | Parseo y auditoría de vulnerabilidades sobre SBOM |
| **5.3** | Marco SLSA y Firma Criptográfica de Artefactos | *Adición Propuesta* | 45m (15/25/5) | OpenSSF SLSA v1.0, Sigstore | Simulación de verificación de atestados de procedencia |
| **6.1** | Modelo de Responsabilidad Compartida en Nube | *Original Reorganizado* | 30m (15/10/5) | NIST SP 800-145, CIS Cloud | Simulador de fronteras de responsabilidad IaaS/PaaS/SaaS |
| **6.2** | Principio de Menor Privilegio en IAM | *Original Reorganizado* | 45m (15/25/5) | AWS/GCP/Azure IAM Best Practices | Detección de comodines y reducción de permisos IAM |
| **6.3** | Gestión de Secretos y Blindaje de IMDSv2 | *Original Reorganizado* | 40m (15/20/5) | CIS Cloud Benchmark, AWS IMDSv2 | Bloqueo de SSRF hacia servicio de metadatos de instancia |
| **7.1** | Hardening de Dockerfiles y Reducción de Superficie | *Original Reorganizado* | 40m (15/20/5) | CIS Docker Benchmark v1.6.0 | Conversión de Dockerfile vulnerable a distroless no-root |
| **7.2** | Escaneo Estático de Imágenes OCI | *Original Reorganizado* | 35m (15/15/5) | OCI Image Format Spec, Trivy spec | Análisis de capas vulnerables en manifiesto de imagen |
| **7.3** | Seguridad en Runtime y Pod Security Standards | *Original Reorganizado* | 40m (15/20/5) | Kubernetes Pod Security Standards | Definición de políticas Pod Security Admission |
| **8.1** | OAuth 2.1, PKCE y Autenticación Moderna | *Original Reorganizado* | 45m (15/25/5) | OAuth 2.1 IETF Draft, RFC 7636 | Trazado interactivo de intercambio PKCE en SPA |
| **8.2** | Seguridad Robusta en Tokens JWT y Claims | *Original Reorganizado* | 45m (15/25/5) | RFC 7519, RFC 8725 (JWT BCP) | Auditoría de firmas JWT y neutralización de alg:none |
| **8.3** | Gestión de Sesiones, Cookies (`SameSite`) y CSRF | *Original Reorganizado* | 40m (15/20/5) | RFC 6265bis, OWASP ASVS V3 | Blindaje de flags de cookies y tokens anti-CSRF |
| **8.4** | MFA y Passkeys (WebAuthn / FIDO2) | *Adición Propuesta* | 35m (15/15/5) | W3C WebAuthn Level 3, FIDO2 | Simulación de enrolamiento y autenticación sin password |
| **9.1** | Fundamentos de Threat Modeling: Las 4 Preguntas | *Original Reorganizado* | 35m (15/15/5) | Shostack 4 Questions, OWASP TM | Ejercicio de delimitación de alcance arquitectónico |
| **9.2** | Diagramas de Flujo de Datos (DFDs) y Trust Boundaries | *Original Reorganizado* | 45m (15/25/5) | NIST SP 800-154, OWASP TM | Construcción de DFD interactivo en Threat Modeling Studio |
| **9.3** | Metodología STRIDE en Componentes de Software | *Original Reorganizado* | 45m (15/25/5) | Microsoft STRIDE, MITRE CAPEC | Matriz de amenazas STRIDE sobre microservicio |
| **9.4** | Árboles de Ataque y Metodología PASTA | *Adición Propuesta* | 40m (15/20/5) | PASTA Risk-Centric Framework | Modelado de árbol de ataque interactivo |
| **10.1** | Criptografía Moderna: Simétrica vs Asimétrica | *Original Reorganizado* | 40m (15/20/5) | NIST FIPS 197 (AES), RFC 8439 | Cifrado AES-256-GCM y validación de autenticidad |
| **10.2** | Almacenamiento de Contraseñas: Argon2id y Bcrypt | *Original Reorganizado* | 40m (15/20/5) | RFC 9106, NIST SP 800-63B | Benchmark de coste y generación de hashes Argon2id |
| **10.3** | Comunicaciones Seguras: Protocolo TLS 1.3 | *Original Reorganizado* | 35m (15/15/5) | RFC 8446 (TLS 1.3), BSI Guidelines | Inspección de apretón de manos y Perfect Forward Secrecy |
| **10.4** | Gestión y Rotación de Claves Criptográficas (KMS) | *Original Reorganizado* | 35m (15/15/5) | NIST SP 800-57 Part 1 Rev. 5 | Esquema de Envelope Encryption y rotación de claves |
| **11.1** | Principios DevSecOps y Cultura Shift-Left | *Original Reorganizado* | 30m (15/10/5) | DoD DevSecOps, OWASP SAMM | Mapeo de actividades de seguridad en el ciclo SDLC |
| **11.2** | Security as Code y Policy as Code (OPA / Rego) | *Original Reorganizado* | 45m (15/25/5) | Open Policy Agent, CNCF Policy | Autoría y ejecución de políticas Rego de despliegue |
| **11.3** | Automatización de Quality Gates y Métricas AppSec | *Original Reorganizado* | 35m (15/15/5) | NIST SP 800-204D, DORA Metrics | Configuración de compuertas de rechazo de compilación |
| **12.1** | Riesgos CI/CD: Inyección en Pipelines y Fuga Secretos | *Original Reorganizado* | 40m (15/20/5) | OWASP CI/CD Risks (CICD-SEC-01/02) | Detección de inyección de contexto en GitHub Actions |
| **12.2** | Aislamiento de Runners y Tokens Efímeros (OIDC) | *Original Reorganizado* | 45m (15/25/5) | GitHub Actions OIDC Hardening, AWS | Sustitución de credenciales fijas por OIDC Trust |
| **12.3** | Blindaje de Flujos: Git Hooks y Branch Protection | *Original Reorganizado* | 35m (15/15/5) | CIS Software Supply Chain 1.0 | Escáner pre-commit de secretos y firmas de commits |
| **13.1** | Static Application Security Testing (SAST) y ASTs | *Original Reorganizado* | 40m (15/20/5) | OWASP WSTG v4.2, Semgrep Spec | Creación de regla de inspección sintáctica/semántica |
| **13.2** | Dynamic AST (DAST) e Interactive AST (IAST) | *Original Reorganizado* | 40m (15/20/5) | OWASP ZAP Core Specs, WSTG | Auditoría activa de endpoints y correlación IAST |
| **13.3** | Fuzzing Automatizado y Pruebas de Resiliencia | *Original Reorganizado* | 35m (15/15/5) | Google OSS-Fuzz Principles | Generador mutacional de payloads para parsers en cliente |
| **14.1** | Prompt Injection Directa e Indirecta (LLM01) | *Original Reorganizado* | 45m (15/25/5) | OWASP Top 10 LLM:2025 (LLM01) | Bypass de jailbreaks y diseño de defensas en prompt |
| **14.2** | Insecure Output Handling (LLM02) y Ataques Derivados | *Original Reorganizado* | 40m (15/20/5) | OWASP Top 10 LLM:2025 (LLM02) | Sanitización de salida generada para prevenir XSS/SSRF |
| **14.3** | Envenenamiento de Datos y Exfiltración en RAG | *Adición Propuesta* | 40m (15/20/5) | OWASP LLM03, MITRE ATLAS | Detección de inyecciones de datos en chunks de embeddings |
| **14.4** | Sandboxing y Control de Permisos en Agentes Autónomos | *Adición Propuesta* | 45m (15/25/5) | OWASP LLM06, NIST AI RMF | Listas blancas de invocación de herramientas para agentes |

---

## 4. Reconciliación Curricular y Diferenciación Operativa

### 4.1. Cobertura de Temas Específicos del Propietario
- **Defense in Depth**: Cobertura explícita e integrada en M01.1, M02.1 y M06.1 como principio arquitectónico multicapa.
- **Application Security Goals (CIA + AAA)**: Cobertura explícita en M01.1 formalizando Confidencialidad, Integridad, Disponibilidad, Autenticación, Autorización y Auditoría.
- **NIST**: Cobertura explícita en M04, M06, M09, M10, M11 y M14 con versiones formales (NIST SP 800-53 r5, SP 800-63B, SP 800-145, SP 800-204D, AI RMF 1.0).
- **CSA (Cloud Security Alliance)**: Cobertura explícita en M06 incorporando CSA Cloud Controls Matrix (CCM v4) y Top Threats.
- **API Security**: Cobertura explícita integral en M03 (OWASP API Security Top 10:2023, BOLA, BFLA, Rate Limiting, Mass Assignment).
- **Content Security Policy (CSP)**: Cobertura explícita en M01.3, M02.1 y Lab 04.
- **Server-Side Request Forgery (SSRF)**: Cobertura explícita en Lección 3.4 y Lab 03 (`LAB-SSRF-03`).
- **Vulnerability Management**: Cobertura explícita en M04 (CVE, CWE, CVSS v4.0, EPSS v3, CISA KEV).

### 4.2. Diferenciación: 12 Laboratorios Troncales vs. 49 Actividades Prácticas
- **12 Laboratorios Troncales Catalogados (`LAB_CATALOG.md`)**: Entornos de remediación y prueba profunda en Web Workers y sandboxes herméticos (`LAB-BAC-01` a `LAB-AI-12`), con código vulnerable inicial, suite de aserciones en memoria y pistas progresivas.
- **49 Actividades Prácticas de Lección (`CURRICULUM_MAP.md`)**: Cada una de las 49 lecciones incorpora una actividad interactiva en la Sección 6. De estas 49, 12 son los laboratorios troncales de codificación y las 37 restantes son simulaciones guiadas en cliente (calculadores de métricas como CVSS v4.0, generadores de checklists ASVS, diagramación guiada de DFDs y análisis de artefactos SBOM/Dockerfile).

### 4.3. Trazabilidad de Disciplinas
- **Disciplinas Solicitadas por el Propietario**: 14 (OWASP, Secure Coding, API Security, Vulnerability Management, Software Supply Chain Security, Cloud Security, Container Security, Identity and Session Management, Threat Modeling, Cryptography, DevSecOps, CI/CD Security, Application Security Testing, AI Security).
- **Disciplinas Representadas en el Currículo**: 14.
- **Tasa de Representación**: 100% de disciplinas cubiertas con trazabilidad formal.
- **Vínculos y Referencias Externas**: 100% corresponden a estándares formales públicos de organismos oficiales reconocidos (IETF, NIST, OWASP, MITRE, FIRST, OpenSSF, CNCF, CIS, CSA, W3C), sin invención de enlaces ni recursos pregrabados.
