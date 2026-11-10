import {
  AuthenticatedUserPayload,
  HttpSimulatedStatus,
  LabAssertionResult,
  LabExecutionRequest,
  LabExecutionResult,
  MAX_INPUT_PAYLOAD_BYTES,
  SimulatedResourceEntity,
  SimulatedUserEntity
} from '../../../models/lab.model';

export const SIMULATED_USERS: readonly SimulatedUserEntity[] = [
  { id: 'usr-alice', name: 'Alice Moreno', role: 'paciente' },
  { id: 'usr-bob', name: 'Bob Delgado', role: 'paciente' },
  { id: 'usr-eve', name: 'Eve Ramos (Atacante)', role: 'atacante' },
  { id: 'usr-admin', name: 'Dra. Carmen Soto', role: 'admin' }
];

export const SIMULATED_RESOURCES: readonly SimulatedResourceEntity[] = [
  {
    id: 'med-rec-001',
    ownerId: 'usr-alice',
    title: 'Expediente Clínico #001 — Historial Dermatológico y Alergias',
    sensitiveData:
      'Diagnóstico: Alergia severa confirmada a penicilina y sulfonamidas. Tratamiento reservado en curso.',
    attendingStaff: 'Dra. Carmen Soto'
  },
  {
    id: 'med-rec-002',
    ownerId: 'usr-bob',
    title: 'Expediente Clínico #002 — Chequeo Cardiológico Preventivo',
    sensitiveData:
      'Diagnóstico: Monitoreo de presión arterial e informe confidencial de manejo de estrés laboral.',
    attendingStaff: 'Dr. Alejandro Gómez'
  },
  {
    id: 'med-rec-003',
    ownerId: 'usr-eve',
    title: 'Expediente Clínico #003 — Evaluación Oftalmológica Rutinaria',
    sensitiveData:
      'Diagnóstico: Agudeza visual estándar 20/20. Sin observaciones patológicas.',
    attendingStaff: 'Dra. Carmen Soto'
  }
];

export function executeSingleSimulation(
  user: AuthenticatedUserPayload,
  resourceId: string,
  mode: 'vulnerable_no_check' | 'remediated_owner_check' | 'role_based_check'
): { status: HttpSimulatedStatus; payload: unknown; message: string } {
  const resource = SIMULATED_RESOURCES.find((r) => r.id === resourceId);

  if (!resource) {
    return {
      status: 404,
      payload: null,
      message: 'Recurso no encontrado en el sistema hospitalario'
    };
  }

  if (mode === 'vulnerable_no_check') {
    return {
      status: 200,
      payload: {
        id: resource.id,
        propietario: resource.ownerId,
        titulo: resource.title,
        datosClinicosConfidenciales: resource.sensitiveData,
        medicoTratante: resource.attendingStaff
      },
      message:
        'Lectura completada sin verificación de propiedad (IDOR vulnerable activo)'
    };
  }

  const isOwner = resource.ownerId === user.id;
  const isAdmin = user.role === 'admin';

  if (isOwner || isAdmin) {
    return {
      status: 200,
      payload: {
        id: resource.id,
        propietario: resource.ownerId,
        titulo: resource.title,
        datosClinicosConfidenciales: resource.sensitiveData,
        medicoTratante: resource.attendingStaff
      },
      message: 'Acceso autorizado concedido por verificación estricta de tenencia'
    };
  }

  return {
    status: 403,
    payload: null,
    message:
      '403 Forbidden — Acceso denegado: el sujeto autenticado no es el propietario del recurso solicitado (OWASP A01 / CWE-284)'
  };
}

