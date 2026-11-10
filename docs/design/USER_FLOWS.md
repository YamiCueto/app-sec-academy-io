# AppSec Academy — Flujos de Usuario Principales (User Flows)

## 1. Flujo 1: Inducción y Primera Lección Sin Registro (Zero-Friction Onboarding)

El estudiante puede comenzar a aprender y programar en segundos, sin formularios de registro, verificación de correo electrónico ni barreras de entrada.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Landing as Landing Page
    participant Curriculum as Curriculum Explorer
    participant Workspace as Lesson Workspace
    participant Sandbox as AppSec Playground
    participant Storage as LocalStorage / State

    Usuario->>Landing: Ingresa al sitio
    Landing->>Usuario: Muestra propuesta de valor y botón "Comenzar Ahora"
    Usuario->>Curriculum: Clic en "Comenzar Ruta Fundacional"
    Curriculum->>Workspace: Selecciona Lección 1.1 (OWASP Fundamentals)
    Workspace->>Storage: Inicializa perfil anónimo local
    Usuario->>Workspace: Lee conceptos y revisa ejemplos de código
    Usuario->>Sandbox: Abre laboratorio interactivo
    Sandbox->>Sandbox: Ejecuta aserciones de prueba en Web Worker
    Sandbox->>Usuario: Muestra "Mitigación Exitosa (+200 XP)"
    Workspace->>Usuario: Presenta Knowledge Check (3 preguntas)
    Usuario->>Workspace: Responde y aprueba con 100%
    Workspace->>Storage: Marca Lección 1.1 como completada
```

---

## 2. Flujo 2: Ingeniero Retornante y Ciclo de Laboratorio (Returning Learner)

Un usuario habitual retoma su estudio exactamente donde lo dejó:

```mermaid
sequenceDiagram
    autonumber
    actor Ingeniero
    participant Dashboard as Security Dashboard
    participant Workspace as Lesson Workspace
    participant Sandbox as AppSec Playground (Web Worker)
    participant Storage as LocalStorage

    Ingeniero->>Dashboard: Abre la plataforma
    Dashboard->>Storage: Lee estado de avance y XP
    Dashboard->>Ingeniero: Muestra tarjeta "Continuar: Broken Access Control (M01.2)"
    Ingeniero->>Workspace: Clic en "Continuar Lección"
    Workspace->>Sandbox: Carga código en borrador previo del usuario
    Ingeniero->>Sandbox: Edita la función de middleware para verificar tenantId
    Ingeniero->>Sandbox: Clic en "Verificar Mitigación"
    Sandbox->>Sandbox: Ejecuta suite de pruebas en Web Worker
    alt Aserciones Pasan
        Sandbox->>Ingeniero: Notificación verde: "Vulnerabilidad Neutralizada"
        Sandbox->>Storage: Actualiza estado del laboratorio a Aprobado
    else Aserciones Fallan
        Sandbox->>Ingeniero: Notificación ámbar: "Error: El usuario A aún puede leer datos del usuario B"
        Ingeniero->>Sandbox: Solicita Pista Nivel 1 y ajusta el código
    end
```

---

## 3. Flujo 3: Navegación Cruzada a través del Knowledge Graph

El estudiante utiliza el grafo ontológico para conectar teoría con práctica:

```mermaid
sequenceDiagram
    autonumber
    actor Arquitecto
    participant Graph as Knowledge Graph
    participant NodeModal as Detalle de Nodo
    participant Workspace as Lesson Workspace
    participant Lab as AppSec Playground

    Arquitecto->>Graph: Ingresa a /knowledge-graph y busca "CWE-89"
    Graph->>Arquitecto: Centra el nodo CWE-89 (SQL Injection) y resalta conexiones
    Arquitecto->>Graph: Selecciona el nodo CWE-89
    Graph->>NodeModal: Despliega estándares vinculados (ASVS V5.3, OWASP A03)
    NodeModal->>Arquitecto: Muestra lecciones asociadas: "Lección 2.2: Consultas Parametrizadas"
    Arquitecto->>Workspace: Clic en "Ir a la Lección"
    Workspace->>Lab: Abre el laboratorio práctico directamente
```

---

## 4. Flujo 4: Portabilidad de Progreso (Exportar / Importar Snapshot)

Permite transferir el progreso entre la computadora de la oficina y el dispositivo personal sin necesidad de servidores en la nube:

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Settings as Perfil y Configuración
    participant Storage as LocalStorage / State Engine
    participant FileSys as Sistema de Archivos Local

    Note over Usuario, FileSys: Exportación de Progreso
    Usuario->>Settings: Clic en "Exportar Progreso"
    Settings->>Storage: Recupera snapshot del estado completo
    Storage->>Settings: Genera payload JSON con firma SHA-256
    Settings->>FileSys: Descarga `appsec-academy-progress-<fecha>.json`

    Note over Usuario, FileSys: Importación en Nuevo Dispositivo
    Usuario->>Settings: Clic en "Importar Progreso" y selecciona archivo JSON
    Settings->>Settings: Valida estructura contra JSON Schema y verifica integridad
    Settings->>Storage: Sobrescribe / Fusiona estado local
    Settings->>Usuario: Muestra confirmación: "Progreso restaurado: 12 lecciones, 3 insignias"
```
