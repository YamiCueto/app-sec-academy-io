import { computed, inject, Injectable, signal } from '@angular/core';
import {
  LabExecutionRequest,
  LabExecutionResult,
  LabStatus
} from '../../../models/lab.model';
import { SANDBOX_DRIVER } from './sandbox-driver.token';

@Injectable({
  providedIn: 'root'
})
export class SandboxService {
  private readonly driver = inject(SANDBOX_DRIVER);

  private readonly _status = signal<LabStatus>('idle');
  private readonly _lastResult = signal<LabExecutionResult | null>(null);

  readonly status = this._status.asReadonly();
  readonly lastResult = this._lastResult.asReadonly();
  readonly isRunning = computed(() => this._status() === 'running');

  async execute(request: LabExecutionRequest): Promise<LabExecutionResult> {
    this._status.set('running');
    try {
      const result = await this.driver.execute(request);
      this._status.set(result.status);
      this._lastResult.set(result);
      return result;
    } catch (err) {
      const errorResult: LabExecutionResult = {
        labId: request.labId,
        executionId: 'catch-' + Date.now(),
        status: 'error',
        durationMs: 0,
        httpStatus: 500,
        errorMessage: err instanceof Error ? err.message : 'Error inesperado en Sandbox',
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
      this._status.set('error');
      this._lastResult.set(errorResult);
      return errorResult;
    }
  }

  terminate(): void {
    this.driver.terminate();
    if (this._status() === 'running') {
      this._status.set('idle');
    }
  }

  reset(): void {
    this.terminate();
    this._status.set('idle');
    this._lastResult.set(null);
  }
}
