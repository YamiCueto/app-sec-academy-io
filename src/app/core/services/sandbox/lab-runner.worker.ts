import { isValidLabExecutionRequest } from '../../../models/lab.model';
import { evaluateBacRequest } from './bac-simulator';

interface WorkerScope {
  fetch?: unknown;
  XMLHttpRequest?: unknown;
  WebSocket?: unknown;
  EventSource?: unknown;
  addEventListener(type: string, listener: (event: { data: unknown }) => void): void;
  postMessage(message: unknown): void;
}

const workerScope = self as unknown as WorkerScope;

workerScope.fetch = undefined;
workerScope.XMLHttpRequest = undefined;
workerScope.WebSocket = undefined;
workerScope.EventSource = undefined;

workerScope.addEventListener('message', (event: { data: unknown }) => {
  const data = event.data;
  if (!isValidLabExecutionRequest(data)) {
    workerScope.postMessage({
      labId: 'unknown',
      executionId: 'err-' + Date.now(),
      status: 'error',
      durationMs: 0,
      httpStatus: 400,
      errorMessage: 'Estructura de mensaje invalida o no conforme con el contrato de laboratorio',
      assertions: [],
      allPassed: false,
      xpAwarded: 0,
      timestamp: new Date().toISOString()
    });
    return;
  }

  const result = evaluateBacRequest(data);
  workerScope.postMessage(result);
});
