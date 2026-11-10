# ADR-005: Persistencia Local Soberana mediante Storage Web y Snapshots JSON

## Estado
**Aceptado** (Fecha: 2026-11-10)

## Contexto
El MVP de AppSec Academy no cuenta con una base de datos centralizada en servidor para almacenar usuarios o contraseñas. Se requiere un mecanismo confiable para persistir el progreso, el código guardado y las evaluaciones sin pérdida de datos al cerrar el navegador, y que permita la portabilidad entre distintos dispositivos.

## Decisión
Se adopta un modelo de **Persistencia Local Soberana** combinando `LocalStorage` e `IndexedDB` nativos del navegador, complementado con un mecanismo de **Exportación e Importación de Snapshots JSON con Suma de Verificación de Integridad SHA-256 (Integrity Digest)**.

### Justificación:
1. **Privacidad Total**: No se recopilan datos personales identificables (PII) en ningún servidor remoto.
2. **Resiliencia**: El progreso se guarda de forma continua e instantánea en el dispositivo del usuario.
3. **Portabilidad Multi-Dispositivo**: El usuario puede exportar su progreso en un archivo JSON ligero y cargarlo en otra computadora o navegador en segundos.
4. **Verificación de Integridad Estructural**: El snapshot incluye un hash SHA-256 que detecta corrupción accidental o formato inválido durante la transferencia. Se documenta formalmente que al residir en el cliente sin clave privada asimétrica de servidor, el hash garantiza integridad pero no autenticidad ni no-repudio frente a modificaciones voluntarias locales.

## Consecuencias
- **Positivas**: Cero dependencia de backend, cumplimiento natural de regulaciones de privacidad (GDPR / LOPD), independencia del usuario.
- **Negativas/Mitigaciones**: Si el usuario borra intencionalmente los datos de su navegador sin haber exportado un snapshot previo, su progreso local se reinicia. Se advierte claramente de esto en la pantalla de perfil.
