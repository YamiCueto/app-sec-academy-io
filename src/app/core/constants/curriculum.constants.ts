import { DifficultyLevel } from '../../models/content.model';

export type CurriculumBlockId = 'fundacional' | 'intermedio' | 'avanzado';

export type LabRequirementPolicy = 'none' | 'optional' | 'mandatory';

export interface LessonLabRequirement {
  readonly lessonId: string;
  readonly labId: string | null;
  readonly requirement: LabRequirementPolicy;
  readonly isExecutable: boolean;
  readonly title?: string;
}

export const LESSON_LAB_POLICIES: Readonly<Record<string, LessonLabRequirement>> = {
  '1.1': {
    lessonId: '1.1',
    labId: 'demo-owasp-taxonomy',
    requirement: 'none',
    isExecutable: false,
    title: 'Demostración Guiada de Taxonomía OWASP'
  },
  '1.2': {
    lessonId: '1.2',
    labId: 'LAB-BAC-01',
    requirement: 'mandatory',
    isExecutable: true,
    title: 'Control de Acceso y Remediación IDOR en API'
  },
  '1.3': {
    lessonId: '1.3',
    labId: 'demo-crypto-headers-audit',
    requirement: 'none',
    isExecutable: false,
    title: 'Simulación Guiada de Criptografía y Cabeceras'
  },
  '1.4': {
    lessonId: '1.4',
    labId: 'demo-asvs-checklist',
    requirement: 'none',
    isExecutable: false,
    title: 'Auditoría Conceptual ASVS v4.0.3'
  }
};

export function getLessonLabRequirement(lessonId: string): LessonLabRequirement {
  const cleanId = lessonId.trim().split('-')[0];
  return (
    LESSON_LAB_POLICIES[cleanId] ?? {
      lessonId: cleanId,
      labId: null,
      requirement: 'none',
      isExecutable: false
    }
  );
}

export function isLabMandatoryForLesson(lessonId: string): boolean {
  const policy = getLessonLabRequirement(lessonId);
  return policy.requirement === 'mandatory' && policy.isExecutable;
}

export interface CurriculumBlockMeta {
  readonly id: CurriculumBlockId;
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly moduleIds: readonly string[];
}

export interface CurriculumStandard {
  readonly name: string;
  readonly version: string;
  readonly specUrl: string;
}

export interface ModuleLessonMeta {
  readonly id: string;
  readonly title: string;
  readonly order: number;
  readonly estimatedMinutes: number;
  readonly difficulty: DifficultyLevel;
  readonly isAvailable: boolean;
}

export interface ModuleMeta {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly block: CurriculumBlockId;
  readonly blockTitle: string;
  readonly difficulty: DifficultyLevel;
  readonly estimatedMinutes: number;
  readonly isAvailable: boolean;
  readonly lessonIds: readonly string[];
  readonly bloomObjectives: readonly string[];
  readonly standards: readonly CurriculumStandard[];
  readonly lessons: readonly ModuleLessonMeta[];
}

export const CURRICULUM_BLOCKS: readonly CurriculumBlockMeta[] = [
  {
    id: 'fundacional',
    code: 'BLOQUE-01',
    title: 'Nivel Fundacional (Bloque 1)',
    description: 'Bases de seguridad de software, taxonomías de fallos, codificación defensiva y criptografía esencial.',
    moduleIds: ['m01', 'm02', 'm04', 'm10']
  },
  {
    id: 'intermedio',
    code: 'BLOQUE-02',
    title: 'Nivel Intermedio (Bloque 2)',
    description: 'Seguridad en interfaces de programación, gestión de identidades, modelado de amenazas y auditoría automatizada.',
    moduleIds: ['m03', 'm08', 'm09', 'm13']
  },
  {
    id: 'avanzado',
    code: 'BLOQUE-03',
    title: 'Nivel Avanzado (Bloque 3)',
    description: 'Seguridad en infraestructura cloud y contenedores, pipelines DevSecOps y gobernanza en Inteligencia Artificial.',
    moduleIds: ['m05', 'm06', 'm07', 'm11', 'm12', 'm14']
  }
];

