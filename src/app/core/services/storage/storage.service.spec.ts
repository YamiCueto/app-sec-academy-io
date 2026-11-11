import { TestBed } from '@angular/core/testing';
import { StorageDriver, STORAGE_DRIVER } from './storage-driver.token';
import {
  StorageService,
  PROGRESS_STORAGE_KEY,
  CURRENT_SCHEMA_VERSION,
  normalizeSectionId,
  isValidSectionId
} from './storage.service';

class MockStorageDriver implements StorageDriver {
  store = new Map<string, string>();
  throwOnGet = false;
  throwOnSet = false;

  getItem(key: string): string | null {
    if (this.throwOnGet) {
      throw new Error('StorageDisabledException');
    }
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.throwOnSet) {
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

describe('StorageService', () => {
  let service: StorageService;
  let mockDriver: MockStorageDriver;

  beforeEach(() => {
    mockDriver = new MockStorageDriver();
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    });
    service = TestBed.inject(StorageService);
  });

  it('1. Estudiante nuevo: debe generar un estado inicial seguro con la version de esquema 2.0.0', () => {
    const initial = service.createInitialState('Estudiante Test');
    expect(initial.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(initial.alias).toBe('Estudiante Test');
    expect(initial.totalXP).toBe(0);
    expect(initial.completedLessons).toEqual([]);
    expect(initial.lessonRecords).toEqual({});
    expect(initial.labRecords).toEqual({});
    expect(initial.preferences.theme).toBe('dark');
  });

  it('2. Migracion de progreso del Sprint 1: debe migrar un estado v1.0.0 sin lastActiveLessonId a v2.0.0', () => {
    const sprint1State = {
      schemaVersion: '1.0.0',
      alias: 'Cadete Sprint 1',
      createdAt: '2026-11-01T10:00:00.000Z',
      updatedAt: '2026-11-01T11:00:00.000Z',
      totalXP: 300,
      completedLessons: ['1.1'],
      lessonRecords: {
        '1.1': {
          completedAt: '2026-11-01T10:30:00.000Z',
          quizScore: 100,
          quizAttempts: 1,
          quizPassed: true,
          labPassed: false,
          labScore: 0,
          hintsUsed: 0
        }
      },
      labRecords: {},
      preferences: {
        theme: 'dark',
        soundEnabled: false,
        highContrast: false
      }
    };

    mockDriver.store.set(PROGRESS_STORAGE_KEY, JSON.stringify(sprint1State));
    const loaded = service.loadState();

    expect(loaded.schemaVersion).toBe('2.0.0');
    expect(loaded.alias).toBe('Cadete Sprint 1');
    expect(loaded.totalXP).toBe(300);
    expect(loaded.completedLessons).toEqual(['1.1']);
    expect(loaded.lastActiveLessonId).toBeUndefined();
    expect(loaded.lessonRecords['1.1'].readingCompleted).toBe(true);
    expect(loaded.lessonRecords['1.1'].isLegacyCompleted).toBe(true);
    expect(loaded.lessonRecords['1.1'].lastSectionId).toBe('introduccion');
    expect(loaded.lessonRecords['1.1'].visitedSections).toEqual(['introduccion']);
    expect(loaded.lessonRecords['1.1'].visitedSections?.length).toBe(1);
  });

  it('3. Migracion desde estado de Sprint 2 / H1: debe migrar v1.0.0 con lastActiveLessonId preservando posicion', () => {
    const sprint2H1State = {
      schemaVersion: '1.0.0',
      alias: 'Cadete H1',
      createdAt: '2026-11-10T10:00:00.000Z',
      updatedAt: '2026-11-10T11:00:00.000Z',
      totalXP: 250,
      lastActiveLessonId: '1.2',
      completedLessons: ['1.1'],
      lessonRecords: {
        '1.1': {
          completedAt: '2026-11-10T10:30:00.000Z',
          quizScore: 100,
          quizAttempts: 1,
          quizPassed: true,
          labPassed: false,
          labScore: 0,
          hintsUsed: 0
        },
        '1.2': {
          quizScore: 0,
          quizAttempts: 0,
          quizPassed: false,
          labPassed: false,
          labScore: 0,
          hintsUsed: 0
        }
      },
      labRecords: {},
      preferences: {
        theme: 'dark',
        soundEnabled: false,
        highContrast: false
      }
    };

    mockDriver.store.set(PROGRESS_STORAGE_KEY, JSON.stringify(sprint2H1State));
    const loaded = service.loadState();

    expect(loaded.schemaVersion).toBe('2.0.0');
    expect(loaded.lastActiveLessonId).toBe('1.2');
    expect(loaded.lastActiveSectionId).toBe('introduccion');
    expect(loaded.lessonRecords['1.2'].lastSectionId).toBe('introduccion');
    expect(loaded.lessonRecords['1.2'].visitedSections).toEqual(['introduccion']);
    expect(loaded.totalXP).toBe(250);
  });

  it('6. Indice o ID de seccion invalido: normalizeSectionId debe normalizar a introduccion', () => {
    expect(normalizeSectionId('introduccion')).toBe('introduccion');
    expect(normalizeSectionId('conceptos')).toBe('conceptos');
    expect(normalizeSectionId('seccion_inexistente')).toBe('introduccion');
    expect(normalizeSectionId(null)).toBe('introduccion');
    expect(normalizeSectionId(123)).toBe('introduccion');
    expect(isValidSectionId('laboratorio')).toBe(true);
    expect(isValidSectionId('hack_injection')).toBe(false);
  });

  it('8. Almacenamiento deshabilitado: debe retornar estado inicial seguro si el driver falla en lectura', () => {
    mockDriver.throwOnGet = true;
    const loaded = service.loadState();
    expect(loaded.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(loaded.totalXP).toBe(0);
    expect(loaded.alias).toBe('Cadete AppSec');
  });

  it('9. Cuota de almacenamiento excedida: debe retornar false sin lanzar excepciones no controladas', () => {
    mockDriver.throwOnSet = true;
    const state = service.createInitialState();
    const result = service.saveState(state);
    expect(result).toBe(false);
  });

  it('10. Datos JSON corruptos: debe retornar estado inicial seguro ante JSON corrupto sin lanzar excepciones', () => {
    mockDriver.store.set(PROGRESS_STORAGE_KEY, '{ json_incompleto_o_invalido: ');
    const loaded = service.loadState();
    expect(loaded.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(loaded.totalXP).toBe(0);
    expect(loaded.completedLessons).toEqual([]);
  });

  it('11. Migracion ejecutada dos veces: debe ser estrictamente idempotente', () => {
    const rawState = {
      schemaVersion: '1.0.0',
      alias: 'Cadete Idempotente',
      totalXP: 500,
      completedLessons: ['1.1', '1.2'],
      lessonRecords: {
        '1.1': { quizPassed: true, quizScore: 100, quizAttempts: 1, labPassed: false, labScore: 0, hintsUsed: 0 }
      },
      labRecords: {},
      preferences: { theme: 'dark', soundEnabled: false, highContrast: false }
    };

    const firstMigration = service.migrateState(rawState);
    const secondMigration = service.migrateState(firstMigration as unknown as Record<string, unknown>);

    expect(secondMigration.schemaVersion).toBe(firstMigration.schemaVersion);
    expect(secondMigration.totalXP).toBe(firstMigration.totalXP);
    expect(secondMigration.completedLessons).toEqual(firstMigration.completedLessons);
    expect(secondMigration.lessonRecords).toEqual(firstMigration.lessonRecords);
  });

  it('20. Conservacion integra de resultados anteriores: debe preservar XP, quizes y labs sin alteracion', () => {
    const fullState = {
      schemaVersion: '1.0.0',
      alias: 'Ingeniero Evaluado',
      createdAt: '2026-11-05T08:00:00.000Z',
      updatedAt: '2026-11-05T12:00:00.000Z',
      totalXP: 380,
      completedLessons: ['1.1', '1.2'],
      lessonRecords: {
        '1.1': { quizScore: 100, quizAttempts: 1, quizPassed: true, labPassed: false, labScore: 0, hintsUsed: 0 },
        '1.2': { quizScore: 80, quizAttempts: 2, quizPassed: true, labPassed: true, labScore: 200, hintsUsed: 0 }
      },
      labRecords: {
        'LAB-BAC-01': { labId: 'LAB-BAC-01', passed: true, score: 200, hintsUsed: 0, completedAt: '2026-11-05T12:00:00.000Z' }
      },
      preferences: { theme: 'dark', soundEnabled: true, highContrast: true }
    };

    const migrated = service.migrateState(fullState);
    expect(migrated.totalXP).toBe(380);
    expect(migrated.completedLessons).toEqual(['1.1', '1.2']);
    expect(migrated.lessonRecords['1.2'].quizScore).toBe(80);
    expect(migrated.lessonRecords['1.2'].quizAttempts).toBe(2);
    expect(migrated.lessonRecords['1.2'].labScore).toBe(200);
    expect(migrated.labRecords['LAB-BAC-01'].score).toBe(200);
    expect(migrated.preferences.soundEnabled).toBe(true);
    expect(migrated.preferences.highContrast).toBe(true);
  });

  it('debe persistir y recuperar el estado correctamente', () => {
    const state = service.createInitialState();
    const modified = {
      ...state,
      totalXP: 250,
      completedLessons: ['1.1']
    };
    service.saveState(modified);

    const loaded = service.loadState();
    expect(loaded.totalXP).toBe(250);
    expect(loaded.completedLessons).toEqual(['1.1']);
  });

  it('debe rechazar y reiniciar datos ante una version de esquema incompatible', () => {
    const incompatible = {
      schemaVersion: '99.0.0',
      alias: 'Incompatible',
      totalXP: 5000,
      completedLessons: []
    };
    mockDriver.store.set(PROGRESS_STORAGE_KEY, JSON.stringify(incompatible));

    const loaded = service.loadState();
    expect(loaded.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(loaded.totalXP).toBe(0);
  });

  it('debe eliminar la clave de almacenamiento al ejecutar clearState', () => {
    const state = service.createInitialState();
    service.saveState(state);
    expect(mockDriver.store.has(PROGRESS_STORAGE_KEY)).toBe(true);

    service.clearState();
    expect(mockDriver.store.has(PROGRESS_STORAGE_KEY)).toBe(false);
  });

  it('debe validar exhaustivamente la estructura en isValidProgressState', () => {
    expect(service.isValidProgressState(null)).toBe(false);
    expect(service.isValidProgressState('string')).toBe(false);
    expect(service.isValidProgressState([])).toBe(false);
    expect(service.isValidProgressState({ schemaVersion: '0.9.0' })).toBe(false);
    expect(service.isValidProgressState({
      schemaVersion: '2.0.0',
      alias: 123
    })).toBe(false);
    expect(service.isValidProgressState({
      schemaVersion: '2.0.0',
      alias: 'Cadete',
      totalXP: -10
    })).toBe(false);
    expect(service.isValidProgressState({
      schemaVersion: '2.0.0',
      alias: 'Cadete',
      totalXP: 100,
      completedLessons: 'not-an-array'
    })).toBe(false);
  });

  it('debe aceptar estados legados sin lastActiveLessonId y rechazar valores no validos', () => {
    const legacyValidState = service.createInitialState();
    delete (legacyValidState as unknown as Record<string, unknown>)['lastActiveLessonId'];
    expect(service.isValidProgressState(legacyValidState)).toBe(true);

    const withValidLastActive = {
      ...legacyValidState,
      lastActiveLessonId: '1.2'
    };
    expect(service.isValidProgressState(withValidLastActive)).toBe(true);

    const withInvalidTypeLastActive = {
      ...legacyValidState,
      lastActiveLessonId: 123
    };
    expect(service.isValidProgressState(withInvalidTypeLastActive)).toBe(false);

    const withEmptyLastActive = {
      ...legacyValidState,
      lastActiveLessonId: '   '
    };
    expect(service.isValidProgressState(withEmptyLastActive)).toBe(false);
  });
});
