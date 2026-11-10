import { TestBed } from '@angular/core/testing';
import {
  DEFAULT_WATCHDOG_TIMEOUT_MS,
  isValidLabExecutionRequest,
  LabExecutionRequest,
  MAX_INPUT_PAYLOAD_BYTES
} from '../../../models/lab.model';
import { InlineSandboxDriver, SANDBOX_DRIVER, WebWorkerSandboxDriver } from './sandbox-driver.token';
import { SandboxService } from './sandbox.service';

describe('SandboxService & Isolation Drivers', () => {
  let service: SandboxService;
  let driver: InlineSandboxDriver;

  beforeEach(() => {
    driver = new InlineSandboxDriver();
    TestBed.configureTestingModule({
      providers: [
        SandboxService,
        { provide: SANDBOX_DRIVER, useValue: driver }
      ]
    });
    service = TestBed.inject(SandboxService);
  });

  it('1. debe validar correctamente contratos de peticiones validas e invalidas', () => {
    const validReq: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-alice',
        username: 'alice.moreno',
        role: 'paciente'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: {
        mode: 'remediated_owner_check'
      }
    };
    expect(isValidLabExecutionRequest(validReq)).toBe(true);

    expect(isValidLabExecutionRequest(null)).toBe(false);
    expect(isValidLabExecutionRequest({})).toBe(false);
    expect(
      isValidLabExecutionRequest({
        labId: '',
        requestedResourceId: '1',
        authenticatedUser: { id: '1', username: 'u', role: 'paciente' },
        policyConfig: { mode: 'remediated_owner_check' }
      })
    ).toBe(false);
    expect(
      isValidLabExecutionRequest({
        labId: 'LAB-BAC-01',
        requestedResourceId: '1',
        authenticatedUser: { id: '1', username: 'u', role: 'rol_invalido' },
        policyConfig: { mode: 'remediated_owner_check' }
      })
    ).toBe(false);
  });

  it('2. debe resolver ejecuciones autorizadas con HTTP 200 cuando el titular solicita su propio expediente', async () => {
    const req: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-alice',
        username: 'alice.moreno',
        role: 'paciente'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: {
        mode: 'remediated_owner_check'
      }
    };

    const result = await service.execute(req);
    expect(result.status).toBe('completed');
    expect(result.httpStatus).toBe(200);
    expect(result.responsePayload).toBeTruthy();
    expect(service.status()).toBe('completed');
  });

  it('3. debe denegar el acceso con HTTP 403 Forbidden cuando un usuario solicita un expediente ajeno bajo politica remediada', async () => {
    const req: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-eve',
        username: 'eve.ramos',
        role: 'atacante'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: {
        mode: 'remediated_owner_check'
      }
    };

    const result = await service.execute(req);
    expect(result.status).toBe('completed');
    expect(result.httpStatus).toBe(403);
    expect(result.responsePayload).toBeNull();
    expect(result.errorMessage).toContain('403 Forbidden');
  });

  it('4. debe rechazar peticiones con mensajes malformados retornando error 400', async () => {
    const malformedReq = {
      labId: '',
      requestedResourceId: ''
    } as unknown as LabExecutionRequest;

    const result = await service.execute(malformedReq);
    expect(result.status).toBe('error');
    expect(result.httpStatus).toBe(400);
    expect(result.errorMessage).toContain('invalida');
  });

  it('5. debe rechazar entradas con carga util excesiva que superen el limite maximo permitido', async () => {
    const excessivePayload = 'A'.repeat(MAX_INPUT_PAYLOAD_BYTES + 100);
    const req: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-alice',
        username: excessivePayload,
        role: 'paciente'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: {
        mode: 'remediated_owner_check'
      }
    };

    const result = await service.execute(req);
    expect(result.status).toBe('error');
    expect(result.httpStatus).toBe(400);
    expect(result.errorMessage).toContain('excede el tamano maximo');
  });

  it('6. debe activar el watchdog timer retornando estado de timeout cuando la ejecucion excede el tiempo maximo', async () => {
    const req: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-alice',
        username: 'alice.moreno',
        role: 'paciente'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: {
        mode: 'remediated_owner_check'
      },
      timeoutMs: 5
    };

    const result = await service.execute(req);
    expect(result.status).toBe('timeout');
    expect(result.errorMessage).toContain('Watchdog');
  });

  it('7. debe terminar limpiamente la ejecucion y restablecer el estado al invocar terminate() y reset()', () => {
    service.reset();
    expect(service.status()).toBe('idle');
    expect(service.lastResult()).toBeNull();
    expect(service.isRunning()).toBe(false);

    service.terminate();
    expect(service.status()).toBe('idle');
  });

  it('8. debe producir resultados estrictamente deterministas ante peticiones identicas consecutivas', async () => {
    const req: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-bob',
        username: 'bob.delgado',
        role: 'paciente'
      },
      requestedResourceId: 'med-rec-002',
      policyConfig: {
        mode: 'remediated_owner_check'
      }
    };

    const res1 = await service.execute(req);
    const res2 = await service.execute(req);

    expect(res1.httpStatus).toBe(res2.httpStatus);
    expect(res1.allPassed).toBe(res2.allPassed);
    expect(res1.xpAwarded).toBe(res2.xpAwarded);
  });

  it('9. debe validar que WebWorkerSandboxDriver rechace peticiones malformadas o excesivas de inmediato', async () => {
    const workerDriver = new WebWorkerSandboxDriver();
    const malformed = { labId: '' } as unknown as LabExecutionRequest;
    const res = await workerDriver.execute(malformed);
    expect(res.status).toBe('error');
    expect(res.httpStatus).toBe(400);

    const excessive: LabExecutionRequest = {
      labId: 'LAB-BAC-01',
      authenticatedUser: {
        id: 'usr-alice',
        username: 'B'.repeat(MAX_INPUT_PAYLOAD_BYTES + 50),
        role: 'paciente'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: { mode: 'remediated_owner_check' }
    };
    const resExcess = await workerDriver.execute(excessive);
    expect(resExcess.status).toBe('error');
    expect(resExcess.httpStatus).toBe(400);
    expect(resExcess.errorMessage).toContain('excede el tamano maximo');
  });
});
