import { TestBed } from '@angular/core/testing';
import { StorageDriver, STORAGE_DRIVER } from '../services/storage/storage-driver.token';
import { StorageService } from '../services/storage/storage.service';
import { calculateCompletionPercentage, determineEngineeringRank, ProgressStore } from './progress.store';

class MockStorageDriver implements StorageDriver {
  store = new Map<string, string>();
  shouldFailSet = false;

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.shouldFailSet) {
      throw new Error('QuotaExceededError');
    }
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

describe('ProgressStore', () => {
  let store: ProgressStore;
  let mockDriver: MockStorageDriver;

  beforeEach(() => {
    mockDriver = new MockStorageDriver();
    TestBed.configureTestingModule({
      providers: [
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    });
    store = TestBed.inject(ProgressStore);
  });

  it('debe inicializarse en estado vacio cuando no hay datos persistidos', () => {
    expect(store.isEmpty()).toBe(true);
    expect(store.totalXP()).toBe(0);
    expect(store.completedLessonsCount()).toBe(0);
    expect(store.completedLabsCount()).toBe(0);
    expect(store.completedQuizzesCount()).toBe(0);
    expect(store.completionPercentage()).toBe(0);
    expect(store.rank()).toBe('AppSec Apprentice');
  });

  it('debe registrar el progreso de una leccion y otorgar la experiencia correspondiente', () => {
    store.recordLessonCompletion('1.1', 100);

    expect(store.isEmpty()).toBe(false);
    expect(store.completedLessonsCount()).toBe(1);
    expect(store.completedLessons()).toEqual(['1.1']);
    expect(store.totalXP()).toBe(100);
  });

  it('debe actualizar el progreso sin duplicar lecciones ni duplicar XP en registros repetidos', () => {
    store.recordLessonCompletion('1.1', 100);
    store.recordLessonCompletion('1.1', 100);

    expect(store.completedLessonsCount()).toBe(1);
    expect(store.completedLessons()).toEqual(['1.1']);
    expect(store.totalXP()).toBe(100);
  });

  it('debe restaurar el estado completo tras recrear el store desde el almacenamiento persistido', () => {
    store.recordLessonCompletion('1.1', 100);
    store.recordLessonCompletion('1.3', 150);

    const freshTestBed = TestBed.resetTestingModule();
    freshTestBed.configureTestingModule({
      providers: [
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    });
    const restoredStore = freshTestBed.inject(ProgressStore);

    expect(restoredStore.completedLessonsCount()).toBe(2);
    expect(restoredStore.completedLessons()).toContain('1.1');
    expect(restoredStore.completedLessons()).toContain('1.3');
    expect(restoredStore.totalXP()).toBe(250);
  });

  it('debe calcular el porcentaje de completado sin division por cero cuando total es cero', () => {
    expect(calculateCompletionPercentage(5, 0)).toBe(0);
    expect(calculateCompletionPercentage(0, 0)).toBe(0);
    expect(calculateCompletionPercentage(-1, 10)).toBe(0);
    expect(calculateCompletionPercentage(2, 4)).toBe(50);
  });

  it('debe limitar el porcentaje de completado para que nunca supere el 100 %', () => {
    expect(calculateCompletionPercentage(100, 49)).toBe(100);
  });

  it('debe mantener la independencia de progreso entre diferentes modulos', () => {
    store.recordLessonCompletion('1.1');
    store.recordLessonCompletion('1.2');

    const m01Progress = store.getModuleProgress('m01');
    expect(m01Progress.completedLessonsCount).toBe(2);
    expect(m01Progress.totalLessonsCount).toBe(4);
    expect(m01Progress.completionPercentage).toBe(50);
    expect(m01Progress.isCompleted).toBe(false);

    const m02Progress = store.getModuleProgress('m02');
    expect(m02Progress.completedLessonsCount).toBe(0);
    expect(m02Progress.totalLessonsCount).toBe(4);
    expect(m02Progress.completionPercentage).toBe(0);
    expect(m02Progress.isCompleted).toBe(false);
  });

  it('debe restablecer explicitamente el progreso reiniciando estado y limpiando almacenamiento', () => {
    store.recordLessonCompletion('1.1', 200);
    expect(store.isEmpty()).toBe(false);

    store.resetProgress();

    expect(store.isEmpty()).toBe(true);
    expect(store.totalXP()).toBe(0);
    expect(store.completedLessonsCount()).toBe(0);
  });

  it('debe mantener la persistencia consistente tras sucesivas actualizaciones de quiz y labs', () => {
    store.recordQuizResult('1.1', 90, true);
    expect(store.completedQuizzesCount()).toBe(1);
    expect(store.completedLessonsCount()).toBe(1);

    store.recordLabResult('lab-bac-01', true, 180, 1, '1.2');
    expect(store.completedLabsCount()).toBe(1);
    expect(store.totalXP()).toBe(280);

    store.recordQuizResult('1.2', 85, true);
    expect(store.completedLessons()).toContain('1.2');
  });

  it('debe mantener el estado reactivo en memoria intacto y emitir una advertencia observable si falla la persistencia', () => {
    mockDriver.shouldFailSet = true;

    store.recordLessonCompletion('1.1', 120);

    expect(store.completedLessons()).toContain('1.1');
    expect(store.totalXP()).toBe(120);
    expect(store.storageWarning()).toContain('no está disponible');
  });

  it('debe asignar los rangos tecnicos correctos segun el XP acumulado', () => {
    expect(determineEngineeringRank(0)).toBe('AppSec Apprentice');
    expect(determineEngineeringRank(1200)).toBe('AppSec Apprentice');
    expect(determineEngineeringRank(1201)).toBe('Secure Software Practitioner');
    expect(determineEngineeringRank(3501)).toBe('AppSec Engineer');
    expect(determineEngineeringRank(7001)).toBe('Senior AppSec Specialist');
    expect(determineEngineeringRank(11001)).toBe('Principal AppSec Architect');
  });

  it('debe cargar limpiamente un estado legado del Sprint 1 sin lastActiveLessonId', () => {
    const legacyState = {
      schemaVersion: '1.0.0',
      alias: 'Cadete Sprint 1',
      createdAt: '2026-11-01T10:00:00.000Z',
      updatedAt: '2026-11-01T11:00:00.000Z',
      totalXP: 450,
      completedLessons: ['1.1', '1.2'],
      lessonRecords: {
        '1.1': { completedAt: '2026-11-01T10:30:00.000Z', quizScore: 100, quizAttempts: 1, quizPassed: true, labPassed: false, labScore: 0, hintsUsed: 0 },
        '1.2': { completedAt: '2026-11-01T11:00:00.000Z', quizScore: 100, quizAttempts: 1, quizPassed: true, labPassed: true, labScore: 100, hintsUsed: 0 }
      },
      labRecords: {
        'LAB-BAC-01': { labId: 'LAB-BAC-01', passed: true, score: 100, hintsUsed: 0, completedAt: '2026-11-01T11:00:00.000Z' }
      },
      preferences: { theme: 'dark', soundEnabled: false, highContrast: false }
    };

    mockDriver.store.set('appsec_academy_progress_v1', JSON.stringify(legacyState));

    const reloadedStore = TestBed.runInInjectionContext(() => {
      const storageService = TestBed.inject(StorageService);
      return new ProgressStore();
    });

    expect(reloadedStore.totalXP()).toBe(450);
    expect(reloadedStore.completedLessons()).toEqual(['1.1', '1.2']);
    expect(reloadedStore.lastActiveLessonId()).toBeNull();
  });

  it('debe persistir lastActiveLessonId y recuperarlo consistentemente tras recargar', () => {
    store.setLastActiveLesson('1.3');
    expect(store.lastActiveLessonId()).toBe('1.3');

    const reloadedStore = TestBed.runInInjectionContext(() => {
      return new ProgressStore();
    });

    expect(reloadedStore.lastActiveLessonId()).toBe('1.3');
  });

  it('debe ignorar identificadores invalidos o vacios sin corromper el estado', () => {
    store.recordLessonCompletion('1.1', 100);
    const prevXP = store.totalXP();
    const prevLessons = store.completedLessons();

    store.setLastActiveLesson('');
    store.setLastActiveLesson('   ');
    store.recordLessonCompletion('', 50);
    store.recordLessonCompletion('   ', 50);

    expect(store.totalXP()).toBe(prevXP);
    expect(store.completedLessons()).toEqual(prevLessons);
  });

  it('debe garantizar idempotencia de recompensas y evitar duplicacion de XP en lecciones y cuestionarios', () => {
    store.recordLessonCompletion('1.1', 100);
    expect(store.totalXP()).toBe(100);

    store.recordLessonCompletion('1.1', 100);
    expect(store.totalXP()).toBe(100);

    store.recordQuizResult('1.1', 100, true);
    expect(store.totalXP()).toBe(200);

    store.recordQuizResult('1.1', 100, true);
    expect(store.totalXP()).toBe(200);
  });

  it('4. Ultima seccion persistida: debe registrar la seccion consultada y recuperarla', () => {
    store.recordSectionVisit('1.1', 'conceptos');
    expect(store.lastActiveLessonId()).toBe('1.1');
    expect(store.lastActiveSectionId()).toBe('conceptos');

    const record = store.getLessonRecord('1.1');
    expect(record).toBeDefined();
    expect(record?.lastSectionId).toBe('conceptos');
    expect(record?.visitedSections).toContain('conceptos');
    expect(record?.visitedSections).toContain('introduccion');
    expect(store.totalXP()).toBe(0);
  });

  it('5. Recuperacion tras recarga: debe reconstruir la posicion exacta desde almacenamiento', () => {
    store.recordSectionVisit('1.2', 'ejemplos');

    const freshTestBed = TestBed.resetTestingModule();
    freshTestBed.configureTestingModule({
      providers: [
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    });
    const reloaded = freshTestBed.inject(ProgressStore);

    expect(reloaded.lastActiveLessonId()).toBe('1.2');
    expect(reloaded.lastActiveSectionId()).toBe('ejemplos');
    const rec = reloaded.getLessonRecord('1.2');
    expect(rec?.lastSectionId).toBe('ejemplos');
  });

  it('6. Seccion invalida: recordSectionVisit debe normalizar a introduccion si recibe seccion desconocida', () => {
    store.recordSectionVisit('1.1', 'seccion-inexistente' as any);
    expect(store.lastActiveSectionId()).toBe('introduccion');
    const rec = store.getLessonRecord('1.1');
    expect(rec?.lastSectionId).toBe('introduccion');
  });

  it('7. Leccion inexistente: getLessonAcademicStatus debe retornar not_started', () => {
    expect(store.getLessonAcademicStatus('99.99')).toBe('not_started');
    expect(store.getLessonRecord('99.99')).toBeUndefined();
  });

  it('12. XP idempotente: navegar entre secciones o reiniciar no debe otorgar XP', () => {
    const initialXP = store.totalXP();
    store.recordSectionVisit('1.1', 'objetivos');
    store.recordSectionVisit('1.1', 'conceptos');
    store.recordSectionVisit('1.1', 'ejemplos');
    expect(store.totalXP()).toBe(initialXP);

    store.resetLessonReading('1.1');
    expect(store.totalXP()).toBe(initialXP);
  });

  it('13. Cuestionario aprobado: debe otorgar 100 XP base y registrar quizPassed', () => {
    store.recordQuizResult('1.1', 85, true);
    expect(store.totalXP()).toBe(100);
    const rec = store.getLessonRecord('1.1');
    expect(rec?.quizPassed).toBe(true);
    expect(rec?.quizScore).toBe(85);
    expect(rec?.quizAttempts).toBe(1);
  });

  it('14. Cuestionario reprobado: debe registrar calificacion sin otorgar XP ni completar leccion', () => {
    store.recordQuizResult('1.1', 60, false);
    expect(store.totalXP()).toBe(0);
    expect(store.completedLessons()).not.toContain('1.1');
    const rec = store.getLessonRecord('1.1');
    expect(rec?.quizPassed).toBe(false);
    expect(rec?.quizScore).toBe(60);
    expect(rec?.quizAttempts).toBe(1);
    expect(store.getLessonAcademicStatus('1.1')).toBe('in_progress');
  });

  it('15. Laboratorio obligatorio pendiente: para 1.2 quiz aprobado no completa hasta aprobar lab', () => {
    store.recordQuizResult('1.2', 100, true);
    expect(store.completedLessons()).not.toContain('1.2');
    expect(store.getLessonAcademicStatus('1.2')).toBe('lab_pending');
  });

  it('16. Laboratorio obligatorio aprobado: para 1.2 quiz + lab aprobado completa la leccion', () => {
    store.recordQuizResult('1.2', 100, true);
    store.recordLabResult('LAB-BAC-01', true, 200, 0, '1.2');

    expect(store.completedLessons()).toContain('1.2');
    expect(store.getLessonAcademicStatus('1.2')).toBe('completed');
    expect(store.totalXP()).toBe(300);
  });

  it('17. Leccion sin laboratorio: para 1.1 aprobar quiz completa la leccion inmediatamente', () => {
    store.recordQuizResult('1.1', 90, true);
    expect(store.completedLessons()).toContain('1.1');
    expect(store.getLessonAcademicStatus('1.1')).toBe('completed');
    expect(store.totalXP()).toBe(100);
  });

  it('19. Navegacion entre lecciones: cambiar de leccion no altera la completitud academica', () => {
    store.recordQuizResult('1.1', 100, true);
    expect(store.completedLessons()).toEqual(['1.1']);

    store.recordSectionVisit('1.3', 'conceptos');
    store.recordSectionVisit('1.4', 'objetivos');

    expect(store.completedLessons()).toEqual(['1.1']);
    expect(store.totalXP()).toBe(100);
  });
});
