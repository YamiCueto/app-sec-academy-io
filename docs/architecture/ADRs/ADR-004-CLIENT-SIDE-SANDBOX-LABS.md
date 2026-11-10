# ADR-004: Laboratorios Interactivos Aislados en el Navegador del Cliente

## Estado
**Aceptado** (Fecha: 2026-11-10)

## Contexto
Los laboratorios prácticos de AppSec tradicionalmente dependen de entornos virtuales en la nube (máquinas virtuales EC2, contenedores Docker remotos). Este enfoque genera altos costos recurrentes, lentitud de inicialización (30-90 segundos) y riesgos si un usuario vulnera el entorno compartido.

## Decisión
Se decide ejecutar **el 100% de los laboratorios del MVP directamente en el navegador del cliente** mediante técnicas de confinamiento estricto: **Web Workers**, **Iframes con origen nulo (`null origin`)** y **motores virtuales en memoria (WebAssembly / ASTs)**.

### Justificación:
1. **Ejecución Instantánea**: La retroalimentación de las pruebas toma menos de 20 milisegundos.
2. **Seguridad por Diseño**: Ningún código malicioso de prueba puede alcanzar servidores externos ni atacar redes de terceros. El sandbox del navegador confina la ejecución.
3. **Disponibilidad Offline**: El estudiante puede practicar incluso sin conexión a Internet activa una vez descargados los recursos.
4. **Cero Costo de Servidores**: No se requiere pagar infraestructura de cómputo en la nube.

## Consecuencias
- **Positivas**: Disponibilidad masiva, costo cero, retroalimentación en tiempo real.
- **Negativas/Mitigaciones**: Laboratorios que requieran explotación a nivel de kernel de Linux o binarios C/x86 nativos pesados quedan reservados para fases futuras vía WebAssembly especializado o backends opcionales.
