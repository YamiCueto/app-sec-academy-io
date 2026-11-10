import { LessonDetail } from '../../../../models/content.model';

export const LESSON_1_2_DATA: LessonDetail = {
  id: '1.2',
  moduleId: 'm01',
  title: 'Broken Access Control (A01:2021) — El Vector #1 de Compromiso',
  order: 2,
  estimatedMinutes: 40,
  difficulty: 'basico',
  standards: {
    owasp: ['A01:2021 - Broken Access Control', 'OWASP Top 10:2021'],
    cwe: ['CWE-284', 'CWE-862', 'CWE-639'],
    asvs: ['ASVS v4.0.3 V4', 'ASVS v4.0.3 V5'],
    nist: ['NIST SP 800-53 Rev. 5 (AC-3, AC-6)']
  },
  sections: {
    introduction:
      'El control de acceso defectuoso (Broken Access Control) lidera la clasificación OWASP Top 10:2021 como la categoría de riesgo de mayor prevalencia en sistemas web y APIs modernas. Mientras que la autenticación (AuthN) verifica la identidad declarada por el sujeto ("¿quién eres?"), la autorización (AuthZ) dictamina si dicho sujeto autenticado posee los privilegios requeridos para ejecutar una acción específica sobre un recurso concreto ("¿tienes permiso para acceder a este registro?"). Cuando la autorización falla o se omite, los atacantes pueden acceder de forma ilegítima a funciones administrativas, consultar información confidencial de otros usuarios y manipular o destruir registros transaccionales.',
    objectives: [
      'Diferenciar estructuralmente la autenticación (verificación de identidad) de la autorización (concesión y evaluación de privilegios por recurso).',
      'Distinguir con precisión entre escalamiento de privilegios horizontal (IDOR / BOLA) y escalamiento vertical.',
      'Implementar el principio de Denegación por Defecto (Deny by Default) y mediación completa en controladores, servicios y repositorios backend.',
      'Auditar interfaces de usuario en Angular comprendiendo por qué las restricciones cosméticas de frontend no sustituyen la validación de servidor.',
      'Resolver el laboratorio práctico interactivo LAB-BAC-01 aplicando políticas seguras de acceso contextual por titularidad.'
    ],
    conceptualExplanation: {
      markdown:
        'La arquitectura formal de control de acceso exige la separación entre el Punto de Aplicación de Políticas (PEP, Policy Enforcement Point) y el Punto de Decisión de Políticas (PDP, Policy Decision Point). El error más habitual en el desarrollo de software es asumir que el éxito en la fase de autenticación concede tácitamente acceso a cualquier recurso solicitado por parámetro en la ruta o cuerpo de la petición.\n\nExisten dos dimensiones esenciales de fallo de control de acceso:\n1. Escalamiento Horizontal (IDOR / BOLA): El usuario legítimo "A" interactúa con la API y sustituye un identificador (ejemplo: cambiando /api/expedientes/1001 por /api/expedientes/1002) para obtener o modificar los datos del usuario "B", manteniendo ambos el mismo nivel de rol en el sistema. En APIs REST modernas, esta debilidad se cataloga como Broken Object Level Authorization (BOLA / API1:2023).\n2. Escalamiento Vertical: Un usuario estándar sin privilegios accede a endpoints o funciones reservadas para roles de mayor jerarquía (ejemplo: invocar /api/admin/system-config o enviar un claim manipulado de perfil administrativo).\n\nPara neutralizar estas amenazas se requiere la Mediación Completa (Complete Mediation): cada petición individual a cada recurso debe ser interceptada y validada en el servidor contra la identidad autenticada y el contexto del inquilino (tenancy). El uso de identificadores no secuenciales (UUIDv4) añade protección contra la enumeración automatizada, pero no constituye un control de acceso por sí mismo.',
      keyPoints: [
        'Autenticación comprueba credenciales de identidad; Autorización dictamina si la acción está permitida sobre el recurso concreto.',
        'Escalamiento horizontal (IDOR/BOLA) vulnera la privacidad entre iguales; escalamiento vertical usurpa privilegios jerárquicos.',
        'Los identificadores opacos (UUIDv4) atenúan la enumeración superficial, pero no reemplazan la validación de propiedad en el backend.',
        'Toda política de control de acceso debe aplicar Denegación por Defecto (Deny by Default): rechazar salvo autorización explícita.',
        'Las comprobaciones de seguridad deben residir obligatoriamente en el servidor; ocultar botones o rutas en Angular es una conveniencia de UX, jamás una barrera de seguridad.',
        'La mediación completa exige vincular el identificador del usuario autenticado en las consultas a la capa de persistencia.'
      ]
    },
    technicalExamples: [
      {
        language: 'java',
        title: 'Control de Autorización a Nivel de Recurso en Spring Boot con @PreAuthorize',
        vulnerableFilename: 'MedicalRecordController.java',
        vulnerableSnippet: `package io.appsec.health.controller;

import io.appsec.health.domain.MedicalRecord;
import io.appsec.health.repository.MedicalRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/records")
public class MedicalRecordController {

    private final MedicalRecordRepository recordRepository;

    public MedicalRecordController(MedicalRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @GetMapping("/{recordId}")
    public ResponseEntity<MedicalRecord> getRecord(@PathVariable Long recordId) {
        return recordRepository.findById(recordId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}`,
        vulnerableExplanation:
          'El controlador busca directamente el registro médico utilizando el ID recibido en la ruta HTTP sin contrastarlo con el usuario autenticado en el SecurityContext. Cualquier paciente autenticado puede alterar el ID y descargar expedientes ajenos (IDOR/BOLA).',
        remediatedFilename: 'SecuredMedicalRecordController.java',
        remediatedSnippet: `package io.appsec.health.controller;

import io.appsec.health.domain.MedicalRecord;
import io.appsec.health.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/records")
public class SecuredMedicalRecordController {

    private final MedicalRecordService recordService;

    public SecuredMedicalRecordController(MedicalRecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/{recordId}")
    @PreAuthorize("@recordAccessValidator.canReadRecord(#recordId, authentication)")
    public ResponseEntity<MedicalRecord> getRecord(
            @PathVariable Long recordId,
            @AuthenticationPrincipal UserDetails currentUser) {
        MedicalRecord record = recordService.findRecordForUser(recordId, currentUser.getUsername());
        return ResponseEntity.ok(record);
    }
}`,
        remediatedExplanation:
          'Se implementa autorización a nivel de método con @PreAuthorize consultando un evaluador de seguridad específico (recordAccessValidator). Adicionalmente, el servicio de persistencia filtra la consulta utilizando el nombre de usuario autenticado garantizando aislamiento institucional.'
      },
      {
        language: 'typescript',
        title: 'Manejo Defensivo de Acceso en Angular y Delegación Estricta al Backend',
        vulnerableFilename: 'patient-portal.component.vulnerable.ts',
        vulnerableSnippet: `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-portal',
  template: \`
    <div class="portal-card">
      <input [(ngModel)]="targetRecordId" placeholder="ID de Expediente" />
      <button (click)="fetchRecord()" *ngIf="isUserLoggedIn">
        Consultar Expediente
      </button>
    </div>
  \`
})
export class PatientPortalComponent {
  private http = inject(HttpClient);
  targetRecordId = 'REC-1002';
  isUserLoggedIn = true;

  fetchRecord(): void {
    this.http.get('/api/v1/records/' + this.targetRecordId).subscribe();
  }
}`,
        vulnerableExplanation:
          'El componente delega el control de seguridad a una directiva condicional de interfaz (*ngIf="isUserLoggedIn") y permite que el usuario especifique manualmente el identificador del registro sin validar si pertenece a su sesión activa.',
        remediatedFilename: 'patient-portal.component.remediated.ts',
        remediatedSnippet: `import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-patient-portal',
  template: \`
    <div class="portal-card">
      <button (click)="loadMyActiveRecord()" [disabled]="isLoading()">
        Consultar Mi Expediente Oficial
      </button>
      @if (errorMessage()) {
        <div class="alert-access-denied" role="alert">
          {{ errorMessage() }}
        </div>
      }
    </div>
  \`
})
export class PatientPortalComponent {
  private readonly http = inject(HttpClient);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  loadMyActiveRecord(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.get('/api/v1/records/me').pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.errorMessage.set('Acceso denegado: No posee autorizacion sobre este expediente.');
        } else {
          this.errorMessage.set('No fue posible recuperar el expediente.');
        }
        return throwError(() => error);
      })
    ).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }
}`,
        remediatedExplanation:
          'La interfaz consume un endpoint contextual (/api/v1/records/me) donde el servidor deduce la identidad a partir de la sesión autenticada, eliminando la posibilidad de manipulación de ID por parte del cliente y manejando explícitamente el código HTTP 403 Forbidden.'
      }
    ],
    realScenarios: [
      {
        incidentTitle: 'Fuga Masiva de Expedientes Clínicos por IDOR Secuencial en API Privada',
        cveReference: 'Boletín de Seguridad Simulado (Demostración Pedagógica)',
        summary:
          'Una plataforma de telemedicina expuso más de un millón de registros de pacientes al estructurar su API con identificadores enteros incrementales (/api/patients/:id/history). Aunque la plataforma requería inicio de sesión previo, omitió verificar si el usuario autenticado coincidía con el propietario del registro, permitiendo la recolección automatizada mediante un bucle de peticiones HTTP.',
        mitigationAnalysis:
          'El equipo migró el control a un modelo de mediación completa con evaluación de propiedad contextual en cada consulta de persistencia, implementó rate limiting estricto y sustituyó las rutas manipulables por identificadores opacos vinculados a la sesión del titular.'
      }
    ],
    lab: {
      labId: 'LAB-BAC-01',
      title: 'Laboratorio Interactivo Ejecutable LAB-BAC-01: Control de Acceso y Remediación IDOR en API',
      missionPrompt:
        'Laboratorio confinado ejecutable en Web Worker. Inspeccionar el código y la política de acceso de una API simulada de pacientes médicos, y configurar la política adecuada para prevenir la fuga de registros ajenos.',
      hints: [
        'Verifica que el identificador del solicitante autenticado coincida obligatoriamente con el propietario del objeto consultado.',
        'Asegúrate de retornar código HTTP 403 Forbidden ante cualquier discrepancia de tenencia o titularidad.',
        'Aplica la directriz OWASP ASVS V4.1 y V5.1 sobre denegación por defecto y aislamiento de recursos.'
      ]
    },
    knowledgeCheck: {
      questions: [
        {
          id: 'q1-2-1',
          prompt: '¿Cuál es la causa raíz de una debilidad de Broken Access Control en una API REST?',
          options: [
            {
              id: 'q1_a',
              text: 'Omitir la verificación en el servidor de si el usuario autenticado tiene permisos específicos sobre el recurso solicitado.',
              isCorrect: true,
              feedback:
                'Correcto. Conforme a OWASP A01 y CWE-284, la debilidad radica en la ausencia de validación de autorización en el servidor sobre cada recurso.'
            },
            {
              id: 'q1_b',
              text: 'Utilizar contraseñas con longitud menor a ocho caracteres en el formulario de inicio de sesión.',
              isCorrect: false,
              feedback:
                'Incorrecto. La longitud de contraseñas atañe a la robustez de autenticación (CWE-521), no a la lógica de autorización a recursos.'
            },
            {
              id: 'q1_c',
              text: 'No habilitar la compresión gzip en la transferencia de respuestas HTTP.',
              isCorrect: false,
              feedback:
                'Incorrecto. La compresión gzip es una optimización de rendimiento de red y no constituye un mecanismo de control de acceso.'
            }
          ]
        },
        {
          id: 'q1-2-2',
          prompt: '¿Por qué ocultar botones o proteger rutas exclusivamente en Angular no previene un ataque IDOR?',
          options: [
            {
              id: 'q1_a',
              text: 'Porque el cliente puede forzar las peticiones HTTP directamente a la API saltándose por completo la interfaz visual.',
              isCorrect: true,
              feedback:
                'Correcto. Las restricciones en el cliente son herramientas de usabilidad; el servidor debe validar la autorización de cada petición entrante.'
            },
            {
              id: 'q1_b',
              text: 'Porque incrementa innecesariamente el consumo de memoria en dispositivos móviles.',
              isCorrect: false,
              feedback:
                'Incorrecto. El impacto en rendimiento no altera la premisa de seguridad: el cliente está bajo el control absoluto del usuario.'
            },
            {
              id: 'q1_c',
              text: 'Porque los estándares W3C impiden que JavaScript inspeccione cabeceras de respuesta.',
              isCorrect: false,
              feedback:
                'Incorrecto. La arquitectura del navegador no es el motivo defensivo; la regla fundamental es nunca confiar en el cliente.'
            }
          ]
        },
        {
          id: 'q1-2-3',
          prompt: 'Según el principio de Denegación por Defecto (Deny by Default), ¿cómo debe responder un servicio ante una solicitud sin regla explícita?',
          options: [
            {
              id: 'q1_a',
              text: 'Denegar el acceso inmediatamente retornando un código de error de autorización (ejemplo: 403 Forbidden).',
              isCorrect: true,
              feedback:
                'Correcto. Ante la ausencia de una regla explícita y positiva de concesión, el acceso debe ser rechazado de forma tajante.'
            },
            {
              id: 'q1_b',
              text: 'Permitir el acceso en modo solo lectura para no interrumpir el flujo del usuario.',
              isCorrect: false,
              feedback:
                'Incorrecto. Permitir lectura sin autorización explícita viola el principio de menor privilegio y vulnera la confidencialidad.'
            },
            {
              id: 'q1_c',
              text: 'Redirigir silenciosamente al usuario a la página de bienvenida sin generar registro de auditoría.',
              isCorrect: false,
              feedback:
                'Incorrecto. Omitir el registro y tolerar peticiones no autorizadas enmascara anomalías y posibles intentos de intrusión.'
            }
          ]
        },
        {
          id: 'q1-2-4',
          prompt: '¿Cuál es la diferencia técnica entre una elevación de privilegios horizontal (BOLA/IDOR) y una vertical?',
          options: [
            {
              id: 'q1_a',
              text: 'La horizontal ocurre entre usuarios del mismo nivel de rol; la vertical permite a un usuario estándar acceder a funciones de mayor privilegio.',
              isCorrect: true,
              feedback:
                'Correcto. Horizontal vulnera recursos de pares (IDOR/BOLA); vertical escala jerarquías administrativas no autorizadas.'
            },
            {
              id: 'q1_b',
              text: 'La horizontal se ejecuta en microservicios y la vertical se ejecuta en arquitecturas monolíticas.',
              isCorrect: false,
              feedback:
                'Incorrecto. La topología arquitectónica de despliegue no condiciona la naturaleza lógica del control de acceso.'
            },
            {
              id: 'q1_c',
              text: 'La horizontal solo afecta bases de datos relacionales y la vertical afecta almacenamiento NoSQL.',
              isCorrect: false,
              feedback:
                'Incorrecto. Las vulnerabilidades de autorización son independientes del motor de persistencia subyacente.'
            }
          ]
        },
        {
          id: 'q1-2-5',
          prompt: 'En una API REST multi-inquilino (multi-tenant), ¿cuál es la estrategia técnica más efectiva para prevenir vulnerabilidades BOLA/IDOR en la capa de persistencia?',
          options: [
            {
              id: 'q1_a',
              text: 'Vincular inmutablemente el identificador del inquilino y del usuario autenticado obtenido del contexto de seguridad en la consulta a la base de datos.',
              isCorrect: true,
              feedback:
                'Correcto. Forzar la titularidad en la consulta SQL/ORM (WHERE tenant_id = :tenant AND owner_id = :user) garantiza aislamiento a nivel de persistencia.'
            },
            {
              id: 'q1_b',
              text: 'Permitir que el cliente frontend envíe el identificador del inquilino en una cabecera HTTP personalizada sin verificarlo contra el token de sesión.',
              isCorrect: false,
              feedback:
                'Incorrecto. Cualquier cabecera manipulable por el cliente sin validación criptográfica en el servidor es vulnerable a suplantación inmediata.'
            },
            {
              id: 'q1_c',
              text: 'Codificar los identificadores secuenciales en Base64 para que no sean legibles a simple vista en la URL.',
              isCorrect: false,
              feedback:
                'Incorrecto. Base64 es un esquema de codificación reversible trivialmente y no provee confidencialidad ni autorización.'
            }
          ]
        }
      ]
    },
    summary: {
      goldenRules: [
        'Asegurar la mediación completa en el servidor: cada petición a un recurso debe ser validada contra el sujeto autenticado.',
        'Adoptar el principio de Deny by Default en todas las rutas, controladores y métodos del backend.',
        'Filtrar las consultas de persistencia vinculando obligatoriamente el identificador del titular o inquilino autenticado.',
        'Utilizar identificadores indirectos o no secuenciales (UUIDv4) para evitar la enumeración automatizada.',
        'Auditar y registrar los accesos denegados para facilitar la detección proactiva de anomalías.'
      ],
      antipatterns: [
        'Confiar en parámetros de ruta editables por el cliente para tomar decisiones de autorización sobre recursos privados.',
        'Delegar las comprobaciones de seguridad únicamente a guardas de ruta o directivas condicionales en el frontend de Angular.',
        'Asumir que un usuario con sesión autenticada válida tiene autorización implícita sobre todos los registros de la entidad.',
        'Implementar listas negras de permisos en lugar de listas blancas explícitas de privilegios por recurso.'
      ]
    },
    references: [
      {
        title: 'OWASP Top 10:2021 — A01: Broken Access Control',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
      },
      {
        title: 'CWE-284: Improper Access Control',
        organization: 'MITRE Corporation',
        url: 'https://cwe.mitre.org/data/definitions/284.html'
      },
      {
        title: 'CWE-639: Authorization Bypass Through User-Controlled Key',
        organization: 'MITRE Corporation',
        url: 'https://cwe.mitre.org/data/definitions/639.html'
      },
      {
        title: 'OWASP Application Security Verification Standard (ASVS) v4.0.3 — V4 & V5 Access Control',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-application-security-verification-standard/'
      }
    ]
  }
};
