import { LessonDetail } from '../../../../models/content.model';

export const LESSON_1_1_DATA: LessonDetail = {
  id: '1.1',
  moduleId: 'm01',
  title: 'Anatomía de Debilidades y Metodología OWASP',
  order: 1,
  estimatedMinutes: 25,
  difficulty: 'basico',
  standards: {
    owasp: ['OWASP Top 10:2021', 'OWASP SAMM v2.0.1'],
    cwe: ['CWE-707', 'CWE-1008'],
    asvs: ['ASVS v4.0.3 V1']
  },
  sections: {
    introduction:
      'El desarrollo de software seguro requiere comprender cómo se originan las fallas en el ciclo de vida del código. Esta lección establece los fundamentos taxonómicos para diferenciar defectos de implementación (bugs) de debilidades arquitectónicas (flaws), analizando la metodología de evaluación de riesgos adoptada por OWASP Top 10 y el modelo de madurez SAMM.',
    objectives: [
      'Diferenciar con precisión técnica entre defecto de implementación (bug), debilidad arquitectónica (flaw) y vulnerabilidad explotable.',
      'Comprender la metodología empírica de categorización del OWASP Top 10:2021 basada en prevalencia e incidencia.',
      'Analizar los cinco dominios del marco de madurez de aseguramiento de software OWASP SAMM v2.0.1.',
      'Aplicar la taxonomía MITRE CWE para la clasificación normalizada de debilidades de seguridad.'
    ],
    conceptualExplanation: {
      markdown:
        'En ingeniería de seguridad, una debilidad (weakness, tipificada en CWE) es una propiedad en la arquitectura, diseño, código o despliegue que, bajo condiciones operativas específicas, puede ser explotada por un adversario para violar una política de seguridad, convirtiéndose en una vulnerabilidad. \n\nEs fundamental distinguir dos orígenes:\n1. Defecto de implementación (Bug): Error sintáctico o lógico en la codificación, como omitir la validación de un puntero o un escape de caracteres.\n2. Fallo de diseño (Flaw): Elección arquitectónica deficiente que no contempla amenazas relevantes, como confiar ciegamente en parámetros de red o carecer de un punto centralizado de autorización.\n\nLa metodología OWASP Top 10:2021 recopiló datos de más de 500,000 aplicaciones a nivel global, combinando incidencia de CWEs observados con encuestas de la comunidad de expertos para evaluar impacto de negocio y probabilidad.',
      keyPoints: [
        'Bug es un error en la implementación; Flaw es una debilidad en el diseño arquitectónico.',
        'CWE provee la taxonomía común; CVE registra vulnerabilidades concretas en productos desplegados.',
        'OWASP Top 10 agrupa debilidades por impacto y prevalencia, no es una lista exhaustiva de verificación.',
        'OWASP SAMM evalúa la madurez organizacional en 5 funciones: Gobernanza, Diseño, Implementación, Verificación y Operaciones.'
      ]
    },
    technicalExamples: [
      {
        language: 'typescript',
        title: 'Manejo Descentralizado vs Centralizado de Políticas de Validación',
        vulnerableFilename: 'ad-hoc-validation.bug.ts',
        vulnerableSnippet: `export function handleOrderCheckout(req: any) {
  if (req.body.price < 0) {
    throw new Error('Precio invalido');
  }
  return processOrder(req.body);
}`,
        vulnerableExplanation:
          'Validación ad-hoc dispersa en el controlador. Trata una regla de integridad de negocio como una comprobación aislada susceptible de omisión en otros endpoints del ciclo de vida de la orden.',
        remediatedFilename: 'centralized-policy.flaw-remediation.ts',
        remediatedSnippet: `export class OrderValidator {
  static validateCheckout(command: CheckoutCommand): ValidationResult {
    if (!command.hasValidTenantContext()) {
      return ValidationResult.denied('Violacion de frontera de aislamiento');
    }
    if (!command.amount.isPositive()) {
      return ValidationResult.denied('Monto invalido segun politica fiscal');
    }
    return ValidationResult.allowed();
  }
}`,
        remediatedExplanation:
          'Diseño arquitectónico con políticas centralizadas y objetos de valor inmutables, resolviendo la debilidad de diseño estructuralmente.'
      }
    ],
    realScenarios: [
      {
        incidentTitle: 'Confusión entre bugs superficiales y debilidad arquitectónica sistémica',
        cveReference: 'Auditoría Forense Ficticia (Demostración Pedagógica)',
        summary:
          'Durante una auditoría externa se descubrió que el equipo de desarrollo trataba todos los hallazgos de seguridad como simples bugs de validación de entrada, aplicando parches regex en controladores. Al omitir el modelado arquitectónico, una debilidad de diseño causó exposición de transacciones.',
        mitigationAnalysis:
          'Se implementó el marco OWASP SAMM v2.0.1, estableciendo prácticas de modelado de amenazas previo a la construcción de código y taxonomía CWE formal en el registro de deuda técnica.'
      }
    ],
    lab: {
      labId: 'demo-owasp-taxonomy',
      title: 'Explorador Taxonómico de Debilidades OWASP y CWE',
      missionPrompt:
        'Examinar la matriz de clasificación entre debilidades CWE y categorías OWASP Top 10:2021 para diferenciar fallos arquitectónicos de defectos de codificación.',
      hints: [
        'Recuerda que un flaw no se resuelve con un escape puntual de caracteres.',
        'Verifica qué categorías de OWASP 2021 surgieron a partir de fallos de diseño.',
        'Revisa la función de Diseño en OWASP SAMM.'
      ]
    },
    knowledgeCheck: {
      questions: [
        {
          id: 'q1-1-1',
          prompt:
            '¿Cuál es la diferencia técnica fundamental entre un "bug" de seguridad y un "flaw" arquitectónico?',
          options: [
            {
              id: 'opt-a',
              text: 'Un bug ocurre en la implementación del código; un flaw es una deficiencia intrínseca en el diseño o arquitectura del sistema.',
              isCorrect: true,
              feedback:
                'Correcto. Conforme a OWASP SAMM y MITRE CWE, los bugs radican en código y los flaws en la concepción arquitectónica.'
            },
            {
              id: 'opt-b',
              text: 'Un bug afecta solo lenguajes interpretados y un flaw afecta lenguajes compilados.',
              isCorrect: false,
              feedback:
                'Incorrecto. Tanto bugs como flaws pueden manifestarse con independencia del lenguaje o paradigma.'
            },
            {
              id: 'opt-c',
              text: 'Un flaw solo se produce en la base de datos y un bug en la interfaz de usuario.',
              isCorrect: false,
              feedback:
                'Incorrecto. Ambas categorías pueden ocurrir en cualquier capa de la arquitectura tecnológica.'
            }
          ]
        },
        {
          id: 'q1-1-2',
          prompt:
            '¿Cuál de los siguientes enunciados describe con mayor rigor la naturaleza del OWASP Top 10?',
          options: [
            {
              id: 'opt-a',
              text: 'Es un documento de concientización y priorización de riesgos críticos basado en datos de incidencia de la industria.',
              isCorrect: true,
              feedback:
                'Correcto. OWASP Top 10 no es un estándar de verificación exhaustivo, sino una guía de priorización de riesgos.'
            },
            {
              id: 'opt-b',
              text: 'Es una norma obligatoria de certificación con cobertura de todas las debilidades conocidas.',
              isCorrect: false,
              feedback:
                'Incorrecto. El estándar de verificación exhaustivo de OWASP es ASVS, no el Top 10.'
            },
            {
              id: 'opt-c',
              text: 'Es una especificación de reglas sintácticas para linters de frontend.',
              isCorrect: false,
              feedback:
                'Incorrecto. OWASP Top 10 abarca debilidades a nivel de arquitectura y backend.'
            }
          ]
        },
        {
          id: 'q1-1-3',
          prompt:
            '¿Qué función cumple la taxonomía MITRE CWE en el ciclo de vida de desarrollo seguro?',
          options: [
            {
              id: 'opt-a',
              text: 'Provee un catálogo y diccionario estructurado para identificar y catalogar debilidades de forma inequívoca.',
              isCorrect: true,
              feedback:
                'Correcto. CWE estandariza la clasificación y análisis de debilidades de hardware y software.'
            },
            {
              id: 'opt-b',
              text: 'Descarga automáticamente firmas de antivirus en servidores de producción.',
              isCorrect: false,
              feedback:
                'Incorrecto. MITRE CWE es una taxonomía y estándar de conocimiento, no un software antivirus.'
            },
            {
              id: 'opt-c',
              text: 'Calcula el tiempo de respuesta de los balanceadores de carga en la nube.',
              isCorrect: false,
              feedback:
                'Incorrecto. CWE no monitorea rendimiento de infraestructura.'
            }
          ]
        }
      ]
    },
    summary: {
      goldenRules: [
        'Clasificar cada hallazgo de seguridad en su categoría CWE correspondiente para tratar la causa raíz.',
        'Distinguir bugs de codificación de debilidades de diseño para asignar la solución correcta.',
        'Adoptar OWASP SAMM v2.0.1 para estructurar un programa de seguridad sostenible en la organización.',
        'Utilizar OWASP ASVS como guía de requisitos de seguridad verificables en fases de diseño.'
      ],
      antipatterns: [
        'Tratar vulnerabilidades estructurales como simples errores de tipeo o validación.',
        'Utilizar el OWASP Top 10 como si fuera una lista de verificación exhaustiva.',
        'Posponer la seguridad hasta la fase final de pruebas de penetración.'
      ]
    },
    references: [
      {
        title: 'OWASP Top 10:2021 — Metodología y Categorías',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/'
      },
      {
        title: 'OWASP SAMM — Software Assurance Maturity Model v2.0.1',
        organization: 'OWASP Foundation',
        url: 'https://owaspsamm.org/'
      },
      {
        title: 'MITRE CWE — Common Weakness Enumeration',
        organization: 'MITRE Corporation',
        url: 'https://cwe.mitre.org/'
      }
    ]
  }
};
