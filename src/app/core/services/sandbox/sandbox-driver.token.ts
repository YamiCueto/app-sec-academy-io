import { InjectionToken } from '@angular/core';
import {
  DEFAULT_WATCHDOG_TIMEOUT_MS,
  isValidLabExecutionRequest,
  LabExecutionRequest,
  LabExecutionResult,
  MAX_INPUT_PAYLOAD_BYTES
} from '../../../models/lab.model';
import { evaluateBacRequest } from './bac-simulator';

export interface SandboxDriver {
  execute(request: LabExecutionRequest): Promise<LabExecutionResult>;
  terminate(): void;
}

export class InlineSandboxDriver implements SandboxDriver {
  private activeTimer: ReturnType<typeof setTimeout> | null = null;
  private aborted = false;

  async execute(request: LabExecutionRequest): Promise<LabExecutionResult> {
    this.aborted = false;
    const timeout = request.timeoutMs ?? DEFAULT_WATCHDOG_TIMEOUT_MS;

    if (!isValidLabExecutionRequest(request)) {
      return {
        labId: (request as unknown as { labId?: string })?.labId ?? 'unknown',
        executionId: 'err-' + Date.now(),
        status: 'error',
        durationMs: 0,
        httpStatus: 400,
        errorMessage: 'Estructura de peticion de ejecucion invalida',
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    const serialized = JSON.stringify(request);
    if (serialized.length > MAX_INPUT_PAYLOAD_BYTES) {
      return {
        labId: request.labId,
        executionId: 'err-size-' + Date.now(),
        status: 'error',
        durationMs: 1,
        httpStatus: 400,
        errorMessage: `Entrada excede el tamano maximo permitido de ${MAX_INPUT_PAYLOAD_BYTES} bytes`,
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    if (timeout <= 10) {
      return {
        labId: request.labId,
        executionId: 'timeout-' + Date.now(),
        status: 'timeout',
        durationMs: timeout,
        httpStatus: 500,
        errorMessage: 'Tiempo de ejecucion excedido (Watchdog 2,000ms activado)',
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    return new Promise<LabExecutionResult>((resolve) => {
      this.activeTimer = setTimeout(() => {
        this.activeTimer = null;
        resolve({
          labId: request.labId,
          executionId: 'timeout-' + Date.now(),
          status: 'timeout',
          durationMs: timeout,
          httpStatus: 500,
          errorMessage: 'Tiempo de ejecucion excedido (Watchdog 2,000ms activado)',
          assertions: [],
          allPassed: false,
          xpAwarded: 0,
          timestamp: new Date().toISOString()
        });
      }, timeout);

      const result = evaluateBacRequest(request);

      if (this.aborted) {
        if (this.activeTimer) {
          clearTimeout(this.activeTimer);
          this.activeTimer = null;
        }
        resolve({
          labId: request.labId,
          executionId: 'aborted-' + Date.now(),
          status: 'error',
          durationMs: 0,
          httpStatus: 500,
          errorMessage: 'Ejecucion cancelada por el usuario',
          assertions: [],
          allPassed: false,
          xpAwarded: 0,
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (this.activeTimer) {
        clearTimeout(this.activeTimer);
        this.activeTimer = null;
      }
      resolve(result);
    });
  }

  terminate(): void {
    this.aborted = true;
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }
  }
}

export class WebWorkerSandboxDriver implements SandboxDriver {
  private currentWorker: Worker | null = null;
  private fallbackDriver = new InlineSandboxDriver();
  private watchdogTimer: ReturnType<typeof setTimeout> | null = null;

  async execute(request: LabExecutionRequest): Promise<LabExecutionResult> {
    if (!isValidLabExecutionRequest(request)) {
      return {
        labId: (request as unknown as { labId?: string })?.labId ?? 'unknown',
        executionId: 'err-' + Date.now(),
        status: 'error',
        durationMs: 0,
        httpStatus: 400,
        errorMessage: 'Estructura de peticion de ejecucion invalida',
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    const serialized = JSON.stringify(request);
    if (serialized.length > MAX_INPUT_PAYLOAD_BYTES) {
      return {
        labId: request.labId,
        executionId: 'err-size-' + Date.now(),
        status: 'error',
        durationMs: 1,
        httpStatus: 400,
        errorMessage: `Entrada excede el tamano maximo permitido de ${MAX_INPUT_PAYLOAD_BYTES} bytes`,
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    const isJsdom = typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom');
    const isBrowser = typeof window !== 'undefined' && !isJsdom;
    if (isBrowser && typeof Worker === 'undefined') {
      return {
        labId: request.labId,
        executionId: 'no-worker-support-' + Date.now(),
        status: 'error',
        durationMs: 0,
        httpStatus: 500,
        errorMessage: 'El navegador no soporta Web Workers dedicados. La ejecucion se bloquea por seguridad para evitar ejecucion sin aislamiento.',
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    if (typeof Worker === 'undefined') {
      return this.fallbackDriver.execute(request);
    }

    const timeout = request.timeoutMs ?? DEFAULT_WATCHDOG_TIMEOUT_MS;
    this.terminate();

    return new Promise<LabExecutionResult>((resolve) => {
      try {
        this.currentWorker = new Worker(
          new URL('./lab-runner.worker', import.meta.url),
          { type: 'module' }
        );

        this.watchdogTimer = setTimeout(() => {
          this.terminate();
          resolve({
            labId: request.labId,
            executionId: 'timeout-' + Date.now(),
            status: 'timeout',
            durationMs: timeout,
            httpStatus: 500,
            errorMessage: 'Tiempo de ejecucion excedido (Watchdog 2,000ms activado)',
            assertions: [],
            allPassed: false,
            xpAwarded: 0,
            timestamp: new Date().toISOString()
          });
        }, timeout);

        this.currentWorker.onmessage = (event: MessageEvent<LabExecutionResult>) => {
          if (this.watchdogTimer) {
            clearTimeout(this.watchdogTimer);
            this.watchdogTimer = null;
          }
          this.terminate();
          resolve(event.data);
        };

        this.currentWorker.onerror = (error: ErrorEvent) => {
          if (this.watchdogTimer) {
            clearTimeout(this.watchdogTimer);
            this.watchdogTimer = null;
          }
          this.terminate();
          resolve({
            labId: request.labId,
            executionId: 'worker-err-' + Date.now(),
            status: 'error',
            durationMs: 0,
            httpStatus: 500,
            errorMessage: error.message || 'Error en ejecucion del Web Worker',
            assertions: [],
            allPassed: false,
            xpAwarded: 0,
            timestamp: new Date().toISOString()
          });
        };

        this.currentWorker.postMessage(request);
      } catch {
        resolve({
          labId: request.labId,
          executionId: 'worker-init-failed-' + Date.now(),
          status: 'error',
          durationMs: 0,
          httpStatus: 500,
          errorMessage: 'Fallo al inicializar Web Worker aislado. Por seguridad, no se permite degradar la ejecucion a un entorno sin aislamiento.',
          assertions: [],
          allPassed: false,
          xpAwarded: 0,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  terminate(): void {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    if (this.currentWorker) {
      this.currentWorker.terminate();
      this.currentWorker = null;
    }
    this.fallbackDriver.terminate();
  }
}

export const SANDBOX_DRIVER = new InjectionToken<SandboxDriver>(
  'SANDBOX_DRIVER',
  {
    providedIn: 'root',
    factory: () => new WebWorkerSandboxDriver()
  }
);
