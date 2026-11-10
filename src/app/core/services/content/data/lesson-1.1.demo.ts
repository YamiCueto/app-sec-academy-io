import { LessonDetail } from '../../../../models/content.model';

export const DEMO_LESSON_1_1: LessonDetail = {
  id: '1.1',
  moduleId: 'm01',
  title: 'Anatomía de Debilidades y Metodología OWASP (Material de Demostración)',
  order: 1,
  estimatedMinutes: 30,
  difficulty: 'basico',
  standards: {
    owasp: ['A01:2021 - Broken Access Control', 'Top 10:2021'],
    cwe: ['CWE-284', 'CWE-285'],
    asvs: ['V5.1.1', 'V5.1.2']
  },
  sections: {
    introduction:
      'El control de acceso defectuoso (Broken Access Control) lidera la clasificación OWASP Top 10 debido a su alta prevalencia e impacto crítico en sistemas empresariales. Esta lección analiza los principios arquitectónicos que rigen la autorización efectiva y cómo las fallas de mediación exponen datos y funciones a usuarios no autorizados.',
    objectives: [
      'Identificar la diferencia estructural entre autenticación (identidad) y autorización (permisos).',
      'Examinar vectores de acceso inseguro directo a objetos (BOLA / IDOR) en APIs REST.',
      'Aplicar el principio de denegación por defecto (Deny by Default) en capas de servicio.'
    ],
    conceptualExplanation: {
      markdown:
        'La autorización formal requiere que cada solicitud entrante pase por un punto de decisión de políticas (PDP) y un punto de aplicación de políticas (PEP). Cuando una aplicación confía en parámetros provistos por el cliente sin validar si la sesión autenticada tiene privilegios explícitos sobre el registro solicitado, se genera una vulnerabilidad de Broken Access Control.',
      keyPoints: [
        'Autenticación verifica quién eres; autorización determina qué puedes hacer.',
        'La validación de permisos debe ejecutarse obligatoriamente en el servidor.',
        'Los identificadores secuenciales directos facilitan la enumeración no autorizada.',
        'Todo endpoint privado debe aplicar una política estricta de Deny by Default.'
      ]
    },
    technicalExamples: [
      {
        language: 'typescript',
        title: 'Verificación de Autorización en Endpoint de Perfil de Usuario',
        vulnerableFilename: 'user.controller.vulnerable.ts',
        vulnerableSnippet: `export async function getUserProfile(req: Request, res: Response) {
  const targetUserId = req.params.userId;
  const userRecord = await db.users.findById(targetUserId);
  if (!userRecord) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  return res.json(userRecord);
}`,
        vulnerableExplanation:
          'El controlador confía en req.params.userId sin contrastarlo con req.user.id de la sesión. Un atacante autenticado puede cambiar el parámetro y obtener registros de cualquier otra cuenta.',
        remediatedFilename: 'user.controller.remediated.ts',
        remediatedSnippet: `export async function getUserProfile(req: Request, res: Response) {
  const sessionUser = req.user;
  const targetUserId = req.params.userId;
  if (sessionUser.id !== targetUserId && !sessionUser.roles.includes('admin')) {
    return res.status(403).json({ error: 'Acceso denegado al recurso solicitado' });
  }
  const userRecord = await db.users.findById(targetUserId);
  if (!userRecord) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  return res.json(userRecord);
}`,
        remediatedExplanation:
          'Se evalúa una condición de guarda que exige coincidencia de identidad o privilegios administrativos antes de interactuar con la base de datos.'
      }
    ],
    realScenarios: [
      {
        incidentTitle: 'Omisión de Control de Acceso en API de Servicios Financieros',
        cveReference: 'Boletín de Seguridad Simulado (Demostración)',
        summary:
          'Una plataforma financiera expuso estados de cuenta de clientes al permitir que la URL /api/v1/statements/:accountNumber fuera consultada sin validar la titularidad de la cuenta.',
        mitigationAnalysis:
          'Se implementó autorización context-aware y pruebas de regresión automatizadas que simulan intentos de acceso cruzado entre usuarios no privilegiados.'
      }
    ],
    lab: {
      labId: 'lab-bac-01',
      title: 'Laboratorio BAC-01: Remediación de Control de Acceso',
      missionPrompt:
        'Inspeccionar el código fuente provisto y reescribir la lógica de validación para garantizar que ninguna consulta sin privilegios legítimos pueda devolver datos sensibles.',
      hints: [
        'Verifica que el identificador del solicitante coincida con el identificador del objeto consultado.',
        'Asegúrate de retornar código HTTP 403 Forbidden ante cualquier discrepancia de tenencia.',
        'Aplica la directriz OWASP ASVS V5.1 sobre denegación por defecto.'
      ]
    },
    knowledgeCheck: {
      questions: [
        {
          id: 'q1',
          prompt: '¿Cuál es la causa raíz de una debilidad de Broken Access Control?',
          options: [
            {
              id: 'q1_a',
              text: 'Omitir la verificación de si el usuario autenticado tiene permisos específicos sobre el recurso solicitado.',
              isCorrect: true,
              feedback:
                'Correcto. Conforme a OWASP A01 y CWE-284, la debilidad radica en la ausencia de validación de autorización en el servidor.'
            },
            {
              id: 'q1_b',
              text: 'Utilizar contraseñas con longitud menor a 8 caracteres.',
              isCorrect: false,
              feedback:
                'Incorrecto. La longitud de contraseñas atañe a la robustez de autenticación (CWE-521), no al control de acceso a recursos.'
            },
            {
              id: 'q1_c',
              text: 'No cifrar el canal de comunicación con TLS.',
              isCorrect: false,
              feedback:
                'Incorrecto. La ausencia de TLS corresponde a fallas criptográficas en tránsito (OWASP A02), no a autorización.'
            }
          ]
        },
        {
          id: 'q2',
          prompt: '¿Por qué ocultar botones en el frontend no constituye una medida de seguridad efectiva?',
          options: [
            {
              id: 'q2_a',
              text: 'Porque el cliente puede forzar las peticiones HTTP directamente a la API saltándose la interfaz visual.',
              isCorrect: true,
              feedback:
                'Correcto. Las defensas exclusivas de cliente no tienen valor de seguridad; el servidor debe validar cada petición.'
            },
            {
              id: 'q2_b',
              text: 'Porque incrementa innecesariamente el tamaño del bundle de JavaScript.',
              isCorrect: false,
              feedback:
                'Incorrecto. Aunque el rendimiento es relevante, la razón de seguridad es que el cliente está bajo el control del usuario.'
            },
            {
              id: 'q2_c',
              text: 'Porque los navegadores móviles no admiten directivas de visibilidad condicional.',
              isCorrect: false,
              feedback:
                'Incorrecto. Los navegadores móviles sí admiten CSS condicional, pero ello no ofrece ninguna barrera defensiva.'
            }
          ]
        },
        {
          id: 'q3',
          prompt: 'Según el principio de Deny by Default, ¿cómo debe actuar un servicio ante una solicitud sin regla explícita?',
          options: [
            {
              id: 'q3_a',
              text: 'Denegar el acceso inmediatamente con código de error apropiado (ej. 403 Forbidden).',
              isCorrect: true,
              feedback:
                'Correcto. Ante la ausencia de un permiso explícito y verificable, la solicitud debe ser rechazada.'
            },
            {
              id: 'q3_b',
              text: 'Permitir el acceso solo en modo lectura para no afectar la experiencia de usuario.',
              isCorrect: false,
              feedback:
                'Incorrecto. Permitir lectura sin permiso viola el principio de menor privilegio y la confidencialidad.'
            },
            {
              id: 'q3_c',
              text: 'Redirigir al usuario a la página principal sin registrar ninguna auditoría.',
              isCorrect: false,
              feedback:
                'Incorrecto. Omitir el registro y permitir la navegación silenciosa impide detectar intentos de intrusión.'
            }
          ]
        }
      ]
    },
    summary: {
      goldenRules: [
        'Asegurar la mediación completa en el servidor: cada petición debe ser autorizada.',
        'Adoptar el principio de Deny by Default en todas las rutas y controladores.',
        'Emplear identificadores indirectos o aleatorios (UUIDv4) para evitar enumeraciones.',
        'Auditar y registrar los accesos denegados para detección proactiva de anomalías.'
      ],
      antipatterns: [
        'Confiar en parámetros editables por el cliente para decidir privilegios.',
        'Validar roles únicamente en la interfaz de usuario.',
        'Asumir que un usuario autenticado puede acceder a todos los recursos del sistema.'
      ]
    },
    references: [
      {
        title: 'OWASP Top 10:2021 — A01: Broken Access Control',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
      },
      {
        title: 'CWE-284: Improper Access Control',
        organization: 'MITRE Corporation',
        url: 'https://cwe.mitre.org/data/definitions/284.html'
      },
      {
        title: 'OWASP Application Security Verification Standard (ASVS) v4.0.3 — V5 Access Control',
        organization: 'OWASP Foundation',
        versionDate: '2021-10',
        url: 'https://owasp.org/www-project-application-security-verification-standard/'
      }
    ]
  }
};
