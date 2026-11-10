# AppSec Academy — Modelo de Seguridad de Laboratorios (Lab Security Model)

## 1. Principio Fundamental: Confinamiento y Seguridad por Defecto

> [!CAUTION]
> **Aislamiento Hermético**:
> Todos los ejercicios y laboratorios interactivos de AppSec Academy operan bajo el principio de **Cero Confianza (*Zero Trust*) en el Cliente**. Ningún código ingresado por el usuario, ningún payload malicioso de prueba y ninguna biblioteca de laboratorio puede realizar conexiones de red externas, acceder a datos privados de la aplicación principal ni degradar la máquina del estudiante.

```mermaid
graph TD
    USER_CODE["Código / Payload Ingresado por el Estudiante"] --> BOUNDARY["Frontera de Seguridad del Sandbox"]

    subgraph SANDBOX["Entorno Hermético Confinado"]
        WW["Web Worker (Sin Acceso al DOM)"]
        IFRAME["Iframe (Origen Nulo: null-origin)"]
        INTERCEPTOR["Mock Network Interceptor (Bloqueo de Fetch/XHR/Sockets)"]
        WATCHDOG["Watchdog Timer (2,000ms Hard Limit)"]
    end

    BOUNDARY --> SANDBOX

    SANDBOX -.->|Intento de leer localStorage| DENIED1["Bloqueado: Objeto No Definido"]
    SANDBOX -.->|Intento de conexión HTTP externa| DENIED2["Bloqueado: SecurityViolationError"]
    SANDBOX -.->|Bucle Infinito while(true)| DENIED3["Bloqueado: worker.terminate() a los 2s"]
    SANDBOX -->|Aserciones de Prueba Concluidas| RESULTS["Resultados Estructurados a la Consola UI"]
```

---

## 2. Fronteras Técnicas de Aislamiento

### 2.1. Confinamiento de Hilo en Web Workers
1. **Ausencia de Objetos Globales Sensibles**:
   - Dentro de un Web Worker, las interfaces `window`, `document`, `localStorage`, `sessionStorage` y `document.cookie` no existen en el contexto global (`DedicatedWorkerGlobalScope`).
   - El código ejecutado no puede alterar el DOM de la aplicación ni manipular componentes de Angular.
2. **Shadowing y Anulación del Protocolo de Red**:
   - En el entorno de inicio del Worker, las primitivas de red (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`) se anulan explícitamente antes de evaluar el código:
     ```javascript
     self.fetch = undefined;
     self.XMLHttpRequest = undefined;
     self.WebSocket = undefined;
     self.EventSource = undefined;
     Object.freeze(Object.prototype);
     ```
   - Adicionalmente, la política CSP `connect-src 'self'` del documento principal y del contexto de Worker bloquea cualquier intento residual de conexión saliente hacia hosts externos.

### 2.2. Aislamiento de Origen en Iframes (Null Origin)
Para laboratorios donde es indispensable renderizar HTML o simular comportamientos de navegador (ej. labs de XSS o inyección de cabeceras):
1. **Configuración de Atributos**:
   ```html
   <iframe
     sandbox="allow-scripts"
     srcdoc="...código..."
     csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
   ></iframe>
   ```
2. **Tratamiento como Origen Nulo**:
   - Al no incluir la directiva `allow-same-origin`, el navegador asigna al iframe un origen opaco (`origin: null`).
   - La regla de política del mismo origen (*Same-Origin Policy*) del navegador impide legalmente que el script dentro del iframe acceda a cualquier recurso de la página anfitriona.

### 2.3. Control de Recursos y Denegación de Servicio (DoS Prevention)
1. **Watchdog Timer (Límite Estricto de 2 Segundos)**:
   - Todo laboratorio despachado cuenta con una promesa con timeout:
     ```typescript
     const timeoutPromise = new Promise((_, reject) => 
       setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 2000)
     );
     ```
   - Si la ejecución no termina en 2,000 ms, se ejecuta inmediatamente `worker.terminate()`, liberando el procesador del usuario.
2. **Ciclo de Vida Efímero**:
   - El Web Worker se destruye y se recolecta por el Garbage Collector inmediatamente después de validar la suite de pruebas o al navegar hacia otra lección.

---

## 3. Verificación Criptográfica de Retos y Banderas (Anti-Cheat & Flag Integrity)

Para evitar que los estudiantes puedan inspeccionar el código fuente del bundle de JavaScript en las herramientas de desarrollo (*DevTools*) y copiar las soluciones o flags en texto plano:

1. **Respuestas Hashed con Sal**:
   - Las soluciones y banderas de verificación (*Flags*) no se almacenan como cadenas de texto plano en los archivos de la aplicación.
   - Se almacenan como hashes criptográficos **SHA-256** combinados con una sal única por ejercicio (`salt`):
     $$\text{TokenVerificación} = \text{SHA-256}(\text{CódigoNormalizado} + \text{SaltUnico})$$
2. **Aserciones en Tiempo de Ejecución**:
   - La aprobación de un laboratorio se basa en el paso exitoso de las aserciones de prueba lógicas (*Behavioral Assertions*), comprobando el comportamiento del código ante entradas diversas, no la coincidencia exacta de caracteres.

---

## 4. Declaración Ética y Cumplimiento Legal

1. **Finalidad Estrictamente Defensiva y Educativa**: Todos los contenidos, demostraciones y laboratorios tienen como único propósito enseñar a ingenieros de software a diseñar, programar y auditar sistemas seguros.
2. **Cero Objetivos Externos**: AppSec Academy no instruye ni provee herramientas para atacar infraestructuras ajenas. Toda experimentación se circunscribe a los entornos virtuales en memoria del cliente.
