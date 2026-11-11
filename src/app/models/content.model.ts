export type DifficultyLevel = 'basico' | 'intermedio' | 'avanzado';

export type LessonSectionId =
  | 'introduccion'
  | 'objetivos'
  | 'conceptos'
  | 'ejemplos'
  | 'escenarios'
  | 'laboratorio'
  | 'evaluacion'
  | 'resumen'
  | 'referencias';

export interface LessonSectionMeta {
  readonly id: LessonSectionId;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;
  readonly icon: string;
}

export const LESSON_SECTIONS_CATALOG: readonly LessonSectionMeta[] = [
  { id: 'introduccion', order: 1, title: '1. Introducción y Contexto', shortTitle: 'Introducción', icon: '📌' },
  { id: 'objetivos', order: 2, title: '2. Objetivos de Aprendizaje (Bloom)', shortTitle: 'Objetivos', icon: '🎯' },
  { id: 'conceptos', order: 3, title: '3. Explicación Conceptual', shortTitle: 'Conceptos', icon: '🧠' },
  { id: 'ejemplos', order: 4, title: '4. Ejemplos Técnicos (Vulnerable vs Remediado)', shortTitle: 'Código', icon: '💻' },
  { id: 'escenarios', order: 5, title: '5. Escenarios Reales y Casos de Estudio', shortTitle: 'Casos Reales', icon: '🔍' },
  { id: 'laboratorio', order: 6, title: '6. Laboratorio Práctico Integrado', shortTitle: 'Laboratorio', icon: '🧪' },
  { id: 'evaluacion', order: 7, title: '7. Verificación de Conocimiento', shortTitle: 'Evaluación', icon: '📝' },
  { id: 'resumen', order: 8, title: '8. Resumen Ejecutivo de Ingeniería', shortTitle: 'Resumen', icon: '📋' },
  { id: 'referencias', order: 9, title: '9. Referencias y Estándares Oficiales', shortTitle: 'Estándares', icon: '📚' }
];

export interface QuizOption {
  readonly id: string;
  readonly text: string;
  readonly isCorrect: boolean;
  readonly feedback: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly QuizOption[];
}

export interface TechnicalExample {
  readonly language: string;
  readonly title: string;
  readonly vulnerableFilename: string;
  readonly vulnerableSnippet: string;
  readonly vulnerableExplanation: string;
  readonly remediatedFilename: string;
  readonly remediatedSnippet: string;
  readonly remediatedExplanation: string;
}

export interface RealScenario {
  readonly incidentTitle: string;
  readonly cveReference?: string;
  readonly summary: string;
  readonly mitigationAnalysis: string;
}

export interface LessonLabSummary {
  readonly labId: string;
  readonly title: string;
  readonly missionPrompt: string;
  readonly starterFiles?: Readonly<Record<string, string>>;
  readonly hints: readonly string[];
}

export interface LessonStandards {
  readonly cwe?: readonly string[];
  readonly owasp?: readonly string[];
  readonly asvs?: readonly string[];
  readonly nist?: readonly string[];
}

export interface LessonSummarySection {
  readonly goldenRules: readonly string[];
  readonly antipatterns: readonly string[];
}

export interface OfficialReference {
  readonly title: string;
  readonly organization: string;
  readonly versionDate?: string;
  readonly url: string;
}

export interface LessonSections {
  readonly introduction: string;
  readonly objectives: readonly string[];
  readonly conceptualExplanation: {
    readonly markdown: string;
    readonly keyPoints: readonly string[];
  };
  readonly technicalExamples: readonly TechnicalExample[];
  readonly realScenarios: readonly RealScenario[];
  readonly lab: LessonLabSummary;
  readonly knowledgeCheck: {
    readonly questions: readonly QuizQuestion[];
  };
  readonly summary: LessonSummarySection;
  readonly references: readonly OfficialReference[];
}

export interface LessonDetail {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly order: number;
  readonly estimatedMinutes: number;
  readonly difficulty: DifficultyLevel;
  readonly standards: LessonStandards;
  readonly sections: LessonSections;
}

export interface LessonMetadata {
  readonly id: string;
  readonly title: string;
  readonly order: number;
  readonly estimatedMinutes: number;
  readonly difficulty: DifficultyLevel;
  readonly isAvailable?: boolean;
}

export interface ModuleMetadata {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: DifficultyLevel;
  readonly estimatedMinutes: number;
  readonly lessonCount: number;
  readonly block?: 'fundacional' | 'intermedio' | 'avanzado';
  readonly blockTitle?: string;
  readonly isAvailable?: boolean;
  readonly bloomObjectives?: readonly string[];
  readonly standards: readonly {
    readonly name: string;
    readonly version: string;
    readonly specUrl: string;
  }[];
  readonly lessons: readonly LessonMetadata[];
}

export function isValidLessonDetail(data: unknown): data is LessonDetail {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }
  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['moduleId'] === 'string' &&
    typeof candidate['title'] === 'string' &&
    typeof candidate['order'] === 'number' &&
    typeof candidate['estimatedMinutes'] === 'number' &&
    typeof candidate['sections'] === 'object' &&
    candidate['sections'] !== null
  );
}