export const CURRICULUM_MODULES: readonly ModuleMeta[] = [
  {
    id: 'm01',
    code: 'M01',
    title: 'Fundamentos OWASP Top 10',
    description: 'Taxonomía de vulnerabilidades críticas en aplicaciones web, metodología de análisis OWASP Top 10 y niveles de verificación ASVS.',
    block: 'fundacional',
    blockTitle: 'Nivel Fundacional (Bloque 1)',
    difficulty: 'basico',
    estimatedMinutes: 130,
    isAvailable: true,
    lessonIds: ['1.1', '1.2', '1.3', '1.4'],
    bloomObjectives: [
      'Recordar las 10 categorías de mayor riesgo técnico del OWASP Top 10:2021.',
      'Comprender la diferencia crítica entre fallos de autenticación y de autorización.',
      'Aplicar controles de acceso de mediación completa en endpoints de API REST.',
      'Analizar arquitecturas de software aplicando las tres capas de verificación ASVS v4.0.3.'
    ],
    standards: [
      { name: 'OWASP Top 10', version: '2021', specUrl: 'https://owasp.org/Top10/' },
      { name: 'OWASP ASVS', version: 'v4.0.3', specUrl: 'https://owasp.org/www-project-application-security-verification-standard/' },
      { name: 'OWASP SAMM', version: 'v2.0.1', specUrl: 'https://owaspsamm.org/' }
    ],
    lessons: [
      { id: '1.1', title: 'Anatomía de las Debilidades de Software y la Metodología OWASP', order: 1, estimatedMinutes: 25, difficulty: 'basico', isAvailable: true },
      { id: '1.2', title: 'Broken Access Control (A01:2021) — El vector #1 de compromiso', order: 2, estimatedMinutes: 40, difficulty: 'basico', isAvailable: true },
      { id: '1.3', title: 'Fallos Criptográficos y de Configuración (A02 & A05:2021)', order: 3, estimatedMinutes: 35, difficulty: 'basico', isAvailable: true },
      { id: '1.4', title: 'Marco de Verificación OWASP ASVS y Niveles 1, 2 y 3', order: 4, estimatedMinutes: 30, difficulty: 'basico', isAvailable: true }
    ]
  },
  {
    id: 'm02',
    code: 'M02',
    title: 'Secure Coding & Defensas',
    description: 'Patrones de diseño defensivo, validación rigurosa de entradas, consultas parametrizadas y prevención de fugas de memoria.',
    block: 'fundacional',
    blockTitle: 'Nivel Fundacional (Bloque 1)',
    difficulty: 'intermedio',
    estimatedMinutes: 155,
    isAvailable: false,
    lessonIds: ['2.1', '2.2', '2.3', '2.4'],
    bloomObjectives: [
      'Recordar las directrices de codificación segura del estándar SEI CERT y MITRE CWE Top 25.',
      'Comprender la mecánica de propagación de flujos de datos no confiables hacia sumideros de ejecución.',
      'Aplicar codificación contextual y sentencias preparadas para neutralizar XSS y SQLi.',
      'Analizar fugas de información en trazas de error y excepciones no controladas.'
    ],
    standards: [
      { name: 'MITRE CWE Top 25', version: '2024', specUrl: 'https://cwe.mitre.org/top25/' },
      { name: 'SEI CERT Coding Standards', version: 'Java/C++', specUrl: 'https://wiki.sei.cmu.edu/confluence/display/seccode' }
    ],
    lessons: [
      { id: '2.1', title: 'Validación de Entrada y Codificación de Salida Contextual', order: 1, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '2.2', title: 'Consultas Parametrizadas y Prevención de Inyecciones', order: 2, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '2.3', title: 'Manejo Seguro de Memoria, Tipado y Prevención de Desbordamientos', order: 3, estimatedMinutes: 35, difficulty: 'intermedio', isAvailable: false },
      { id: '2.4', title: 'Manejo Seguro de Errores y Prevención de Fugas de Información', order: 4, estimatedMinutes: 30, difficulty: 'intermedio', isAvailable: false }
    ]
  },
  {
    id: 'm03',
    code: 'M03',
    title: 'API Security & REST Hardening',
    description: 'Protección de interfaces REST/GraphQL contra fallos BOLA, elevación de privilegios funcionales y consumo abusivo.',
    block: 'intermedio',
    blockTitle: 'Nivel Intermedio (Bloque 2)',
    difficulty: 'intermedio',
    estimatedMinutes: 165,
    isAvailable: false,
    lessonIds: ['3.1', '3.2', '3.3', '3.4'],
    bloomObjectives: [
      'Recordar las 10 amenazas principales del OWASP API Security Top 10:2023.',
      'Comprender el impacto de la asignación masiva de parámetros en modelos de dominio.',
      'Aplicar algoritmos de limitación de tasa (Token Bucket) y filtrado estricto de DTOs.',
      'Analizar peticiones que originan Server-Side Request Forgery en integraciones con terceros.'
    ],
    standards: [
      { name: 'OWASP API Security Top 10', version: '2023', specUrl: 'https://owasp.org/www-project-api-security/' },
      { name: 'RFC 6749 (OAuth 2.0)', version: 'IETF', specUrl: 'https://datatracker.ietf.org/doc/html/rfc6749' }
    ],
    lessons: [
      { id: '3.1', title: 'Broken Object Level Authorization (API1:2023 BOLA / IDOR)', order: 1, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '3.2', title: 'Broken Function Level Authorization (BFLA) y Asignación Masiva', order: 2, estimatedMinutes: 40, difficulty: 'intermedio', isAvailable: false },
      { id: '3.3', title: 'Rate Limiting, Throttling y Prevención de Abuso de Recursos', order: 3, estimatedMinutes: 35, difficulty: 'intermedio', isAvailable: false },
      { id: '3.4', title: 'Server-Side Request Forgery (SSRF) en APIs Modernas', order: 4, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false }
    ]
  },
  {
    id: 'm04',
    code: 'M04',
    title: 'Vulnerability Management & CVSS',
    description: 'Taxonomía formal CVE/CWE, evaluación cuantitativa de severidad con CVSS v4.0 y priorización guiada por EPSS y KEV.',
    block: 'fundacional',
    blockTitle: 'Nivel Fundacional (Bloque 1)',
    difficulty: 'basico',
    estimatedMinutes: 105,
    isAvailable: false,
    lessonIds: ['4.1', '4.2', '4.3'],
    bloomObjectives: [
      'Recordar la relación entre identificadores CVE, debilidades CWE y plataformas CPE.',
      'Comprender la diferencia de cálculo de impacto entre CVSS v3.1 y CVSS v4.0.',
      'Aplicar la matriz de priorización cruzando CVSS con EPSS y el catálogo CISA KEV.',
      'Analizar acuerdos de nivel de servicio (SLA) para remediación de vulnerabilidades.'
    ],
    standards: [
      { name: 'FIRST CVSS', version: 'v4.0', specUrl: 'https://www.first.org/cvss/v4.0/specification-document' },
      { name: 'NIST NVD', version: 'CVD Spec', specUrl: 'https://nvd.nist.gov/' }
    ],
    lessons: [
      { id: '4.1', title: 'Taxonomía de Vulnerabilidades: CVE, CWE y CPE', order: 1, estimatedMinutes: 30, difficulty: 'basico', isAvailable: false },
      { id: '4.2', title: 'Cálculo y Evaluación de Métricas CVSS v3.1 vs CVSS v4.0', order: 2, estimatedMinutes: 40, difficulty: 'basico', isAvailable: false },
      { id: '4.3', title: 'Priorización Basada en Riesgo (EPSS y CISA KEV) y SLAs de Remediación', order: 3, estimatedMinutes: 35, difficulty: 'basico', isAvailable: false }
    ]
  },
  {
    id: 'm05',
    code: 'M05',
    title: 'Software Supply Chain Security',
    description: 'Auditoría de dependencias de terceros, inventario automatizado con SBOM (CycloneDX) y atestados de procedencia SLSA.',
    block: 'avanzado',
    blockTitle: 'Nivel Avanzado (Bloque 3)',
    difficulty: 'avanzado',
    estimatedMinutes: 125,
    isAvailable: false,
    lessonIds: ['5.1', '5.2', '5.3'],
    bloomObjectives: [
      'Recordar los vectores de ataque en la cadena de suministro (Typosquatting, Dependency Confusion).',
      'Comprender la estructura jerárquica de metadatos en un Software Bill of Materials.',
      'Aplicar validaciones de firmas de artefactos con Sigstore Cosign.',
      'Analizar los cuatro niveles de madurez del marco OpenSSF SLSA v1.0.'
    ],
    standards: [
      { name: 'OpenSSF SLSA', version: 'v1.0', specUrl: 'https://slsa.dev/' },
      { name: 'OWASP CycloneDX', version: 'v1.5', specUrl: 'https://cyclonedx.org/' }
    ],
    lessons: [
      { id: '5.1', title: 'Amenazas a la Cadena de Suministro: Dependency Confusion y Typosquatting', order: 1, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false },
      { id: '5.2', title: 'Software Bill of Materials (SBOM): Generación, Análisis y Validación', order: 2, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false },
      { id: '5.3', title: 'Marco SLSA y Firma Criptográfica de Procedencia', order: 3, estimatedMinutes: 45, difficulty: 'avanzado', isAvailable: false }
    ]
  },
  {
    id: 'm06',
    code: 'M06',
    title: 'Cloud Security & IAM',
    description: 'Modelo de responsabilidad compartida, principio de menor privilegio en políticas IAM y blindaje de servicios de metadatos.',
    block: 'avanzado',
    blockTitle: 'Nivel Avanzado (Bloque 3)',
    difficulty: 'avanzado',
    estimatedMinutes: 115,
    isAvailable: false,
    lessonIds: ['6.1', '6.2', '6.3'],
    bloomObjectives: [
      'Recordar los límites de responsabilidad en entornos IaaS, PaaS y Serverless.',
      'Comprender el riesgo de políticas IAM con comodines excesivos (*).',
      'Aplicar restricción de acceso al endpoint de metadatos mediante IMDSv2.',
      'Analizar patrones de federación de identidades y asunción temporal de roles.'
    ],
    standards: [
      { name: 'CIS Cloud Benchmarks', version: '2024', specUrl: 'https://www.cisecurity.org/benchmark' },
      { name: 'NIST SP 800-145', version: 'Cloud Computing', specUrl: 'https://csrc.nist.gov/publications/detail/sp/800-145/final' }
    ],
    lessons: [
      { id: '6.1', title: 'Modelo de Responsabilidad Compartida en Arquitecturas Cloud-Native', order: 1, estimatedMinutes: 30, difficulty: 'avanzado', isAvailable: false },
      { id: '6.2', title: 'Principio de Menor Privilegio en IAM y Políticas Basadas en Roles', order: 2, estimatedMinutes: 45, difficulty: 'avanzado', isAvailable: false },
      { id: '6.3', title: 'Gestión Segura de Secretos y Blindaje del Servicio de Metadatos (IMDSv2)', order: 3, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false }
    ]
  },
  {
    id: 'm07',
    code: 'M07',
    title: 'Container & Kubernetes Security',
    description: 'Hardening de Dockerfiles, reducción de superficie de ataque, escaneo de capas OCI y admisión Pod Security en Kubernetes.',
    block: 'avanzado',
    blockTitle: 'Nivel Avanzado (Bloque 3)',
    difficulty: 'avanzado',
    estimatedMinutes: 115,
    isAvailable: false,
    lessonIds: ['7.1', '7.2', '7.3'],
    bloomObjectives: [
      'Recordar los principios de construcción de imágenes seguras (usuarios no-root, distroless).',
      'Comprender los mecanismos de aislamiento de namespaces y cgroups en Linux.',
      'Aplicar perfiles restrictivos de Pod Security Standards en clústeres Kubernetes.',
      'Analizar reportes de vulnerabilidades en capas de imágenes de contenedores.'
    ],
    standards: [
      { name: 'CIS Docker Benchmark', version: 'v1.6.0', specUrl: 'https://www.cisecurity.org/benchmark/docker' },
      { name: 'Kubernetes PSS', version: 'v1.28+', specUrl: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/' }
    ],
    lessons: [
      { id: '7.1', title: 'Hardening de Dockerfiles y Reducción de Superficie de Ataque', order: 1, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false },
      { id: '7.2', title: 'Escaneo Estático de Imágenes OCI y Detección de Vulnerabilidades', order: 2, estimatedMinutes: 35, difficulty: 'avanzado', isAvailable: false },
      { id: '7.3', title: 'Seguridad en Runtime de Contenedores y Pod Security Admission', order: 3, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false }
    ]
  },
  {
    id: 'm08',
    code: 'M08',
    title: 'Identity, OAuth 2.1 & Session Management',
    description: 'Protocolos de autorización moderna con PKCE, blindaje de JSON Web Tokens, cookies SameSite y autenticación con Passkeys.',
    block: 'intermedio',
    blockTitle: 'Nivel Intermedio (Bloque 2)',
    difficulty: 'intermedio',
    estimatedMinutes: 165,
    isAvailable: false,
    lessonIds: ['8.1', '8.2', '8.3', '8.4'],
    bloomObjectives: [
      'Recordar las especificaciones del borrador OAuth 2.1 y la obligatoriedad de PKCE.',
      'Comprender las vulnerabilidades críticas en validación de tokens JWT (alg: none, clave pública confundida).',
      'Aplicar directivas SameSite, HttpOnly y Secure en almacenamiento de sesiones.',
      'Analizar flujos de autenticación WebAuthn y credenciales FIDO2 sin contraseñas.'
    ],
    standards: [
      { name: 'OAuth 2.1 Draft', version: 'IETF', specUrl: 'https://oauth.net/2.1/' },
      { name: 'RFC 7519 (JWT)', version: 'IETF', specUrl: 'https://datatracker.ietf.org/doc/html/rfc7519' },
      { name: 'NIST SP 800-63B', version: 'Digital Identity', specUrl: 'https://pages.nist.gov/800-63-3/sp800-63b.html' }
    ],
    lessons: [
      { id: '8.1', title: 'OAuth 2.1, Proof Key for Code Exchange (PKCE) y Autenticación Moderna', order: 1, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '8.2', title: 'Seguridad Robusta en Tokens JWT: Firmas, Ataques alg: none y JWKS', order: 2, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '8.3', title: 'Gestión Segura de Sesiones, Cookies y Prevención de CSRF', order: 3, estimatedMinutes: 40, difficulty: 'intermedio', isAvailable: false },
      { id: '8.4', title: 'Autenticación Multifactor (MFA) y Passkeys (WebAuthn / FIDO2)', order: 4, estimatedMinutes: 35, difficulty: 'intermedio', isAvailable: false }
    ]
  },
  {
    id: 'm09',
    code: 'M09',
    title: 'Threat Modeling & STRIDE',
    description: 'Metodología STRIDE, delimitación de límites de confianza, diagramas de flujo de datos y marcos de modelado de amenazas centrados en el riesgo.',
    block: 'intermedio',
    blockTitle: 'Nivel Intermedio (Bloque 2)',
    difficulty: 'intermedio',
    estimatedMinutes: 165,
    isAvailable: false,
    lessonIds: ['9.1', '9.2', '9.3', '9.4'],
    bloomObjectives: [
      'Recordar las 6 categorías del modelo STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).',
      'Comprender la delimitación de límites de confianza (Trust Boundaries) en sistemas distribuidos.',
      'Aplicar la matriz de amenazas STRIDE sobre casos de arquitectura de microservicios.',
      'Analizar árboles de ataque y priorizar mitigaciones mediante la metodología PASTA.'
    ],
    standards: [
      { name: 'Microsoft STRIDE', version: 'Threat Modeling', specUrl: 'https://learn.microsoft.com/en-us/security/engineering/stride-model' },
      { name: 'OWASP Threat Dragon', version: 'Spec', specUrl: 'https://owasp.org/www-project-threat-dragon/' }
    ],
    lessons: [
      { id: '9.1', title: 'Fundamentos de Threat Modeling: Identificación de Activos y Vectores', order: 1, estimatedMinutes: 35, difficulty: 'intermedio', isAvailable: false },
      { id: '9.2', title: 'Diagramas de Flujo de Datos (DFD) y Delimitación de Trust Boundaries', order: 2, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '9.3', title: 'Aplicación de la Metodología STRIDE a Componentes de Software', order: 3, estimatedMinutes: 45, difficulty: 'intermedio', isAvailable: false },
      { id: '9.4', title: 'Árboles de Ataque y Modelado Centrado en el Riesgo (PASTA)', order: 4, estimatedMinutes: 40, difficulty: 'intermedio', isAvailable: false }
    ]
  },
  {
    id: 'm10',
    code: 'M10',
    title: 'Applied Cryptography',
    description: 'Criptografía moderna aplicada, cifrado autenticado AES-GCM, algoritmos de hash de contraseñas (Argon2id) y transporte seguro TLS 1.3.',
    block: 'fundacional',
    blockTitle: 'Nivel Fundacional (Bloque 1)',
    difficulty: 'intermedio',
    estimatedMinutes: 150,
    isAvailable: false,
    lessonIds: ['10.1', '10.2', '10.3', '10.4'],
    bloomObjectives: [
      'Recordar los principios de confidencialidad, integridad, autenticación y no repudio.',
      'Comprender la diferencia matemática y de costo entre funciones hash tradicionales y KDFs con memoria dura.',
      'Aplicar cifrado simétrico autenticado (AES-256-GCM) y almacenamiento de contraseñas con Argon2id.',
      'Analizar los parámetros de seguridad en negociaciones TLS 1.3 y Certificate Pinning.'
    ],
    standards: [
      { name: 'RFC 9106 (Argon2)', version: 'IETF', specUrl: 'https://datatracker.ietf.org/doc/html/rfc9106' },
      { name: 'RFC 8446 (TLS 1.3)', version: 'IETF', specUrl: 'https://datatracker.ietf.org/doc/html/rfc8446' },
      { name: 'NIST SP 800-175B', version: 'Guideline', specUrl: 'https://csrc.nist.gov/publications/detail/sp/800-175b/rev-1/final' }
    ],
    lessons: [
      { id: '10.1', title: 'Algoritmos Criptográficos Modernos: Simétricos vs Asimétricos', order: 1, estimatedMinutes: 40, difficulty: 'intermedio', isAvailable: false },
      { id: '10.2', title: 'Almacenamiento Seguro de Contraseñas: Argon2id, Bcrypt y Salt', order: 2, estimatedMinutes: 40, difficulty: 'intermedio', isAvailable: false },
      { id: '10.3', title: 'Seguridad en Comunicaciones: Protocolo TLS 1.3 y Certificate Pinning', order: 3, estimatedMinutes: 35, difficulty: 'intermedio', isAvailable: false },
      { id: '10.4', title: 'Ciclo de Vida y Gestión Segura de Claves Criptográficas (KMS / HSM)', order: 4, estimatedMinutes: 35, difficulty: 'intermedio', isAvailable: false }
    ]
  },
  {
    id: 'm11',
    code: 'M11',
    title: 'DevSecOps & Policy as Code',
    description: 'Cultura Shift-Left, automatización de políticas de seguridad con Open Policy Agent (OPA/Rego) y umbrales de despliegue.',
    block: 'avanzado',
    blockTitle: 'Nivel Avanzado (Bloque 3)',
    difficulty: 'avanzado',
    estimatedMinutes: 110,
    isAvailable: false,
    lessonIds: ['11.1', '11.2', '11.3'],
    bloomObjectives: [
      'Recordar los pilares de la integración continua de controles de seguridad en el SDLC.',
      'Comprender la separación entre lógica de negocio y definición de políticas de cumplimiento.',
      'Aplicar reglas declarativas en lenguaje Rego para validar despliegues de infraestructura.',
      'Analizar métricas de velocidad y remediación en pipelines DevSecOps automatizados.'
    ],
    standards: [
      { name: 'NIST SP 800-204D', version: 'DevSecOps', specUrl: 'https://csrc.nist.gov/pubs/sp/800/204/d/final' },
      { name: 'DoD DevSecOps Reference Design', version: 'v2.1', specUrl: 'https://dodcio.defense.gov/' }
    ],
    lessons: [
      { id: '11.1', title: 'Principios DevSecOps: De la Seguridad Perimetral a la Continua', order: 1, estimatedMinutes: 30, difficulty: 'avanzado', isAvailable: false },
      { id: '11.2', title: 'Security as Code y Policy as Code (Open Policy Agent - OPA / Rego)', order: 2, estimatedMinutes: 45, difficulty: 'avanzado', isAvailable: false },
      { id: '11.3', title: 'Automatización de Quality Gates y Métricas de Desempeño DevSecOps', order: 3, estimatedMinutes: 35, difficulty: 'avanzado', isAvailable: false }
    ]
  },
  {
    id: 'm12',
    code: 'M12',
    title: 'CI/CD Pipeline Security',
    description: 'Prevención de inyección de comandos en flujos CI/CD, aislamiento de ejecutores (runners), autenticación OIDC y escaneo pre-commit.',
    block: 'avanzado',
    blockTitle: 'Nivel Avanzado (Bloque 3)',
    difficulty: 'avanzado',
    estimatedMinutes: 120,
    isAvailable: false,
    lessonIds: ['12.1', '12.2', '12.3'],
    bloomObjectives: [
      'Recordar las 10 debilidades del OWASP Top 10 CI/CD Security Risks:2024.',
      'Comprender el mecanismo de escape de contexto en expresiones de workflows de GitHub Actions.',
      'Aplicar autenticación OIDC sin llaves permanentes en runners de integración continua.',
      'Analizar políticas de protección de ramas y revisiones obligatorias de código.'
    ],
    standards: [
      { name: 'OWASP CI/CD Top 10', version: '2024', specUrl: 'https://owasp.org/www-project-top-10-ci-cd-security-risks/' },
      { name: 'CIS Supply Chain Security Benchmark', version: 'v1.0', specUrl: 'https://www.cisecurity.org/benchmark' }
    ],
    lessons: [
      { id: '12.1', title: 'Riesgos de Seguridad en CI/CD: Inyección de Comandos y Fuga de Secretos', order: 1, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false },
      { id: '12.2', title: 'Aislamiento de Runners y Tokens Efímeros (OIDC en GitHub Actions)', order: 2, estimatedMinutes: 45, difficulty: 'avanzado', isAvailable: false },
      { id: '12.3', title: 'Blindaje de Flujos de Trabajo: Git Hooks y Protección de Ramas', order: 3, estimatedMinutes: 35, difficulty: 'avanzado', isAvailable: false }
    ]
  },
  {
    id: 'm13',
    code: 'M13',
    title: 'Application Security Testing (AST)',
    description: 'Análisis estático de código fuente (SAST), pruebas dinámicas (DAST), instrumentación interactiva (IAST) y fuzzing automatizado.',
    block: 'intermedio',
    blockTitle: 'Nivel Intermedio (Bloque 2)',
    difficulty: 'avanzado',
    estimatedMinutes: 155,
    isAvailable: false,
    lessonIds: ['13.1', '13.2', '13.3', '13.4'],
    bloomObjectives: [
      'Recordar el alcance y limitaciones de las metodologías de prueba de caja blanca, gris y negra.',
      'Comprender la tasa de falsos positivos en análisis sintácticos vs semánticos.',
      'Aplicar reglas Semgrep y pruebas de mutación de entradas en parsers de datos.',
      'Analizar trazas de ejecución en telemetría interactiva IAST.'
    ],
    standards: [
      { name: 'OWASP WSTG', version: 'v4.2', specUrl: 'https://owasp.org/www-project-web-security-testing-guide/' },
      { name: 'ISO/IEC 29119-3', version: 'Software Testing', specUrl: 'https://www.iso.org/standard/60078.html' }
    ],
    lessons: [
      { id: '13.1', title: 'Static Application Security Testing (SAST): Reglas, ASTs y Falsos Positivos', order: 1, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false },
      { id: '13.2', title: 'Dynamic Application Security Testing (DAST) e Interactive AST (IAST)', order: 2, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false },
      { id: '13.3', title: 'Fuzzing Automatizado de Software y Pruebas de Resiliencia', order: 3, estimatedMinutes: 35, difficulty: 'avanzado', isAvailable: false },
      { id: '13.4', title: 'Triaje de Vulnerabilidades y Gestión Unificada de Hallazgos', order: 4, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false }
    ]
  },
  {
    id: 'm14',
    code: 'M14',
    title: 'AI & LLM Security',
    description: 'Vulnerabilidades en modelos generativos, mitigación de Prompt Injection, sanitización de salidas y aislamiento de agentes con herramientas.',
    block: 'avanzado',
    blockTitle: 'Nivel Avanzado (Bloque 3)',
    difficulty: 'avanzado',
    estimatedMinutes: 130,
    isAvailable: false,
    lessonIds: ['14.1', '14.2', '14.3'],
    bloomObjectives: [
      'Recordar los vectores de ataque descritos en el OWASP Top 10 for LLMs.',
      'Comprender la diferencia entre inyección directa e inyección indirecta a través de RAG.',
      'Aplicar filtros de contención y validación defensiva en salidas de agentes LLM.',
      'Analizar políticas de permisos mínimos en invocación de herramientas autónomas.'
    ],
    standards: [
      { name: 'OWASP Top 10 for LLMs', version: '2025/2023', specUrl: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
      { name: 'MITRE ATLAS', version: 'AI Threat Matrix', specUrl: 'https://atlas.mitre.org/' },
      { name: 'NIST AI RMF', version: '1.0', specUrl: 'https://www.nist.gov/itl/ai-risk-management-framework' }
    ],
    lessons: [
      { id: '14.1', title: 'Prompt Injection Directa e Indirecta (LLM01)', order: 1, estimatedMinutes: 45, difficulty: 'avanzado', isAvailable: false },
      { id: '14.2', title: 'Insecure Output Handling (LLM02) y Ataques XSS / SSRF vía LLMs', order: 2, estimatedMinutes: 45, difficulty: 'avanzado', isAvailable: false },
      { id: '14.3', title: 'Envenenamiento de Datos (Data Poisoning) y Exfiltración en RAG', order: 3, estimatedMinutes: 40, difficulty: 'avanzado', isAvailable: false }
    ]
  }
];

export const TOTAL_CURRICULUM_LESSONS = CURRICULUM_MODULES.reduce(
  (total, mod) => total + mod.lessonIds.length,
  0
);
