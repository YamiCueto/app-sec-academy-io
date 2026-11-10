import { LessonDetail } from '../../../../models/content.model';

export const LESSON_1_1_DATA: LessonDetail = {
  id: '1.1',
  moduleId: 'm01',
  title: 'Anatomía de Debilidades y Metodología OWASP',
  order: 1,
  estimatedMinutes: 25,
  difficulty: 'basico',
  standards: {
    owasp: ['OWASP Top 10:2021', 'OWASP SAMM v2.0.1'],
    cwe: ['CWE-707', 'CWE-1008'],
    asvs: ['ASVS v4.0.3 V1'],
    nist: ['NIST SP 800-53 Rev. 5 (SA-8)']
  },
  sections: {
    introduction:
      'La seguridad de aplicaciones (AppSec) es la disciplina de la ingeniería de software enfocada en diseñar, construir, probar y mantener sistemas que preserven de manera demostrable los tres pilares fundamentales de la Tríada CIA: Confidencialidad (impedir la divulgación no autorizada de activos de información), Integridad (garantizar la exactitud, consistencia y prevención de modificaciones indebidas) y Disponibilidad (asegurar el acceso oportuno y confiable a los servicios legítimos). Estos objetivos se sustentan en mecanismos complementarios de Autenticación (certeza de identidad), Autorización (dictamen de privilegios por recurso) y Auditoría / No Repudio (trazabilidad inmutable de eventos). Comprender cómo se originan las fallas en el ciclo de vida del código exige diferenciar con exactitud taxonómica entre defectos de implementación (bugs), debilidades intrínsecas (flaws) y vulnerabilidades explotables.',
    objectives: [
      'Diferenciar con precisión técnica entre defecto de implementación (bug), debilidad arquitectónica (flaw), vulnerabilidad explotable, vector de amenaza y riesgo residual.',
      'Distinguir el alcance operativo entre la taxonomía MITRE CWE, los identificadores públicos CVE y la métrica de severidad FIRST CVSS.',
      'Analizar la metodología empírica del OWASP Top 10:2021 comprendiendo su valor de concientización y sus limitaciones frente a marcos exhaustivos.',
      'Evaluar los cinco dominios de madurez organizacional del marco OWASP SAMM v2.0.1 y su articulación en una estrategia de defensa en profundidad.'
    ],
    conceptualExplanation: {
      markdown:
        'En ingeniería de seguridad, una debilidad (weakness, tipificada formalmente en MITRE CWE) es una propiedad en la arquitectura, diseño, código o despliegue que, bajo condiciones operativas específicas, puede ser aprovechada por un adversario para violar una política de seguridad, transformándose en una vulnerabilidad explotable.\n\nEs imprescindible distinguir tres conceptos cardinales:\n1. Defecto de implementación (Bug): Error sintáctico, de tipado o lógico en una unidad de código concreta (ejemplo: omitir una verificación de puntero nulo o fallar en el escape de caracteres en una plantilla HTML).\n2. Fallo de diseño o arquitectura (Flaw): Decisión estructural deficiente que no contempló vectores de amenaza relevantes (ejemplo: confiar ciegamente en parámetros de red, diseñar un protocolo sin autenticación mutua o carecer de un punto centralizado de autorización).\n3. Vulnerabilidad (Vulnerability): Debilidad presente en un software desplegado que cuenta con un vector de explotación viable y puede comprometer la Tríada CIA.\n\nPara articular el conocimiento de seguridad en la industria se emplean tres instrumentos normalizados:\n- MITRE CWE (Common Weakness Enumeration): Diccionario formal de tipos de debilidades de hardware y software.\n- MITRE CVE (Common Vulnerabilities and Exposures): Catálogo público de vulnerabilidades concretas descubiertas en versiones específicas de productos comerciales o de código abierto.\n- FIRST CVSS (Common Vulnerability Scoring System): Métrica cuantitativa estandarizada (0.0 a 10.0) que cuantifica la severidad técnica de una vulnerabilidad a través de grupos de métricas Base, Amenaza y Ambientales.\n\nEl OWASP Top 10 representa un informe de consenso industrial basado en prevalencia e incidencia global, no una norma de certificación exhaustiva. Mientras que el Top 10 prioriza los riesgos más críticos para generar conciencia, marcos como OWASP SAMM v2.0.1 (Software Assurance Maturity Model) proporcionan una estructura de madurez para evaluar las prácticas corporativas a través de 5 funciones de negocio: Gobernanza, Diseño, Implementación, Verificación y Operaciones. La defensa en profundidad exige que los controles no se concentren en un único punto, sino que se distribuyan en capas coordinadas entre desarrolladores, arquitectos, ingenieros de QA y equipos de DevSecOps.',
      keyPoints: [
        'Bug es un error de implementación en código; Flaw es una deficiencia estructural en el diseño o arquitectura.',
        'CWE define la taxonomía de debilidades; CVE numera vulnerabilidades concretas en productos; CVSS cuantifica su severidad técnica.',
        'La Tríada CIA (Confidencialidad, Integridad, Disponibilidad) se complementa con Autenticación, Autorización y Auditoría.',
        'OWASP Top 10 es un instrumento de concientización y priorización basado en prevalencia, no un estándar de verificación exhaustivo.',
        'OWASP SAMM v2.0.1 estructura la madurez en 5 funciones de negocio: Gobernanza, Diseño, Implementación, Verificación y Operaciones.',
        'La defensa en profundidad distribuye controles preventivos y detectivos entre arquitectos, desarrolladores, QA y DevSecOps.'
      ]
    },
    technicalExamples: [
      {
        language: 'java',
        title: 'Validación Arquitectónica Centralizada vs Verificación Ad-Hoc en Spring Boot',
        vulnerableFilename: 'TransferController.java',
        vulnerableSnippet: `package io.appsec.banking.controller;

import io.appsec.banking.dto.TransferRequest;
import io.appsec.banking.service.TransferService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    public ResponseEntity<String> executeTransfer(@RequestBody TransferRequest request) {
        if (request.amount() <= 0) {
            return ResponseEntity.badRequest().body("Monto invalido");
        }
        transferService.process(request);
        return ResponseEntity.ok("Transferencia completada");
    }
}`,
        vulnerableExplanation:
          'Verificación ad-hoc dispersa en el controlador que mezcla validación superficial con lógica de transporte HTTP. Omite controles de contexto de inquilino (tenancy), límites transaccionales de cuenta, validación de integridad y verificación de autorización en capas inferiores.',
        remediatedFilename: 'TransferValidationPolicy.java',
        remediatedSnippet: `package io.appsec.banking.policy;

import io.appsec.banking.domain.TransferCommand;
import io.appsec.banking.domain.ValidationOutcome;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Objects;

@Component
public class TransferValidationPolicy {

    private static final BigDecimal MAX_TRANSACTION_LIMIT = new BigDecimal("10000.00");

    public ValidationOutcome validate(TransferCommand command) {
        Objects.requireNonNull(command, "El comando de transferencia no puede ser nulo");
        if (command.amount().compareTo(BigDecimal.ZERO) <= 0) {
            return ValidationOutcome.rejected("El monto debe ser estrictamente positivo");
        }
        if (command.amount().compareTo(MAX_TRANSACTION_LIMIT) > 0) {
            return ValidationOutcome.rejected("El monto excede el umbral maximo transaccional");
        }
        if (command.sourceAccountId().equals(command.destinationAccountId())) {
            return ValidationOutcome.rejected("Las cuentas de origen y destino deben ser distintas");
        }
        if (!command.hasTenantAffinity()) {
            return ValidationOutcome.rejected("Violacion de frontera de aislamiento multi-inquilino");
        }
        return ValidationOutcome.approved();
    }
}`,
        remediatedExplanation:
          'Patrón de diseño con política centralizada e inmutable de validación en la capa de dominio. Implementa el principio de defensa en profundidad, garantizando que ninguna transferencia se procese sin verificar límites transaccionales, coherencia de cuentas y fronteras de aislamiento institucional.'
      },
      {
        language: 'typescript',
        title: 'Defensa en Profundidad en Frontend: Validación de Estado vs Suposición de Seguridad en Angular',
        vulnerableFilename: 'order-checkout.component.vulnerable.ts',
        vulnerableSnippet: `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-checkout',
  template: \`
    <button (click)="submitOrder()" [disabled]="!isClientPrivileged">
      Aprobar Descuento Corporativo
    </button>
  \`
})
export class OrderCheckoutComponent {
  private http = inject(HttpClient);
  isClientPrivileged = true;

  submitOrder(): void {
    const payload = { discountRate: 0.50, orderId: 'ORD-9821' };
    this.http.post('/api/orders/apply-discount', payload).subscribe();
  }
}`,
        vulnerableExplanation:
          'El componente asume que la propiedad booleana isClientPrivileged en memoria protege la operación. Un atacante en las herramientas de desarrollo del navegador puede modificar la variable o emitir directamente la petición HTTP POST sin pasar por la interfaz.',
        remediatedFilename: 'order-checkout.component.remediated.ts',
        remediatedSnippet: `import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-order-checkout',
  template: \`
    <button (click)="submitOrder()" [disabled]="isProcessing()">
      Solicitar Aplicacion de Descuento
    </button>
    @if (errorMessage()) {
      <div class="alert-error" role="alert">{{ errorMessage() }}</div>
    }
  \`
})
export class OrderCheckoutComponent {
  private readonly http = inject(HttpClient);
  protected readonly isProcessing = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  submitOrder(): void {
    this.isProcessing.set(true);
    this.errorMessage.set(null);
    const payload = { requestedDiscountTier: 'TIER_1', orderId: 'ORD-9821' };

    this.http.post('/api/orders/apply-discount', payload).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.errorMessage.set('Privilegios insuficientes dictaminados por el servidor.');
        } else {
          this.errorMessage.set('Error en el procesamiento de la solicitud.');
        }
        return throwError(() => error);
      })
    ).subscribe({
      next: () => this.isProcessing.set(false),
      error: () => this.isProcessing.set(false)
    });
  }
}`,
        remediatedExplanation:
          'El componente actúa como vista defensiva: no asume privilegios absolutos en el cliente, delega el cálculo a un identificador semántico en lugar de enviar tasas arbitrarias y maneja de manera reactiva las respuestas de autorización del servidor (403 Forbidden).'
      }
    ],
    realScenarios: [
      {
        incidentTitle: 'Vulnerabilidad Sistémica en Core Bancario por Confusión entre Bugs y Flaws',
        cveReference: 'Auditoría Forense Ficticia (Demostración Pedagógica)',
        summary:
          'Una entidad financiera sufrió exposición no autorizada de saldos al tratar un fallo recurrente de filtrado como un simple bug de codificación, parchándolo con expresiones regulares en un controlador web. Al no corregir la debilidad de diseño subyacente (ausencia de un punto centralizado de autorización en la capa de servicios), endpoints alternativos expusieron la información confidencial.',
        mitigationAnalysis:
          'La entidad implementó el marco de madurez OWASP SAMM v2.0.1, reestructurando su ciclo de desarrollo mediante modelado de amenazas previo a la construcción de software y asignando identificadores CWE formales a la deuda técnica de seguridad.'
      }
    ],
    lab: {
      labId: 'demo-owasp-taxonomy',
      title: 'Demostración Conceptual: Taxonomía de Debilidades OWASP y MITRE CWE',
      missionPrompt:
        'Actividad de análisis taxonómico y exploración conceptual. Analizar las diferencias estructurales entre fallos arquitectónicos de diseño (flaws) y defectos de codificación (bugs), identificando su asignación en la matriz de riesgo del OWASP Top 10 y los dominios de madurez de OWASP SAMM v2.0.1.',
      hints: [
        'Recuerda que un flaw no se resuelve con un escape puntual de caracteres en el controlador.',
        'Verifica qué categorías de OWASP 2021 surgieron a partir de fallos de diseño estructural.',
        'Revisa la función de Diseño y Verificación en el marco OWASP SAMM v2.0.1.'
      ]
    },
    knowledgeCheck: {
      questions: [
        {
          id: 'q1-1-1',
          prompt:
            '¿Cuál es la diferencia técnica fundamental entre un "bug" de seguridad y un "flaw" arquitectónico?',
          options: [
            {
              id: 'opt-a',
              text: 'Un bug ocurre en la implementación del código; un flaw es una deficiencia intrínseca en el diseño o arquitectura del sistema.',
              isCorrect: true,
              feedback:
                'Correcto. Conforme a OWASP SAMM y MITRE CWE, los bugs radican en código ejecutable concreto y los flaws en la concepción y diseño arquitectónico.'
            },
            {
              id: 'opt-b',
              text: 'Un bug afecta solo lenguajes interpretados y un flaw afecta lenguajes compilados.',
              isCorrect: false,
              feedback:
                'Incorrecto. Tanto bugs como flaws pueden manifestarse con independencia del lenguaje, entorno o paradigma de ejecución.'
            },
            {
              id: 'opt-c',
              text: 'Un flaw solo se produce en la base de datos y un bug en la interfaz de usuario.',
              isCorrect: false,
              feedback:
                'Incorrecto. Ambas categorías pueden manifestarse en cualquier nivel o capa de la arquitectura tecnológica.'
            }
          ]
        },
        {
          id: 'q1-1-2',
          prompt:
            '¿Cuál de los siguientes enunciados describe con mayor rigor la naturaleza del OWASP Top 10?',
          options: [
            {
              id: 'opt-a',
              text: 'Es un documento de concientización y priorización de riesgos críticos basado en datos de incidencia de la industria.',
              isCorrect: true,
              feedback:
                'Correcto. OWASP Top 10 no es un estándar de verificación exhaustivo, sino una guía de priorización y alerta de riesgos.'
            },
            {
              id: 'opt-b',
              text: 'Es una norma obligatoria de certificación con cobertura de todas las debilidades conocidas del software.',
              isCorrect: false,
              feedback:
                'Incorrecto. El estándar de verificación exhaustivo y prescriptivo de OWASP es ASVS, no el Top 10.'
            },
            {
              id: 'opt-c',
              text: 'Es una especificación de reglas sintácticas para linters de frontend.',
              isCorrect: false,
              feedback:
                'Incorrecto. OWASP Top 10 abarca categorías de riesgo globales que trascienden el análisis estático de interfaz.'
            }
          ]
        },
        {
          id: 'q1-1-3',
          prompt:
            '¿Cómo se articulan CWE, CVE y CVSS en el análisis de una debilidad de seguridad?',
          options: [
            {
              id: 'opt-a',
              text: 'CWE categoriza el tipo abstracto de debilidad, CVE identifica la instancia concreta en un producto y CVSS puntúa su severidad técnica.',
              isCorrect: true,
              feedback:
                'Correcto. CWE provee la taxonomía común, CVE cataloga el fallo específico publicado y CVSS calcula numéricamente su impacto y explotabilidad.'
            },
            {
              id: 'opt-b',
              text: 'CWE es un lenguaje de programación, CVE es un protocolo de red y CVSS es un sistema de bases de datos.',
              isCorrect: false,
              feedback:
                'Incorrecto. Ninguno de estos tres estándares constituye un lenguaje o protocolo de comunicación.'
            },
            {
              id: 'opt-c',
              text: 'CVE reemplaza totalmente a CWE cuando se utiliza el sistema operativo Linux.',
              isCorrect: false,
              feedback:
                'Incorrecto. CWE y CVE son complementarios y operan de forma independiente del sistema operativo anfitrión.'
            }
          ]
        },
        {
          id: 'q1-1-4',
          prompt:
            '¿Cuál de las siguientes funciones de negocio pertenece al modelo de madurez OWASP SAMM v2.0.1?',
          options: [
            {
              id: 'opt-a',
              text: 'Gobernanza, Diseño, Implementación, Verificación y Operaciones.',
              isCorrect: true,
              feedback:
                'Correcto. SAMM v2.0.1 estructura el programa de aseguramiento de software exactamente en estas 5 funciones de negocio cardinales.'
            },
            {
              id: 'opt-b',
              text: 'Ventas, Contabilidad, Recursos Humanos y Mercadotecnia.',
              isCorrect: false,
              feedback:
                'Incorrecto. Estas áreas corresponden a la administración empresarial general, no a las funciones de ingeniería de SAMM.'
            },
            {
              id: 'opt-c',
              text: 'Frontend, Backend, Base de Datos y Balanceador de Carga.',
              isCorrect: false,
              feedback:
                'Incorrecto. Estos son componentes de arquitectura técnica de sistemas, no funciones del modelo de madurez de aseguramiento.'
            }
          ]
        },
        {
          id: 'q1-1-5',
          prompt:
            '¿Cuál es el rol primordial de una estrategia de defensa en profundidad en una arquitectura de software empresarial?',
          options: [
            {
              id: 'opt-a',
              text: 'Disponer controles de seguridad coordinados y redundantes en múltiples capas para que la vulneración de una capa no comprometa el sistema entero.',
              isCorrect: true,
              feedback:
                'Correcto. La defensa en profundidad previene que el fallo de un control individual resulte en el compromiso catastrófico de la confidencialidad, integridad o disponibilidad.'
            },
            {
              id: 'opt-b',
              text: 'Confiar exclusivamente en el firewall perimetral y deshabilitar los controles de autenticación en la red interna para maximizar el rendimiento.',
              isCorrect: false,
              feedback:
                'Incorrecto. Asumir que la red interna es de confianza viola el principio Zero Trust y la defensa en profundidad.'
            },
            {
              id: 'opt-c',
              text: 'Duplicar la cantidad de líneas de código de cada función para dificultar el análisis inverso del software.',
              isCorrect: false,
              feedback:
                'Incorrecto. La ofuscación o duplicación artificial no constituye un control de seguridad arquitectónico verificable.'
            }
          ]
        }
      ]
    },
    summary: {
      goldenRules: [
        'Clasificar cada hallazgo de seguridad en su categoría CWE correspondiente para tratar la causa raíz estructural.',
        'Distinguir bugs de codificación de debilidades de diseño para asignar la remediación técnica apropiada.',
        'Adoptar OWASP SAMM v2.0.1 para estructurar un programa de seguridad sostenible a través de las 5 funciones de negocio.',
        'Utilizar OWASP ASVS como guía prescriptiva de requisitos de seguridad verificables en fases tempranas de diseño.',
        'Aplicar el principio de defensa en profundidad distribuyendo controles coordinados entre cliente, red y backend.'
      ],
      antipatterns: [
        'Tratar vulnerabilidades estructurales como simples errores de tipeo o validación cosmética.',
        'Utilizar el OWASP Top 10 como si fuera una lista de verificación exhaustiva para certificar un producto.',
        'Confiar en validaciones de interfaz de usuario como barrera de seguridad suficiente ante atacantes.',
        'Posponer las revisiones de seguridad hasta la fase final de pruebas de penetración antes del despliegue.'
      ]
    },
    references: [
      {
        title: 'OWASP Top 10:2021 — Metodología y Categorías',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/'
      },
      {
        title: 'OWASP SAMM — Software Assurance Maturity Model v2.0.1',
        organization: 'OWASP Foundation',
        url: 'https://owaspsamm.org/'
      },
      {
        title: 'MITRE CWE — Common Weakness Enumeration',
        organization: 'MITRE Corporation',
        url: 'https://cwe.mitre.org/'
      },
      {
        title: 'FIRST CVSS — Common Vulnerability Scoring System v4.0',
        organization: 'FIRST.org',
        url: 'https://www.first.org/cvss/'
      }
    ]
  }
};
