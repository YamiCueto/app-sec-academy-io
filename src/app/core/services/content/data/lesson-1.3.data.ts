import { LessonDetail } from '../../../../models/content.model';

export const LESSON_1_3_DATA: LessonDetail = {
  id: '1.3',
  moduleId: 'm01',
  title: 'Fallos Criptográficos y de Configuración (A02 & A05:2021)',
  order: 3,
  estimatedMinutes: 35,
  difficulty: 'basico',
  standards: {
    owasp: ['A02:2021 - Cryptographic Failures', 'A05:2021 - Security Misconfiguration', 'OWASP Top 10:2021'],
    cwe: ['CWE-259', 'CWE-327', 'CWE-328', 'CWE-16'],
    asvs: ['ASVS v4.0.3 V2', 'ASVS v4.0.3 V6', 'ASVS v4.0.3 V14'],
    nist: ['NIST SP 800-63B', 'NIST SP 800-52 Rev. 2', 'RFC 9106 (Argon2)']
  },
  sections: {
    introduction:
      'La protección de activos confidenciales y la integridad de las comunicaciones dependen de la correcta aplicación de primitivas criptográficas y del endurecimiento sistemático de las configuraciones de la plataforma. El OWASP Top 10 clasifica los Fallos Criptográficos (A02:2021) y las Configuraciones Inseguras (A05:2021) como causas predominantes de filtración de información y compromiso de infraestructura. Esta lección analiza los fundamentos matemáticos y operativos para proteger datos en reposo y en tránsito, diferenciando con precisión entre cifrado, funciones resumen (hashing) y firmas digitales, y examinando la configuración de cabeceras HTTP de seguridad y políticas de contraseñas robustas.',
    objectives: [
      'Diferenciar formalmente los conceptos y propósitos de cifrado (confidencialidad), hashing (integridad unidireccional) y firma digital (autenticidad, integridad y no repudio).',
      'Comprender por qué funciones hash rápidas como SHA-256 no constituyen firmas digitales ni son aptas por sí solas para el almacenamiento seguro de contraseñas.',
      'Implementar esquemas modernos de derivación y protección de credenciales mediante Argon2id conforme a la especificación RFC 9106.',
      'Configurar cabeceras de respuesta HTTP defensivas y Content Security Policy (CSP) en Spring Boot y Angular.',
      'Auditar y subsanar configuraciones por defecto, credenciales predeterminadas y exposición de información sensible en trazas de error.'
    ],
    conceptualExplanation: {
      markdown:
        'En seguridad de la información es crítico no confundir los tres pilares del tratamiento de datos:\n1. Cifrado (Encryption): Transformación bidireccional mediante una clave criptográfica para garantizar Confidencialidad. Permite recuperar el texto en claro original únicamente a quien posea la clave de descifrado correspondiente (simétrica como AES-256-GCM o asimétrica como RSA/ECC).\n2. Resumen Criptográfico (Hashing): Transformación determinista y unidireccional que genera un resumen de longitud fija a partir de datos de entrada arbitrarios para verificar Integridad. No es reversible matemáticamente.\n3. Firma Digital: Mecanismo que combina una función hash con criptografía asimétrica (usando la clave privada del emisor) para garantizar Autenticidad, Integridad y No Repudio. Es fundamental destacar que calcular un hash SHA-256 por sí solo NO proporciona una firma digital, ya que carece del componente de vinculación de identidad provisto por la clave asimétrica.\n\nPara el almacenamiento de contraseñas, los atacantes disponen de clústeres de GPUs y circuitos ASIC capaces de calcular miles de millones de hashes SHA-256 o MD5 por segundo. Por ello, la normativa técnica (NIST SP 800-63B y OWASP) exige funciones de derivación con memoria dura y coste configurable: Argon2id (RFC 9106), scrypt o bcrypt, que fuerzan el consumo de memoria RAM y ciclos de procesamiento, neutralizando el paralelismo masivo de los atacantes.\n\nPor otra parte, la categoría A05:2021 (Security Misconfiguration) surge de descuidos operativos: mantener credenciales por defecto, habilitar depuración y trazas de pila (stack traces) en producción, admitir políticas de CORS con comodines inseguros o carecer de cabeceras HTTP de endurecimiento: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options: nosniff y X-Frame-Options: DENY.',
      keyPoints: [
        'Cifrado garantiza confidencialidad bidireccional; Hash garantiza integridad unidireccional; Firma Digital garantiza autenticidad y no repudio.',
        'SHA-256 es una función de integridad general; no es una firma digital ni es apta por sí sola para proteger contraseñas.',
        'Argon2id (RFC 9106) es el algoritmo de referencia para almacenamiento de contraseñas debido a su resistencia con memoria dura contra GPUs y ASICs.',
        'La protección en tránsito exige TLS 1.3 con suites de cifrado seguras y soporte de Perfect Forward Secrecy (PFS).',
        'Las configuraciones inseguras (A05) abarcan puertos innecesarios, depuración en producción, CORS permisivo y credenciales por defecto.',
        'Las cabeceras HTTP (CSP, HSTS, X-Content-Type-Options) mitigan ataques de inyección, framing no autorizado y MIME-sniffing.'
      ]
    },
    technicalExamples: [
      {
        language: 'java',
        title: 'Almacenamiento Seguro de Contraseñas con Argon2id vs Hash Rápido en Spring Boot',
        vulnerableFilename: 'InsecurePasswordService.java',
        vulnerableSnippet: `package io.appsec.crypto.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class InsecurePasswordService {

    public String hashPassword(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo no disponible", e);
        }
    }
}`,
        vulnerableExplanation:
          'Utilizar SHA-256 sin sal ni factor de trabajo en memoria hace que las contraseñas sean altamente vulnerables a ataques de diccionario y búsqueda por tablas de precomputación (rainbow tables) mediante GPUs de alta velocidad.',
        remediatedFilename: 'SecureArgon2PasswordService.java',
        remediatedSnippet: `package io.appsec.crypto.service;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SecureArgon2PasswordService {

    private final Argon2PasswordEncoder passwordEncoder;

    public SecureArgon2PasswordService() {
        this.passwordEncoder = new Argon2PasswordEncoder(
                16,
                32,
                1,
                65536,
                3
        );
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean verifyPassword(String rawPassword, String encodedHash) {
        return passwordEncoder.matches(rawPassword, encodedHash);
    }
}`,
        remediatedExplanation:
          'Se implementa Argon2PasswordEncoder configurado según RFC 9106: 16 bytes de sal aleatoria, 32 bytes de salida, paralelismo 1, 64 MiB de memoria (65536 KiB) y 3 iteraciones, garantizando resistencia computacional frente a hardware adverso.'
      },
      {
        language: 'java',
        title: 'Endurecimiento de Cabeceras HTTP de Seguridad en Spring Security',
        vulnerableFilename: 'InsecureWebSecurityConfig.java',
        vulnerableSnippet: `package io.appsec.crypto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class InsecureWebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}`,
        vulnerableExplanation:
          'La configuración deshabilita por completo las cabeceras defensivas predeterminadas de Spring Security, dejando la aplicación expuesta a ataques de clickjacking, robo de sesión por falta de HSTS y ataques basados en inyección de recursos.',
        remediatedFilename: 'HardenedSecurityConfig.java',
        remediatedSnippet: `package io.appsec.crypto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

@Configuration
public class HardenedSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .contentTypeOptions(contentType -> {})
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; script-src 'self'; frame-ancestors 'none'")
                )
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
            );
        return http.build();
    }
}`,
        remediatedExplanation:
          'Configuración robusta de SecurityFilterChain activando HSTS (1 año con subdominios), bloqueo absoluto de incrustación (frameOptions DENY y frame-ancestors none), protección contra sniffing de tipos MIME y Content Security Policy restrictiva.'
      },
      {
        language: 'typescript',
        title: 'Manejo Seguro de Secretos y Configuración de Clientes en Angular',
        vulnerableFilename: 'auth.service.vulnerable.ts',
        vulnerableSnippet: `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly paymentApiKey = 'sk_live_983748291048572019485';

  storeUserToken(jwtToken: string): void {
    localStorage.setItem('auth_token', jwtToken);
    localStorage.setItem('api_secret', this.paymentApiKey);
  }
}`,
        vulnerableExplanation:
          'Incluir claves maestras secretas en el código compilado de Angular permite su extracción inmediata por cualquier usuario inspeccionando los bundles JavaScript. Almacenar tokens sensibles en localStorage los expone a robo mediante scripts maliciosos (XSS).',
        remediatedFilename: 'auth.service.remediated.ts',
        remediatedSnippet: `import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly inMemoryToken = signal<string | null>(null);

  setAccessToken(token: string): void {
    this.inMemoryToken.set(token);
  }

  getAccessToken(): string | null {
    return this.inMemoryToken();
  }

  clearSession(): void {
    this.inMemoryToken.set(null);
  }
}`,
        remediatedExplanation:
          'Cero secretos de infraestructura en el cliente frontend. Los tokens de acceso de corta duración se conservan exclusivamente en memoria volátil de la aplicación, mientras que las sesiones de larga duración se gestionan con cookies HttpOnly, Secure y SameSite=Strict.'
      }
    ],
    realScenarios: [
      {
        incidentTitle: 'Compromiso Masivo por Almacenamiento de Contraseñas con Hashes Rápidos',
        cveReference: 'Auditoría Forense Ficticia (Demostración Pedagógica)',
        summary:
          'Una plataforma corporativa sufrió una exfiltración de su base de datos de usuarios. Debido a que las contraseñas estaban almacenadas con el algoritmo rápido SHA-256 sin sal única por usuario ni factor de memoria, los atacantes descifraron el 85 % de las claves en menos de 48 horas empleando diccionarios precomputados y aceleración GPU.',
        mitigationAnalysis:
          'La plataforma migró obligatoriamente a Argon2id con parámetros RFC 9106 forzando una renovación de credenciales y actualizó su política de contraseñas alineándola con NIST SP 800-63B.'
      }
    ],
    lab: {
      labId: 'demo-crypto-headers-audit',
      title: 'Simulación Guiada: Auditoría de Cabeceras HTTP y Algoritmos Criptográficos',
      missionPrompt:
        'Simulación guiada de inspección y auditoría técnica. Examinar la configuración de seguridad de un servicio web simulado, identificar cabeceras de respuesta ausentes (CSP, HSTS, frame-ancestors) y contrastar primitivas de hash obsoletas frente a esquemas de memoria dura (Argon2id).',
      hints: [
        'Comprueba la presencia de la cabecera Content-Security-Policy y la directiva frame-ancestors.',
        'Verifica que las contraseñas nunca utilicen funciones de la familia MD5, SHA-1 o SHA-256 plano.',
        'Revisa los parámetros mínimos recomendados por RFC 9106 para Argon2id.'
      ]
    },
    knowledgeCheck: {
      questions: [
        {
          id: 'q1-3-1',
          prompt: '¿Por qué calcular un hash SHA-256 no equivale a una firma digital?',
          options: [
            {
              id: 'q1_a',
              text: 'Porque SHA-256 solo comprueba integridad; una firma digital requiere criptografía asimétrica con una clave privada para garantizar autenticidad y no repudio.',
              isCorrect: true,
              feedback:
                'Correcto. Una firma digital cifra el hash con la clave privada del firmante, vinculando inequívocamente su identidad con el contenido.'
            },
            {
              id: 'q1_b',
              text: 'Porque SHA-256 genera salidas de longitud variable que los navegadores no pueden descifrar.',
              isCorrect: false,
              feedback:
                'Incorrecto. SHA-256 genera resúmenes de longitud fija (256 bits) y el hashing es una función unidireccional no descifrable.'
            },
            {
              id: 'q1_c',
              text: 'Porque SHA-256 solo funciona sobre redes privadas y no sobre Internet.',
              isCorrect: false,
              feedback:
                'Incorrecto. Las funciones matemáticas de hash operan con independencia de la topología de red.'
            }
          ]
        },
        {
          id: 'q1-3-2',
          prompt: '¿Cuál es la razón técnica por la que Argon2id es superior a SHA-256 para almacenar contraseñas?',
          options: [
            {
              id: 'q1_a',
              text: 'Porque incorpora coste configurable de memoria RAM y tiempo de procesamiento, neutralizando el ataque masivo en paralelo con GPUs y ASICs.',
              isCorrect: true,
              feedback:
                'Correcto. Conforme a RFC 9106, la memoria dura de Argon2id impide que los adversarios calculen millones de hashes concurrentes en hardware especializado.'
            },
            {
              id: 'q1_b',
              text: 'Porque permite recuperar la contraseña en texto plano si el usuario la olvida.',
              isCorrect: false,
              feedback:
                'Incorrecto. Argon2id es una función unidireccional irreversible; ninguna contraseña debe ser recuperable en texto plano.'
            },
            {
              id: 'q1_c',
              text: 'Porque reduce a cero el tamaño de la base de datos de usuarios.',
              isCorrect: false,
              feedback:
                'Incorrecto. El propósito de Argon2id es la resistencia computacional defensiva, no la compresión de datos.'
            }
          ]
        },
        {
          id: 'q1-3-3',
          prompt: '¿Qué ataque previene específicamente la cabecera HTTP X-Frame-Options: DENY o frame-ancestors none en CSP?',
          options: [
            {
              id: 'q1_a',
              text: 'Clickjacking (incrustación no autorizada de la aplicación en iframes transparentes maliciosos).',
              isCorrect: true,
              feedback:
                'Correcto. Impide que sitios externos incrusten la interfaz en marcos para engañar a los usuarios y capturar sus interacciones.'
            },
            {
              id: 'q1_b',
              text: 'Inyección de sentencias SQL en el motor de base de datos.',
              isCorrect: false,
              feedback:
                'Incorrecto. SQLi se previene con sentencias preparadas y consultas parametrizadas en el backend, no con cabeceras de visualización.'
            },
            {
              id: 'q1_c',
              text: 'Desbordamiento de búfer en memoria en el servidor.',
              isCorrect: false,
              feedback:
                'Incorrecto. Los fallos de manejo de memoria ocurren a nivel de runtime y no se relacionan con el renderizado de frames en el cliente.'
            }
          ]
        },
        {
          id: 'q1-3-4',
          prompt: '¿Cuál de los siguientes escenarios representa un fallo de Configuración Insegura (A05:2021) en lugar de un fallo criptográfico?',
          options: [
            {
              id: 'q1_a',
              text: 'Mantener habilitadas las interfaces de depuración y consolas de administración con credenciales de fábrica en producción.',
              isCorrect: true,
              feedback:
                'Correcto. Las credenciales por defecto y servicios innecesarios habilitados constituyen ejemplos canónicos de Security Misconfiguration (A05).'
            },
            {
              id: 'q1_b',
              text: 'Utilizar el algoritmo DES con claves de 56 bits para cifrar información confidencial.',
              isCorrect: false,
              feedback:
                'Incorrecto. Utilizar un algoritmo criptográfico débil u obsoleto pertenece a la categoría A02 (Cryptographic Failures).'
            },
            {
              id: 'q1_c',
              text: 'Almacenar contraseñas maestras con funciones de hash MD5 sin sal.',
              isCorrect: false,
              feedback:
                'Incorrecto. El uso de funciones hash rotas para proteger credenciales es un fallo criptográfico (A02).'
            }
          ]
        },
        {
          id: 'q1-3-5',
          prompt: '¿Qué consecuencia de seguridad tiene la ausencia de la cabecera HTTP Strict-Transport-Security (HSTS) en una aplicación web en producción?',
          options: [
            {
              id: 'q1_a',
              text: 'Permite que atacantes en la red degraden las conexiones a HTTP no cifrado (ataque SSL Stripping) en la petición inicial del usuario.',
              isCorrect: true,
              feedback:
                'Correcto. HSTS obliga al navegador a utilizar exclusivamente HTTPS, impidiendo ataques Man-in-the-Middle de degradación de protocolo.'
            },
            {
              id: 'q1_b',
              text: 'Invalida automáticamente los certificados digitales emitidos por autoridades de certificación de confianza.',
              isCorrect: false,
              feedback:
                'Incorrecto. HSTS es una directiva de comportamiento del navegador; no altera la validez del certificado X.509 en el servidor.'
            },
            {
              id: 'q1_c',
              text: 'Bloquea la ejecución de scripts asíncronos y Web Workers en el navegador.',
              isCorrect: false,
              feedback:
                'Incorrecto. HSTS regula el canal de transporte TLS, no la política de ejecución de scripts en el motor de JavaScript.'
            }
          ]
        }
      ]
    },
    summary: {
      goldenRules: [
        'Utilizar Argon2id (RFC 9106) con memoria dura para el almacenamiento seguro de contraseñas de usuarios.',
        'Implementar TLS 1.3 con Perfect Forward Secrecy y cabeceras HSTS con expiración mínima de un año.',
        'Configurar Content-Security-Policy (CSP) estricta y bloquear la incrustación mediante frame-ancestors none.',
        'Nunca almacenar secretos maestros o claves privadas en el código fuente de frontend de Angular.',
        'Deshabilitar consolas de depuración, trazas de error prolijas y credenciales predeterminadas en producción.'
      ],
      antipatterns: [
        'Utilizar funciones hash rápidas de propósito general (MD5, SHA-1, SHA-256) para almacenar contraseñas.',
        'Afirmar que un hash SHA-256 por sí solo constituye una firma digital vinculante.',
        'Almacenar secretos de infraestructura o API keys de backend en archivos environment.ts del cliente.',
        'Desactivar indiscriminadamente las cabeceras defensivas y de protección CSRF en entornos de producción.'
      ]
    },
    references: [
      {
        title: 'OWASP Top 10:2021 — A02: Cryptographic Failures',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
      },
      {
        title: 'OWASP Top 10:2021 — A05: Security Misconfiguration',
        organization: 'OWASP Foundation',
        url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
      },
      {
        title: 'RFC 9106: Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications',
        organization: 'IETF',
        url: 'https://www.rfc-editor.org/rfc/rfc9106.html'
      },
      {
        title: 'NIST SP 800-63B: Digital Identity Guidelines — Authentication and Lifecycle Management',
        organization: 'NIST',
        url: 'https://pages.nist.gov/800-63-3/sp800-63b.html'
      }
    ]
  }
};
