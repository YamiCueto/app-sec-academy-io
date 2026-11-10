export type LabStatus = 'idle' | 'running' | 'completed' | 'timeout' | 'error';

export type HttpSimulatedStatus = 200 | 400 | 401 | 403 | 404 | 500;

export type LabPolicyMode =
  | 'vulnerable_no_check'
  | 'remediated_owner_check'
  | 'role_based_check';

export const MAX_INPUT_PAYLOAD_BYTES = 10240;

export const DEFAULT_WATCHDOG_TIMEOUT_MS = 2000;

export interface LabAssertionResult {
  readonly id: string;
  readonly description: string;
  readonly passed: boolean;
  readonly expected: string;
  readonly actual: string;
  readonly durationMs: number;
  readonly details?: string;
}

export interface AuthenticatedUserPayload {
  readonly id: string;
  readonly username: string;
  readonly role: 'paciente' | 'medico' | 'admin' | 'atacante';
}

export interface LabPolicyConfig {
  readonly mode: LabPolicyMode;
  readonly allowAdminBypass?: boolean;
}

export interface LabExecutionRequest {
  readonly labId: string;
  readonly authenticatedUser: AuthenticatedUserPayload;
  readonly requestedResourceId: string;
  readonly policyConfig: LabPolicyConfig;
  readonly timeoutMs?: number;
}

export interface LabExecutionResult {
  readonly labId: string;
  readonly executionId: string;
  readonly status: LabStatus;
  readonly durationMs: number;
  readonly httpStatus: HttpSimulatedStatus;
  readonly responsePayload?: unknown;
  readonly errorMessage?: string;
  readonly assertions: readonly LabAssertionResult[];
  readonly allPassed: boolean;
  readonly xpAwarded: number;
  readonly timestamp: string;
}

export interface SimulatedUserEntity {
  readonly id: string;
  readonly name: string;
  readonly role: 'paciente' | 'medico' | 'admin' | 'atacante';
}

export interface SimulatedResourceEntity {
  readonly id: string;
  readonly ownerId: string;
  readonly title: string;
  readonly sensitiveData: string;
  readonly attendingStaff: string;
}

export interface LabDefinition {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly moduleId: string;
  readonly estimatedMinutes: number;
  readonly difficulty: 'basico' | 'intermedio' | 'avanzado';
  readonly owaspCategory: string;
  readonly cweReference: string;
  readonly asvsReference: string;
  readonly description: string;
  readonly scenarioDescription: string;
  readonly simulatedEntities: {
    readonly users: readonly SimulatedUserEntity[];
    readonly resources: readonly SimulatedResourceEntity[];
  };
  readonly testSuiteDescriptions: readonly {
    readonly id: string;
    readonly description: string;
  }[];
}

export function isValidLabExecutionRequest(req: unknown): req is LabExecutionRequest {
  if (!req || typeof req !== 'object') {
    return false;
  }
  const candidate = req as Record<string, unknown>;
  if (typeof candidate['labId'] !== 'string' || candidate['labId'].trim().length === 0) {
    return false;
  }
  if (
    typeof candidate['requestedResourceId'] !== 'string' ||
    candidate['requestedResourceId'].trim().length === 0
  ) {
    return false;
  }
  const user = candidate['authenticatedUser'] as Record<string, unknown> | undefined;
  if (!user || typeof user !== 'object') {
    return false;
  }
  if (typeof user['id'] !== 'string' || typeof user['username'] !== 'string') {
    return false;
  }
  const validRoles = ['paciente', 'medico', 'admin', 'atacante'];
  if (!validRoles.includes(user['role'] as string)) {
    return false;
  }
  const policy = candidate['policyConfig'] as Record<string, unknown> | undefined;
  if (!policy || typeof policy !== 'object') {
    return false;
  }
  const validModes: LabPolicyMode[] = [
    'vulnerable_no_check',
    'remediated_owner_check',
    'role_based_check'
  ];
  if (!validModes.includes(policy['mode'] as LabPolicyMode)) {
    return false;
  }
  return true;
}
