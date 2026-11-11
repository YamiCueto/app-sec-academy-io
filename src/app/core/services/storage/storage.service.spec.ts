import { TestBed } from '@angular/core/testing';
import { StorageDriver, STORAGE_DRIVER } from './storage-driver.token';
import { CURRENT_SCHEMA_VERSION, PROGRESS_STORAGE_KEY, StorageService } from './storage.service';

class MockStorageDriver implements StorageDriver {
  store = new Map<string, string>();
  throwOnGet = false;
  throwOnSet = false;

  getItem(key: string): string | null {
    if (this.throwOnGet) {
      throw new Error('Storage access denied');
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

  it('debe generar un estado inicial seguro con la version de esquema 1.0.0', () => {
    const initial = service.createInitialState('Estudiante Test');
    expect(initial.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(initial.alias).toBe('Estudiante Test');
    expect(initial.totalXP).toBe(0);
    expect(initial.completedLessons).toEqual([]);
    expect(initial.lessonRecords).toEqual({});
    expect(initial.labRecords).toEqual({});
  });

  it('debe persistir y recuperar el estado correctamente', () => {
    const state = service.createInitialState();
    const modified = {
      ...state,
      totalXP: 300,
      completedLessons: ['1.1', '1.2']
    };

    const saved = service.saveState(modified);
    expect(saved).toBe(true);

    const loaded = service.loadState();
    expect(loaded.totalXP).toBe(300);
    expect(loaded.completedLessons).toEqual(['1.1', '1.2']);
  });

  it('debe retornar estado inicial seguro ante JSON corrupto sin lanzar excepciones', () => {
    mockDriver.store.set(PROGRESS_STORAGE_KEY, '{malformed:json]');
    const loaded = service.loadState();
    expect(loaded.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(loaded.totalXP).toBe(0);
    expect(loaded.completedLessons).toEqual([]);
  });

  it('debe rechazar y reiniciar datos ante una version de esquema incompatible', () => {
    const incompatible = {
      schemaVersion: '2.0.0',
      alias: 'Incompatible',
      totalXP: 5000,
      completedLessons: []
    };
    mockDriver.store.set(PROGRESS_STORAGE_KEY, JSON.stringify(incompatible));

    const loaded = service.loadState();
    expect(loaded.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(loaded.totalXP).toBe(0);
  });

  it('debe retornar estado inicial seguro si el driver de almacenamiento falla o no esta disponible', () => {
    mockDriver.throwOnGet = true;
    const loaded = service.loadState();
    expect(loaded.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(loaded.totalXP).toBe(0);
  });

  it('debe manejar errores de cuota excedida retornando false sin lanzar excepciones no controladas', () => {
    mockDriver.throwOnSet = true;
    const state = service.createInitialState();
    const result = service.saveState(state);
    expect(result).toBe(false);
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
      schemaVersion: '1.0.0',
      alias: 123
    })).toBe(false);
    expect(service.isValidProgressState({
      schemaVersion: '1.0.0',
      alias: 'Cadete',
      totalXP: -10
    })).toBe(false);
    expect(service.isValidProgressState({
      schemaVersion: '1.0.0',
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
