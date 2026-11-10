import { inject, Injectable } from '@angular/core';
import {
  LabDefinition,
  LabExecutionRequest,
  LabExecutionResult,
  LabPolicyMode
} from '../../../models/lab.model';
import { ProgressStore } from '../../stores/progress.store';
import { SIMULATED_RESOURCES, SIMULATED_USERS } from '../sandbox/bac-simulator';
import { SandboxService } from '../sandbox/sandbox.service';

export const LAB_BAC_01_DEFINITION: LabDefinition = {
  id: 'LAB-BAC-01',
  code: 'BAC-01',
  title: 'Control de Acceso y Remediación IDOR en API',
  moduleId: 'm01',
  estimatedMinutes: 20,
  difficulty: 'basico',
  owaspCategory: 'A01:2021 — Broken Access Control',
  cweReference: 'CWE-284 / CWE-862 / CWE-639',
  asvsReference: 'ASVS v4.0.3 V4 / V5',
  description:
    'Entorno interactivo para auditar el control de acceso a expedientes clínicos y mitigar vectores IDOR aplicando el principio de Deny by Default.',
  scenarioDescription:
    'Una API médica expone la consulta de expedientes mediante el identificador /api/pacientes/:id/expediente. El sistema carece de validación de tenencia en la configuración por defecto, permitiendo que cualquier paciente consulte historiales confidenciales ajenos.',
  simulatedEntities: {
    users: SIMULATED_USERS,
    resources: SIMULATED_RESOURCES
  },
  testSuiteDescriptions: [
    {
      id: 'assert-1',
      description:
        'Aserción 1: Acceso Legítimo — Usuario titular consulta su propio expediente médico (200 OK)'
    },
    {
      id: 'assert-2',
      description:
        'Aserción 2: Ataque Horizontal Neutralizado — Atacante autenticado intenta leer expediente ajeno (403 Forbidden)'
    },
    {
      id: 'assert-3',
      description:
        'Aserción 3: Aislamiento entre Pacientes — Consulta cruzada entre usuarios ordinarios bloqueada (403 Forbidden)'
    },
    {
      id: 'assert-4',
      description:
        'Aserción 4: Denegación por Defecto — Solicitud de recurso inexistente rechazada sin fugas (404 Not Found)'
    },
    {
      id: 'assert-5',
      description:
        'Aserción 5: Distinción Autenticación vs Autorización — Identidad válida no otorga acceso universal (403 Forbidden)'
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class LabEngineService {
  private readonly sandbox = inject(SandboxService);
  private readonly progressStore = inject(ProgressStore);

  private readonly registry: Readonly<Record<string, LabDefinition>> = {
    'LAB-BAC-01': LAB_BAC_01_DEFINITION,
    'lab-bac-01': LAB_BAC_01_DEFINITION
  };

  getLabDefinition(labId: string): LabDefinition | null {
    const key = labId.trim();
    return this.registry[key] ?? null;
  }

  async executeSingleRequest(request: LabExecutionRequest): Promise<LabExecutionResult> {
    return this.sandbox.execute(request);
  }

  async runTestSuite(
    labId: string,
    mode: LabPolicyMode
  ): Promise<LabExecutionResult> {
    const definition = this.getLabDefinition(labId);
    if (!definition) {
      return {
        labId,
        executionId: 'notfound-' + Date.now(),
        status: 'error',
        durationMs: 0,
        httpStatus: 404,
        errorMessage: `Laboratorio con id "${labId}" no encontrado en el catalogo`,
        assertions: [],
        allPassed: false,
        xpAwarded: 0,
        timestamp: new Date().toISOString()
      };
    }

    const request: LabExecutionRequest = {
      labId: definition.id,
      authenticatedUser: {
        id: 'usr-eve',
        username: 'eve.ramos',
        role: 'atacante'
      },
      requestedResourceId: 'med-rec-001',
      policyConfig: { mode }
    };

    const result = await this.sandbox.execute(request);

    if (result.allPassed) {
      this.progressStore.recordLabAttempt({
        labId: definition.id,
        success: true,
        score: 100
      });
    } else {
      this.progressStore.recordLabAttempt({
        labId: definition.id,
        success: false,
        score: 0
      });
    }

    return result;
  }

  resetLab(): void {
    this.sandbox.reset();
  }
}
