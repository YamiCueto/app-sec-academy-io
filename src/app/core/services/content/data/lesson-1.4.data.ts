import { LessonDetail } from '../../../../models/content.model';

export const LESSON_1_4_DATA: LessonDetail = {
  id: '1.4',
  moduleId: 'm01',
  title: 'OWASP ASVS y Verificación de Seguridad',
  order: 4,
  estimatedMinutes: 30,
  difficulty: 'basico',
  standards: {
    owasp: ['OWASP ASVS v4.0.3', 'OWASP Top 10:2021', 'OWASP SAMM v2.0.1'],
    cwe: ['CWE-1008', 'CWE-1025'],
    asvs: ['ASVS v4.0.3 V1', 'ASVS v4.0.3 V4', 'ASVS v4.0.3 V5', 'ASVS v4.0.3 V7'],
    nist: ['NIST SP 800-115']
  },
  sections: {
    introduction:
      'Garantizar la seguridad del software en producción requiere ir más allá de la concientización general sobre riesgos: exige requisitos de ingeniería normativos, precisos y formalmente verificables. El estándar OWASP ASVS (Application Security Verification Standard v4.0.3) constituye el marco de referencia internacional para definir los controles técnicos que debe poseer una aplicación y las pruebas que deben ejecutarse para verificar su cumplimiento. Mientras que el OWASP Top 10 identifica los diez riesgos de mayor incidencia industrial, ASVS proporciona una taxonomía exhaustiva de criterios de aceptación de seguridad estructurados por niveles de aseguramiento, facilitando la integración de pruebas automatizadas y revisiones de código en el ciclo de vida del software.',
    objectives: [
      'Comprender el propósito, la estructura capitular y el modelo de verificación del estándar OWASP ASVS v4.0.3.',
      'Diferenciar con rigor técnico los tres niveles de aseguramiento de seguridad de ASVS (Nivel 1 Oportunista, Nivel 2 Estándar y Nivel 3 Avanzado/Crítico).',
      'Distinguir el rol formativo del OWASP Top 10 frente al rol prescriptivo y verificable de OWASP ASVS.',
      'Definir criterios de aceptación de seguridad comprobables mediante pruebas unitarias e integración positivas y negativas en Spring Boot y Angular.',
      'Establecer la trazabilidad entre requisitos normativos, modelos de amenazas, controles técnicos y compuertas de calidad (Quality Gates) en pipelines CI/CD.'
    ],
    conceptualExplanation: {
      markdown:
        'El estándar OWASP ASVS v4.0.3 define los requisitos técnicos de seguridad mediante catorce capítulos temáticos (V1 Arquitectura y Modelado de Amenazas, V2 Autenticación, V3 Gestión de Sesiones, V4 Control de Acceso, V5 Manejo y Validación de Entrada, V7 Manejo de Errores y Logging, V14 Configuración, entre otros). Cada requisito se formula como una aserción técnica verificable y comprobable de manera reproducible.\n\nASVS clasifica las aplicaciones en tres niveles de aseguramiento progresivo:\n1. Nivel 1 (L1) — Oportunista: Nivel base aplicable a todo software. Diseñado para resistir ataques automatizados y oportunistas. Sus requisitos pueden ser verificados completamente mediante pruebas de caja negra (sin acceso al código fuente), análisis DAST y revisiones básicas de penetración.\n2. Nivel 2 (L2) — Estándar: Requisito indispensable para aplicaciones empresariales que procesan transacciones de negocio sensibles, información personal identificable (PII), registros médicos o datos financieros. Exige acceso al código fuente, documentación de arquitectura y pruebas guiadas (caja híbrida o blanca: SAST, pruebas unitarias y de integración de seguridad).\n3. Nivel 3 (L3) — Avanzado: Nivel reservado para sistemas de misión crítica, infraestructura esencial, salud vital o sistemas financieros centrales. Demanda verificaciones formales, análisis exhaustivo de modularidad, defensa en profundidad sin dependencias de una sola capa y auditorías arquitectónicas completas.\n\nLa distinción entre OWASP Top 10 y ASVS es determinante: el Top 10 no es un estándar de pruebas ni un checklist de aceptación; es una guía de priorización de riesgos para generar conciencia. ASVS, en cambio, es la especificación técnica prescriptiva que permite redactar criterios de aceptación de seguridad (Security Acceptance Criteria) en historias de usuario.\n\nPara verificar estos requisitos, la ingeniería de pruebas de seguridad debe ejecutar pruebas duales:\n- Pruebas Positivas: Validan que el usuario legítimo pueda realizar las operaciones autorizadas bajo condiciones nominales.\n- Pruebas Negativas: Comprueban deliberadamente que el sistema rechaza de forma determinista peticiones sin autenticación (401), accesos entre inquilinos o registros ajenos (403), entradas malformadas o que exceden los límites especificados (400) y que los fallos no exponen trazas internas de la aplicación (ASVS V7.1.1).',
      keyPoints: [
        'OWASP ASVS v4.0.3 provee requisitos técnicos estructurados y verificables a través de 14 dominios de seguridad.',
        'ASVS Nivel 1 es verificable por caja negra; Nivel 2 exige acceso a código fuente y arquitectura para datos sensibles; Nivel 3 aplica a infraestructura crítica.',
        'OWASP Top 10 es una guía de priorización y alerta; ASVS es un catálogo exhaustivo de requisitos y aceptación técnica.',
        'Los criterios de aceptación de seguridad deben ser medibles, comprobables y estar incorporados en las historias de usuario.',
        'La verificación rigurosa exige pruebas negativas sistemáticas: validar que los comportamientos no permitidos sean rechazados con códigos adecuados.',
        'Las compuertas de calidad (Quality Gates) en CI/CD impiden el despliegue cuando fallan las pruebas de verificación de seguridad.'
      ]
    },
    technicalExamples: [
      {
        language: 'java',
        title: 'Verificación Automatizada de Requisitos ASVS V4.1 y V5.1 con Spring Boot y MockMvc',
        vulnerableFilename: 'AccountControllerHappyPathOnlyTest.java',
        vulnerableSnippet: `package io.appsec.banking.test;

import io.appsec.banking.controller.AccountController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
public class AccountControllerHappyPathOnlyTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAccountHappyPath() throws Exception {
        mockMvc.perform(get("/api/v1/accounts/101")
                .header("X-Simulated-User", "user-101"))
                .andExpect(status().isOk());
    }
}`,
        vulnerableExplanation:
          'Suite deficiente que únicamente prueba el escenario nominal positivo (código 200 OK con datos válidos). No ejecuta pruebas negativas para comprobar si una solicitud anónima es rechazada (401), si el acceso cruzado a otra cuenta es bloqueado (403) o si entradas malformadas son contenidas.',
        remediatedFilename: 'AccountSecurityVerificationTest.java',
        remediatedSnippet: `package io.appsec.banking.test;

import io.appsec.banking.controller.AccountController;
import io.appsec.banking.service.AccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
public class AccountSecurityVerificationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AccountService accountService;

    @Test
    public void shouldRejectUnauthenticatedRequestWith401() throws Exception {
        mockMvc.perform(get("/api/v1/accounts/101"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "attacker_user", roles = {"USER"})
    public void shouldRejectCrossTenantAccessWith403AsPerASVS_V4_1() throws Exception {
        mockMvc.perform(get("/api/v1/accounts/other-tenant-account"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "legitimate_user", roles = {"USER"})
    public void shouldRejectMalformedAccountIdWith400AsPerASVS_V5_1() throws Exception {
        mockMvc.perform(get("/api/v1/accounts/invalid--format--$$$"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.stackTrace").doesNotExist());
    }
}`,
        remediatedExplanation:
          'Suite rigurosa de verificación de seguridad con pruebas negativas exhaustivas alineadas a ASVS V4.1 (Control de Acceso) y V5.1 (Validación de Entrada). Comprueba de forma determinista el rechazo con 401, 403 y 400 y verifica la ausencia de fugas de trazas internas (ASVS V7.1).'
      },
      {
        language: 'typescript',
        title: 'Validación Contractual y Pruebas Negativas de Interfaz en Angular',
        vulnerableFilename: 'payment-form.component.vulnerable.ts',
        vulnerableSnippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-form',
  template: \`
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="accountNumber" name="acc" />
      <input [(ngModel)]="amount" name="amount" />
      <button type="submit">Transferir</button>
    </form>
  \`
})
export class PaymentFormComponent {
  accountNumber = '';
  amount = '';

  submit(): void {
    fetch('/api/v1/pay', {
      method: 'POST',
      body: JSON.stringify({ account: this.accountNumber, amount: this.amount })
    });
  }
}`,
        vulnerableExplanation:
          'El formulario envía entradas de usuario directamente a la API sin validación previa de formato, longitud ni rango en el cliente, permitiendo el envío de cargas vacías o tipos inconsistentes y careciendo de pruebas automatizadas sobre estados no válidos.',
        remediatedFilename: 'payment-form.component.remediated.ts',
        remediatedSnippet: `import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()">
      <input formControlName="targetAccount" placeholder="IBAN o Cuenta" />
      <input formControlName="amount" type="number" placeholder="Monto" />
      <button type="submit" [disabled]="paymentForm.invalid">
        Ejecutar Transferencia Verificada
      </button>
    </form>
  \`
})
export class PaymentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly paymentForm = this.fb.nonNullable.group({
    targetAccount: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{10,34}$/)]],
    amount: [0, [Validators.required, Validators.min(0.01), Validators.max(10000.00)]]
  });

  submitPayment(): void {
    if (this.paymentForm.invalid) {
      return;
    }
    const payload = this.paymentForm.getRawValue();
    this.http.post('/api/v1/pay', payload).subscribe();
  }
}`,
        remediatedExplanation:
          'Implementación defensiva con Reactive Forms, validación estricta de expresiones regulares, rangos numéricos y bloqueo del envío cuando el estado es inválido. Garantiza coherencia en la interfaz antes de delegar la validación definitiva al backend.'
      }
    ],
    realScenarios: [
      {
        incidentTitle: 'Fallo Crítico de Entrega por Ausencia de Pruebas Negativas de Autorización',
        cveReference: 'Auditoría Forense Ficticia (Demostración Pedagógica)',
        summary:
          'Una empresa de tecnología financiera desplegó a producción una actualización de su API que contenía una regresión de autorización. El pipeline de integración continua reportó 100 % de pruebas unitarias aprobadas, debido a que todas las pruebas existentes únicamente verificaban el escenario exitoso (happy path). Cuando un cliente solicitaba su propia cuenta, el sistema respondía 200 OK; sin embargo, no existía ninguna prueba negativa que verificara que al solicitar la cuenta de un tercero se obtuviera un 403 Forbidden.',
        mitigationAnalysis:
          'La organización adoptó el estándar OWASP ASVS v4.0.3 Nivel 2 como compuerta de calidad obligatoria en su pipeline CI/CD, exigiendo que cada historia de usuario incluya criterios de aceptación de seguridad con pruebas negativas automatizadas.'
      }
    ],
    lab: {
      labId: 'demo-asvs-checklist',
      title: 'Simulación Guiada: Matriz de Verificación y Checklist OWASP ASVS v4.0.3',
      missionPrompt:
        'Ejercicio guiado de modelado y selección de requisitos. Evaluar los requerimientos de seguridad de una aplicación bancaria simulada, determinar el nivel de aseguramiento ASVS aplicable (L1, L2 o L3) y generar la matriz de verificación técnica para compuertas CI/CD.',
      hints: [
        'Recuerda que aplicaciones con datos financieros o PII requieren como mínimo ASVS Nivel 2.',
        'Verifica que el checklist incluya comprobaciones explícitas de pruebas negativas en las compuertas CI/CD.',
        'Revisa los requisitos de control de acceso en el capítulo V4 de ASVS v4.0.3.'
      ]
    },
    knowledgeCheck: {
      questions: [
        {
          id: 'q1-4-1',
          prompt: '¿Cuál es la diferencia fundamental entre el Nivel 1 y el Nivel 2 de OWASP ASVS v4.0.3?',
          options: [
            {
              id: 'q1_a',
              text: 'Nivel 1 es verificable enteramente por caja negra sin acceso al código fuente; Nivel 2 exige acceso a código fuente y arquitectura para aplicaciones con datos sensibles.',
              isCorrect: true,
              feedback:
                'Correcto. ASVS L1 define el aseguramiento base verificable externamente, mientras que L2 protege datos de negocio mediante análisis híbrido con acceso al código fuente.'
            },
            {
              id: 'q1_b',
              text: 'Nivel 1 solo aplica a sistemas operativos de 32 bits y Nivel 2 a sistemas de 64 bits.',
              isCorrect: false,
              feedback:
                'Incorrecto. Los niveles de ASVS miden el rigor y alcance de aseguramiento de seguridad de la aplicación, no la arquitectura del procesador.'
            },
            {
              id: 'q1_c',
              text: 'Nivel 2 es un nivel experimental que aún no cuenta con especificación oficial.',
              isCorrect: false,
              feedback:
                'Incorrecto. ASVS v4.0.3 define formalmente los tres niveles (L1, L2, L3) como versiones plenamente estables y operativas.'
            }
          ]
        },
        {
          id: 'q1-4-2',
          prompt: '¿Por qué OWASP Top 10 no debe utilizarse como una lista de verificación de aceptación técnica para un producto?',
          options: [
            {
              id: 'q1_a',
              text: 'Porque es un documento de concientización sobre los riesgos más prevalentes, mientras que ASVS es el estándar prescriptivo con requisitos exhaustivos.',
              isCorrect: true,
              feedback:
                'Correcto. El Top 10 alerta sobre riesgos críticos de alta incidencia; no fue concebido como una lista exhaustiva de especificación de software.'
            },
            {
              id: 'q1_b',
              text: 'Porque OWASP Top 10 fue revocado y reemplazado por normativas exclusivas de hardware.',
              isCorrect: false,
              feedback:
                'Incorrecto. El Top 10 sigue siendo el documento de concientización más consultado del mundo, pero su función no es la verificación exhaustiva.'
            },
            {
              id: 'q1_c',
              text: 'Porque solo contempla vulnerabilidades en aplicaciones de escritorio.',
              isCorrect: false,
              feedback:
                'Incorrecto. OWASP Top 10 se orienta principalmente a aplicaciones web y APIs en la nube.'
            }
          ]
        },
        {
          id: 'q1-4-3',
          prompt: '¿Cuál es el rol primordial de las pruebas negativas en la verificación de seguridad?',
          options: [
            {
              id: 'q1_a',
              text: 'Demostrar que el sistema rechaza deliberada y deterministicamente peticiones maliciosas, no autorizadas o entradas fuera de especificación.',
              isCorrect: true,
              feedback:
                'Correcto. Las pruebas negativas validan los controles defensivos comprobando que los intentos ilícitos sean denegados con los códigos de error previstos.'
            },
            {
              id: 'q1_b',
              text: 'Comprobar que la base de datos devuelve resultados vacíos cuando el servidor está apagado.',
              isCorrect: false,
              feedback:
                'Incorrecto. El apagado del servidor evalúa disponibilidad de infraestructura, no la lógica de los controles de seguridad de la aplicación.'
            },
            {
              id: 'q1_c',
              text: 'Reducir el tiempo de ejecución de las pruebas unitarias desactivando las aserciones.',
              isCorrect: false,
              feedback:
                'Incorrecto. Desactivar aserciones destruye la cobertura de prueba y no guarda relación con la técnica de pruebas negativas.'
            }
          ]
        },
        {
          id: 'q1-4-4',
          prompt: '¿Cómo debe redactarse un criterio de aceptación de seguridad verificable en una historia de usuario?',
          options: [
            {
              id: 'q1_a',
              text: 'Como una condición técnica medible (ejemplo: "Toda petición a /api/transfers sin token JWT válido debe retornar código HTTP 401 Unauthorized").',
              isCorrect: true,
              feedback:
                'Correcto. Los criterios de aceptación de seguridad deben ser deterministas, verificables mediante pruebas automatizadas y libres de ambigüedad.'
            },
            {
              id: 'q1_b',
              text: 'Como una declaración general como "El sistema debe ser completamente seguro y rápido".',
              isCorrect: false,
              feedback:
                'Incorrecto. Las frases genéricas no son verificables ni permiten implementar pruebas automatizadas reproducibles.'
            },
            {
              id: 'q1_c',
              text: 'Como un compromiso de no recibir ataques informáticos durante el primer año de producción.',
              isCorrect: false,
              feedback:
                'Incorrecto. La ausencia de ataques no puede garantizarse contractualmente; la seguridad se basa en la aplicación verificable de controles.'
            }
          ]
        },
        {
          id: 'q1-4-5',
          prompt: 'Al integrar OWASP ASVS v4.0.3 en un pipeline de CI/CD, ¿qué acción debe ejecutar una compuerta de calidad (Security Quality Gate) si falla una prueba negativa de control de acceso?',
          options: [
            {
              id: 'q1_a',
              text: 'Detener de inmediato el pipeline, fallar la compilación e impedir el despliegue al entorno destino hasta que la regresión de seguridad sea remediada.',
              isCorrect: true,
              feedback:
                'Correcto. Las compuertas de calidad actúan como barrera automática bloqueando artefactos que contengan regresiones que violen requisitos ASVS.'
            },
            {
              id: 'q1_b',
              text: 'Continuar con el despliegue a producción si las pruebas de funcionalidad nominal (happy path) fueron aprobadas exitosamente.',
              isCorrect: false,
              feedback:
                'Incorrecto. Tolerar fallos en pruebas negativas de seguridad anula el propósito de la compuerta de calidad y expone el sistema a brechas.'
            },
            {
              id: 'q1_c',
              text: 'Reescribir automáticamente el código del controlador eliminando los endpoints que no hayan superado la prueba.',
              isCorrect: false,
              feedback:
                'Incorrecto. Las herramientas de CI/CD notifican y bloquean; no modifican unilateralmente la lógica de negocio de los controladores.'
            }
          ]
        }
      ]
    },
    summary: {
      goldenRules: [
        'Utilizar OWASP ASVS v4.0.3 para definir los criterios de aceptación de seguridad en todas las historias de usuario.',
        'Seleccionar el nivel de aseguramiento ASVS adecuado (L1 básico, L2 para datos de negocio/PII, L3 para sistemas críticos).',
        'Implementar suites de pruebas duales combinando pruebas positivas del flujo nominal con pruebas negativas sistemáticas.',
        'Verificar que las respuestas ante accesos no autorizados retornen códigos HTTP correctos (401/403) sin fugar trazas de error.',
        'Establecer Quality Gates automáticas en el pipeline de CI/CD para bloquear compilaciones con regresiones de seguridad.'
      ],
      antipatterns: [
        'Utilizar el OWASP Top 10 como si fuera una lista de verificación exhaustiva para certificar la seguridad de una aplicación.',
        'Limitar las suites de pruebas unitarias e integración exclusivamente a escenarios nominales (happy path).',
        'Redactar requisitos de seguridad vagos e inverificables como "la aplicación debe ser invulnerable".',
        'Omitir la trazabilidad entre el requisito normativo de ASVS, el modelo de amenazas y la prueba automatizada que lo verifica.'
      ]
    },
    references: [
      {
        title: 'OWASP Application Security Verification Standard (ASVS) v4.0.3',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-application-security-verification-standard/'
      },
      {
        title: 'OWASP Top 10:2021 — Guía de Riesgos Críticos',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/'
      },
      {
        title: 'OWASP SAMM v2.0.1 — Función de Negocio de Verificación',
        organization: 'OWASP Foundation',
        url: 'https://owaspsamm.org/'
      },
      {
        title: 'NIST SP 800-115: Technical Guide to Information Security Testing and Assessment',
        organization: 'NIST',
        url: 'https://csrc.nist.gov/publications/detail/sp/800-115/final'
      }
    ]
  }
};
