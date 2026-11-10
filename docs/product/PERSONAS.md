# AppSec Academy — Personas de Usuario y Arquetipos de Ingeniería

## 1. Introducción y Metodología

Para garantizar que AppSec Academy satisfaga las necesidades concretas de sus usuarios, se han definido seis arquetipos de ingeniería representativos del espectro profesional que diseña, implementa, prueba y despliega software moderno.

---

## 2. Arquetipos de Usuario

### 2.1. Carlos — Ingeniero Backend Senior (Java / Go / Node.js)
- **Perfil**: 32 años, 8 años de experiencia en desarrollo de microservicios y APIs empresariales.
- **Contexto de Uso**: Accede en su portátil de trabajo (Linux/macOS) en bloques de 30-45 minutos; ocasionalmente repasa conceptos y diagramas en su teléfono móvil (iPhone 14, pantalla 390px) durante desplazamientos.
- **Objetivos**:
  - Comprender cómo implementar validaciones y sanitizaciones sin arruinar el rendimiento de sus APIs.
  - Aprender a configurar tokens JWT y sesiones OAuth 2.1 de forma segura (previniendo BOLA, BFLA y problemas de rotación de claves).
  - Responder con argumentos técnicos sólidos a los reportes de herramientas SAST/DAST que su empresa contrata.
- **Frustraciones**:
  - Las capacitaciones corporativas anuales son videos genéricos de 40 minutos sobre "no hacer clic en enlaces sospechosos", sin código real.
  - Los reportes de escáneres automáticos están llenos de falsos positivos y no explican cómo remediar la vulnerabilidad en su framework específico.
- **Cómo AppSec Academy le aporta valor**:
  - Laboratorios de código en backend donde puede ver la consulta SQL parametrizada o el validador de esquema de API funcionando y comprobar la mitigación con pruebas automáticas.

---

### 2.2. Sofía — Ingeniera Frontend & Fullstack (Angular / TypeScript)
- **Perfil**: 27 años, 4 años de experiencia creando Single Page Applications y aplicaciones web progresivas.
- **Contexto de Uso**: Accede principalmente desde su navegador de desarrollo (monitor 1440px) y prueba la plataforma en emuladores y dispositivos móviles reales (Pixel 7).
- **Objetivos**:
  - Dominar la prevención de Cross-Site Scripting (XSS), Clickjacking y vulnerabilidades en Single Page Applications.
  - Comprender a fondo las políticas de Content Security Policy (CSP), CORS, atributos de cookies (`SameSite`, `HttpOnly`, `Secure`) y almacenamiento seguro en el navegador.
  - Aprender sobre seguridad en el empaquetado y dependencias npm (Supply Chain Security).
- **Frustraciones**:
  - Se asume con frecuencia que "el frontend no necesita seguridad porque el backend se encarga de todo".
  - La documentación existente de CSP y cabeceras de seguridad es árida y carece de simuladores interactivos donde visualizar el impacto de una política.
- **Cómo AppSec Academy le aporta valor**:
  - El Playground interactivo le permite ensayar directivas de CSP y evaluar payloads de DOM-XSS en un entorno seguro e instantáneo.

---

### 2.3. Javier — Arquitecto de Software & Tech Lead
- **Perfil**: 41 años, 16 años de trayectoria técnica liderando equipos de ingeniería en banca y fintech.
- **Contexto de Uso**: Accede desde MacBook Pro y iPad en sesiones de diseño arquitectónico y revisión de estándares.
- **Objetivos**:
  - Institucionalizar el Modelado de Amenazas (*Threat Modeling*) en la fase de diseño de los nuevos proyectos de su organización.
  - Seleccionar e implementar marcos reconocidos (OWASP ASVS Nivel 2/3, NIST) para auditorías internas.
  - Diseñar patrones de arquitectura Zero Trust, gestión de identidades federadas y microservicios con mTLS.
- **Frustraciones**:
  - Sus ingenieros consideran que la seguridad es un obstáculo burocrático que ralentiza las entregas.
  - Dificultad para encontrar herramientas accesibles y ligeras de modelado de amenazas sin pagar costosas licencias empresariales complejas.
- **Cómo AppSec Academy le aporta valor**:
  - El **Threat Modeling Studio** y el **Security Architecture Visualizer** le ofrecen herramientas prácticas para enseñar y validar diagramas DFD y matrices STRIDE con su equipo.

---

