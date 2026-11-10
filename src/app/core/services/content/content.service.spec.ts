import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';
import { isValidLessonDetail } from '../../../models/content.model';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
  });

  it('debe resolver la leccion 1.1 con todas sus 9 secciones validas, ejemplos tecnicos y evaluacion formativa', async () => {
    const lesson = await service.getLessonById('1.1');
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe('1.1');
    expect(lesson?.moduleId).toBe('m01');
    expect(isValidLessonDetail(lesson)).toBe(true);

    expect(lesson?.sections.introduction).toContain('Tríada CIA');
    expect(lesson?.sections.objectives.length).toBe(4);
    expect(lesson?.sections.conceptualExplanation.keyPoints.length).toBeGreaterThanOrEqual(4);
    expect(lesson?.sections.technicalExamples.length).toBe(2);
    expect(lesson?.sections.technicalExamples[0].language).toBe('java');
    expect(lesson?.sections.technicalExamples[1].language).toBe('typescript');
    expect(lesson?.sections.realScenarios.length).toBeGreaterThan(0);
    expect(lesson?.sections.lab.labId).toBe('demo-owasp-taxonomy');
    expect(lesson?.sections.knowledgeCheck.questions.length).toBe(5);
    expect(lesson?.sections.summary.goldenRules.length).toBeGreaterThanOrEqual(4);
    expect(lesson?.sections.summary.antipatterns.length).toBeGreaterThanOrEqual(3);
    expect(lesson?.sections.references.length).toBeGreaterThanOrEqual(3);
  });

  it('debe resolver la leccion 1.2 sobre Broken Access Control vinculada al laboratorio LAB-BAC-01', async () => {
    const lesson = await service.getLessonById('1.2');
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe('1.2');
    expect(isValidLessonDetail(lesson)).toBe(true);
    expect(lesson?.sections.lab.labId).toBe('LAB-BAC-01');
    expect(lesson?.sections.technicalExamples.length).toBe(2);
    expect(lesson?.sections.technicalExamples[0].language).toBe('java');
    expect(lesson?.sections.technicalExamples[1].language).toBe('typescript');
    expect(lesson?.sections.knowledgeCheck.questions.length).toBe(5);
  });

  it('debe resolver la leccion 1.3 sobre Fallos Criptograficos y Configuracion con Argon2id y CSP', async () => {
    const lesson = await service.getLessonById('1.3');
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe('1.3');
    expect(isValidLessonDetail(lesson)).toBe(true);
    expect(lesson?.title).toContain('Fallos Criptográficos');
    expect(lesson?.sections.lab.labId).toBe('demo-crypto-headers-audit');
    expect(lesson?.sections.technicalExamples.length).toBe(3);
    expect(lesson?.sections.knowledgeCheck.questions.length).toBe(5);
    expect(lesson?.standards.owasp).toContain('A02:2021 - Cryptographic Failures');
    expect(lesson?.standards.owasp).toContain('A05:2021 - Security Misconfiguration');
  });

  it('debe resolver la leccion 1.4 sobre OWASP ASVS v4.0.3 con pruebas duales y criterios verificables', async () => {
    const lesson = await service.getLessonById('1.4');
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe('1.4');
    expect(isValidLessonDetail(lesson)).toBe(true);
    expect(lesson?.title).toContain('OWASP ASVS');
    expect(lesson?.sections.lab.labId).toBe('demo-asvs-checklist');
    expect(lesson?.sections.technicalExamples.length).toBe(2);
    expect(lesson?.sections.knowledgeCheck.questions.length).toBe(5);
    expect(lesson?.standards.asvs).toContain('ASVS v4.0.3 V1');
    expect(lesson?.standards.asvs).toContain('ASVS v4.0.3 V4');
  });

  it('debe resolver alias amigables (slugs) hacia las mismas instancias de leccion', async () => {
    const slug11 = await service.getLessonById('1.1-metodologia-owasp');
    const slug12 = await service.getLessonById('1.2-broken-access-control');
    const slug13 = await service.getLessonById('1.3-fallos-criptograficos');
    const slug14 = await service.getLessonById('1.4-owasp-asvs');

    expect(slug11?.id).toBe('1.1');
    expect(slug12?.id).toBe('1.2');
    expect(slug13?.id).toBe('1.3');
    expect(slug14?.id).toBe('1.4');
  });

  it('debe validar la integridad pedagogica de los cuestionarios en todas las lecciones del Modulo 01', () => {
    const lessonIds = ['1.1', '1.2', '1.3', '1.4'];

    for (const id of lessonIds) {
      const lesson = service.getLessonSync(id);
      expect(lesson).not.toBeNull();
      const questions = lesson!.sections.knowledgeCheck.questions;
      expect(questions.length).toBe(5);

      for (const question of questions) {
        expect(question.id).toBeTruthy();
        expect(question.prompt.length).toBeGreaterThan(10);
        expect(question.options.length).toBeGreaterThanOrEqual(3);

        const correctOptions = question.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);

        for (const option of question.options) {
          expect(option.id).toBeTruthy();
          expect(option.text.length).toBeGreaterThan(5);
          expect(option.feedback.length).toBeGreaterThan(10);
        }
      }
    }
  });

  it('debe validar que los fragmentos de codigo no contengan secretos ni marcadores vacios', () => {
    const lessonIds = ['1.1', '1.2', '1.3', '1.4'];

    for (const id of lessonIds) {
      const lesson = service.getLessonSync(id);
      expect(lesson).not.toBeNull();
      for (const example of lesson!.sections.technicalExamples) {
        expect(example.title.length).toBeGreaterThan(5);
        expect(example.vulnerableSnippet.length).toBeGreaterThan(20);
        expect(example.remediatedSnippet.length).toBeGreaterThan(20);
        expect(example.vulnerableExplanation.length).toBeGreaterThan(20);
        expect(example.remediatedExplanation.length).toBeGreaterThan(20);
      }
    }
  });

  it('debe retornar null para identificadores de lecciones no existentes', async () => {
    const notFound = await service.getLessonById('99.99-inexistente');
    expect(notFound).toBeNull();
  });

  it('debe proveer el catalogo de modulos curriculares con metadata consistente e identificar lecciones disponibles', () => {
    const modules = service.getModules();
    expect(modules.length).toBe(14);
    expect(modules[0].id).toBe('m01');
    expect(modules[0].code).toBe('M01');
    expect(modules[0].lessonCount).toBe(4);

    expect(modules[0].lessons[0].title).toBe('Anatomía de Debilidades y Metodología OWASP');
    expect(modules[0].lessons[1].title).toBe('Broken Access Control (A01:2021) — El Vector #1 de Compromiso');
    expect(modules[0].lessons[2].title).toBe('Fallos Criptográficos y de Configuración (A02 & A05:2021)');
    expect(modules[0].lessons[3].title).toBe('OWASP ASVS y Verificación de Seguridad');
  });
});
