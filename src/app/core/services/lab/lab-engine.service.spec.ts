import { TestBed } from '@angular/core/testing';
import { StorageDriver, STORAGE_DRIVER } from '../storage/storage-driver.token';
import { StorageService } from '../storage/storage.service';
import { ProgressStore } from '../../stores/progress.store';
import { InlineSandboxDriver, SANDBOX_DRIVER } from '../sandbox/sandbox-driver.token';
import { SandboxService } from '../sandbox/sandbox.service';
import { LabEngineService } from './lab-engine.service';

class MockStorageDriver implements StorageDriver {
  store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

describe('LabEngineService & ProgressStore Integration', () => {
  let labEngine: LabEngineService;
  let progressStore: ProgressStore;
  let mockStorage: MockStorageDriver;

  beforeEach(() => {
    mockStorage = new MockStorageDriver();
    TestBed.configureTestingModule({
      providers: [
        LabEngineService,
        SandboxService,
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockStorage },
        { provide: SANDBOX_DRIVER, useClass: InlineSandboxDriver }
      ]
    });

    labEngine = TestBed.inject(LabEngineService);
    progressStore = TestBed.inject(ProgressStore);
  });

  it('1. debe resolver la definicion completa del laboratorio LAB-BAC-01', () => {
    const def = labEngine.getLabDefinition('LAB-BAC-01');
    expect(def).toBeTruthy();
    expect(def?.code).toBe('BAC-01');
    expect(def?.simulatedEntities.users.length).toBe(4);
    expect(def?.simulatedEntities.resources.length).toBe(3);
    expect(def?.testSuiteDescriptions.length).toBe(5);

    const aliasDef = labEngine.getLabDefinition('lab-bac-01');
    expect(aliasDef?.id).toBe('LAB-BAC-01');

    const notFound = labEngine.getLabDefinition('lab-inexistente');
    expect(notFound).toBeNull();
  });

  it('2. debe ejecutar la suite en modo vulnerable detectando fallas de seguridad y sin otorgar XP', async () => {
    const initialXP = progressStore.totalXP();
    const result = await labEngine.runTestSuite('LAB-BAC-01', 'vulnerable_no_check');

    expect(result.status).toBe('completed');
    expect(result.allPassed).toBe(false);
    expect(result.xpAwarded).toBe(0);

    const horizontalAttackAssert = result.assertions.find((a) => a.id === 'assert-2');
    expect(horizontalAttackAssert?.passed).toBe(false);

    const labRecord = progressStore.labRecords()['LAB-BAC-01'];
    expect(labRecord).toBeTruthy();
    expect(labRecord.passed).toBe(false);
    expect(progressStore.totalXP()).toBe(initialXP);
  });

  it('3. debe ejecutar la suite en modo remediado aprobando todas las aserciones y otorgando 100 XP', async () => {
    const initialXP = progressStore.totalXP();
    const result = await labEngine.runTestSuite('LAB-BAC-01', 'remediated_owner_check');

    expect(result.status).toBe('completed');
    expect(result.allPassed).toBe(true);
    expect(result.xpAwarded).toBe(100);
    expect(result.assertions.every((a) => a.passed)).toBe(true);

    const labRecord = progressStore.labRecords()['LAB-BAC-01'];
    expect(labRecord).toBeTruthy();
    expect(labRecord.passed).toBe(true);
    expect(labRecord.score).toBe(100);
    expect(progressStore.totalXP()).toBe(initialXP + 100);
  });

  it('4. debe prevenir la duplicacion de XP en reintentos exitosos consecutivos del mismo laboratorio', async () => {
    const initialXP = progressStore.totalXP();

    await labEngine.runTestSuite('LAB-BAC-01', 'remediated_owner_check');
    const xpAfterFirstPass = progressStore.totalXP();
    expect(xpAfterFirstPass).toBe(initialXP + 100);

    await labEngine.runTestSuite('LAB-BAC-01', 'remediated_owner_check');
    const xpAfterSecondPass = progressStore.totalXP();
    expect(xpAfterSecondPass).toBe(xpAfterFirstPass);
  });

  it('5. debe manejar errores controlados si se solicita una suite para un laboratorio inexistente', async () => {
    const result = await labEngine.runTestSuite('LAB-DESCONOCIDO', 'remediated_owner_check');
    expect(result.status).toBe('error');
    expect(result.httpStatus).toBe(404);
  });
});