### 2.4. Laura — Ingeniera DevSecOps & SRE
- **Perfil**: 30 años, 6 años de experiencia en automatización de infraestructura, Kubernetes y CI/CD pipelines (GitHub Actions, GitLab CI).
- **Contexto de Uso**: Trabaja con terminales, editores de código y monitores duales; lee resúmenes y especificaciones técnicas en su smartphone (Galaxy S23).
- **Objetivos**:
  - Automatizar compuertas de seguridad (*Quality Gates*) con SAST, SCA y escaneo de contenedores OCI sin elevar la fricción del equipo de desarrollo.
  - Implementar firmas de artefactos con Sigstore/Cosign, especificaciones SBOM (CycloneDX) y cumplimiento de estándares SLSA v1.0.
  - Gestionar secretos de forma robusta evitando fugas en variables de entorno o código fuente.
- **Frustraciones**:
  - Falta de guías concisas sobre cómo estructurar pipelines seguros y cómo remediar vulnerabilidades en Dockerfiles y clústeres.
  - Contenido de seguridad en CI/CD disperso o con dependencias propietarias.
- **Cómo AppSec Academy le aporta valor**:
  - Módulos específicos de DevSecOps, Supply Chain Security y Container Security con ejemplos reales de pipelines y análisis de políticas como código.

---

### 2.5. Andrés — Ingeniero de QA y Automatización de Pruebas
- **Perfil**: 29 años, 5 años de experiencia diseñando suites de pruebas funcionales, E2E (Playwright, Cypress) y pruebas de API.
- **Contexto de Uso**: Entorno de desarrollo de pruebas automatizadas y laptop de 1080p.
- **Objetivos**:
  - Expandir sus habilidades de QA funcional hacia pruebas de seguridad y análisis dinámico (DAST guiado, fuzzing y pruebas de abuso de lógica de negocio).
  - Incluir assertions de seguridad en sus suites de integración continua.
- **Frustraciones**:
  - Desconocimiento de cómo los atacantes abusan de los endpoints de API (IDOR, parameter tampering) más allá de los códigos de respuesta HTTP 200/400.
- **Cómo AppSec Academy le aporta valor**:
  - Casos prácticos de pruebas de seguridad y retos que le permiten ejercitar la mentalidad de abusabilidad (*adversarial testing*).

---

### 2.6. Valentina — Desarrolladora Junior & Aspirante a Especialista AppSec
- **Perfil**: 23 años, recién graduada de Ingeniería de Sistemas con 1 año de experiencia profesional.
- **Contexto de Uso**: Dispositivos móviles frecuentes (celular en transporte público) y laptop personal económica.
- **Objetivos**:
  - Construir una base sólida y estructurada en ciberseguridad aplicada al desarrollo para orientar su carrera profesional hacia la especialidad de Application Security.
  - Obtener insignias y evidencias verificables que demuestren sus conocimientos técnicos prácticos a reclutadores.
- **Frustraciones**:
  - La mayoría de las certificaciones de ciberseguridad son extremadamente caras (\$1,000+ USD) y están orientadas a redes e infraestructura tradicional, no a código de aplicaciones.
  - La barrera del idioma inglés técnico en conceptos matemáticos o criptográficos complejos.
- **Cómo AppSec Academy le aporta valor**:
  - Una ruta de aprendizaje pedagógica, modular, gratuita y 100% en español con progreso demostrable y rigor técnico.

---

## 3. Matriz de Priorización de Funcionalidades por Persona

| Capacidad / Funcionalidad | Carlos (Backend) | Sofía (Frontend) | Javier (Arquitecto) | Laura (DevSecOps) | Andrés (QA) | Valentina (Junior) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Security Learning Dashboard** | Media | Media | Alta | Media | Media | **Muy Alta** |
| **Curriculum Explorer (Filtros)** | Alta | Alta | Media | Alta | Alta | **Muy Alta** |
| **Lesson Workspace (9 Secciones)** | **Muy Alta** | **Muy Alta** | Alta | Alta | Alta | **Muy Alta** |
| **AppSec Playground (Sandbox)** | **Muy Alta** | **Muy Alta** | Media | Alta | **Muy Alta** | **Muy Alta** |
| **Threat Modeling Studio** | Media | Baja | **Muy Alta** | Media | Media | Alta |
| **Security Architecture Visualizer**| Alta | Media | **Muy Alta** | Alta | Media | Alta |
| **Security Challenges** | Alta | Alta | Media | **Muy Alta** | Alta | Alta |
| **Knowledge Graph** | Media | Media | **Muy Alta** | Media | Media | Alta |
| **Achievement System** | Baja | Baja | Baja | Media | Media | **Muy Alta** |
