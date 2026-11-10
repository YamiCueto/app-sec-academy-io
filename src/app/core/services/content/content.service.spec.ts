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

  it('debe resolver la leccion de demostracion 1.1 con todas sus 9 secciones validas', async () => {
    const lesson = await service.getLessonById('1.1');
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe('1.1');
    expect(lesson?.moduleId).toBe('m01');
    expect(isValidLessonDetail(lesson)).toBe(true);

    expect(lesson?.sections.introduction).toBeTruthy();
    expect(lesson?.sections.objectives.length).toBeGreaterThan(0);
    expect(lesson?.sections.conceptualExplanation.keyPoints.length).toBeGreaterThan(0);
    expect(lesson?.sections.technicalExamples.length).toBeGreaterThan(0);
    expect(lesson?.sections.realScenarios.length).toBeGreaterThan(0);
    expect(lesson?.sections.lab.labId).toBeTruthy();
    expect(lesson?.sections.knowledgeCheck.questions.length).toBe(3);
    expect(lesson?.sections.summary.goldenRules.length).toBeGreaterThan(0);
    expect(lesson?.sections.references.length).toBeGreaterThan(0);
  });

  it('debe resolver la leccion 1.2 sobre Broken Access Control vinculada al laboratorio LAB-BAC-01', async () => {
    const lesson = await service.getLessonById('1.2');
    expect(lesson).toBeTruthy();
    expect(lesson?.id).toBe('1.2');
    expect(lesson?.sections.lab.labId).toBe('LAB-BAC-01');
  });

  it('debe retornar null para identificadores de lecciones no existentes', async () => {
    const notFound = await service.getLessonById('99.99-inexistente');
    expect(notFound).toBeNull();
  });

  it('debe proveer el catalogo de modulos curriculares con metadata consistente', () => {
    const modules = service.getModules();
    expect(modules.length).toBe(14);
    expect(modules[0].id).toBe('m01');
    expect(modules[0].code).toBe('M01');
    expect(modules[0].lessonCount).toBe(4);
  });
});