export function runBacTestSuite(
  mode: 'vulnerable_no_check' | 'remediated_owner_check' | 'role_based_check'
): LabAssertionResult[] {
  const alice: AuthenticatedUserPayload = {
    id: 'usr-alice',
    username: 'alice.moreno',
    role: 'paciente'
  };
  const bob: AuthenticatedUserPayload = {
    id: 'usr-bob',
    username: 'bob.delgado',
    role: 'paciente'
  };
  const eve: AuthenticatedUserPayload = {
    id: 'usr-eve',
    username: 'eve.ramos',
    role: 'atacante'
  };

  const start1 = performance.now();
  const test1 = executeSingleSimulation(alice, 'med-rec-001', mode);
  const dur1 = Math.max(1, Math.round(performance.now() - start1));
  const t1Passed = test1.status === 200 && test1.payload !== null;

  const start2 = performance.now();
  const test2 = executeSingleSimulation(eve, 'med-rec-001', mode);
  const dur2 = Math.max(1, Math.round(performance.now() - start2));
  const t2Passed = test2.status === 403 && test2.payload === null;

  const start3 = performance.now();
  const test3 = executeSingleSimulation(bob, 'med-rec-003', mode);
  const dur3 = Math.max(1, Math.round(performance.now() - start3));
  const t3Passed = test3.status === 403 && test3.payload === null;

  const start4 = performance.now();
  const test4 = executeSingleSimulation(alice, 'med-rec-999', mode);
  const dur4 = Math.max(1, Math.round(performance.now() - start4));
  const t4Passed = test4.status === 404;

  const start5 = performance.now();
  const test5 = executeSingleSimulation(eve, 'med-rec-002', mode);
  const dur5 = Math.max(1, Math.round(performance.now() - start5));
  const t5Passed = test5.status === 403;

  return [
    {
      id: 'assert-1',
      description:
        'Aserción 1: Acceso Legítimo — Usuario titular consulta su propio expediente médico',
      passed: t1Passed,
      expected: 'HTTP 200 OK con entrega de expediente propio',
      actual: `HTTP ${test1.status} (${test1.message})`,
      durationMs: dur1,
      details:
        'Alice consulta med-rec-001. La política debe autorizar la operación legítima.'
    },
    {
      id: 'assert-2',
      description:
        'Aserción 2: Ataque Horizontal Neutralizado — Atacante autenticado intenta leer expediente ajeno (IDOR)',
      passed: t2Passed,
      expected: 'HTTP 403 Forbidden y bloqueo absoluto de datos sensibles',
      actual: `HTTP ${test2.status} (${test2.message})`,
      durationMs: dur2,
      details:
        'Eve (autenticada) intenta consultar med-rec-001 de Alice. Bajo modo remediado debe denegarse con 403.'
    },
    {
      id: 'assert-3',
      description:
        'Aserción 3: Aislamiento entre Pacientes — Consulta cruzada entre usuarios del mismo nivel de rol',
      passed: t3Passed,
      expected: 'HTTP 403 Forbidden sin fuga de información',
      actual: `HTTP ${test3.status} (${test3.message})`,
      durationMs: dur3,
      details:
        'Bob intenta acceder al registro de Eve. Dos usuarios del mismo rol no deben acceder a datos entre sí.'
    },
    {
      id: 'assert-4',
      description:
        'Aserción 4: Denegación por Defecto — Solicitud de recurso inexistente manejada limpiamente',
      passed: t4Passed,
      expected: 'HTTP 404 Not Found sin exposición de stack trace ni fugas internas',
      actual: `HTTP ${test4.status} (${test4.message})`,
      durationMs: dur4,
      details:
        'Consulta sobre identificador inexistente med-rec-999 debe ser manejada sin errores no controlados.'
    },
    {
      id: 'assert-5',
      description:
        'Aserción 5: Distinción Autenticación vs Autorización — Token válido no implica acceso indiscriminado',
      passed: t5Passed,
      expected: 'HTTP 403 Forbidden — Identidad confirmada pero permiso sobre objeto denegado',
      actual: `HTTP ${test5.status} (${test5.message})`,
      durationMs: dur5,
      details:
        'Demuestra que la autenticación solo verifica identidad; el punto de decisión de políticas (PDP) debe validar tenencia.'
    }
  ];
}

export function evaluateBacRequest(request: LabExecutionRequest): LabExecutionResult {
  const startTime = performance.now();
  const serialized = JSON.stringify(request);
  if (serialized.length > MAX_INPUT_PAYLOAD_BYTES) {
    return {
      labId: request.labId,
      executionId: 'exec-' + Date.now(),
      status: 'error',
      durationMs: 1,
      httpStatus: 400,
      errorMessage: `Carga útil excede el límite máximo de ${MAX_INPUT_PAYLOAD_BYTES} bytes`,
      assertions: [],
      allPassed: false,
      xpAwarded: 0,
      timestamp: new Date().toISOString()
    };
  }

  const singleResult = executeSingleSimulation(
    request.authenticatedUser,
    request.requestedResourceId,
    request.policyConfig.mode
  );

  const assertions = runBacTestSuite(request.policyConfig.mode);
  const allPassed = assertions.length > 0 && assertions.every((a) => a.passed);
  const durationMs = Math.max(1, Math.round(performance.now() - startTime));

  return {
    labId: request.labId,
    executionId: 'exec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    status: 'completed',
    durationMs,
    httpStatus: singleResult.status,
    responsePayload: singleResult.payload,
    errorMessage: singleResult.status >= 400 ? singleResult.message : undefined,
    assertions,
    allPassed,
    xpAwarded: allPassed ? 100 : 0,
    timestamp: new Date().toISOString()
  };
}
