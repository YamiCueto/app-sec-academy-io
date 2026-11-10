# ADR-001: Adopción de Angular Standalone Components y Angular Signals

## Estado
**Aceptado** (Fecha: 2026-11-10)

## Contexto
AppSec Academy requiere una base tecnológica moderna, robusta, altamente tipada y de alto rendimiento para construir una estación de trabajo de ingeniería interactiva en el navegador. Se evaluaron las opciones de Angular con NgModules tradicionales, React/Next.js y Angular Standalone con Signals.

## Decisión
Se adopta **Angular Standalone Components** junto con **Angular Signals** como la base arquitectónica exclusiva del proyecto.

### Justificación:
1. **Rendimiento Reactivo Fino**: Signals permite una detección de cambios granular, preparando la aplicación para el modo *Zoneless* y eliminando la sobrecarga computacional de `zone.js`.
2. **Modularidad Nativa sin NgModules**: Los componentes standalone reducen drásticamente el código repetitivo (*boilerplate*), facilitan el *tree-shaking* y habilitan una carga diferida (*lazy loading*) limpia ruta por ruta.
3. **Tipado Estricto de TypeScript**: La integración nativa de TypeScript estricto en Angular previene clases enteras de errores en tiempo de compilación.
4. **Disponibilidad en el Entorno**: Se verificó la disponibilidad de Angular CLI versión 22.1.2 y Node.js v24.19.0 en el entorno de desarrollo.

## Consecuencias
- **Positivas**: Bundle inicial compacto ($\le 250\text{ KB}$), reactividad transparente, menor tiempo de renderizado en dispositivos móviles.
- **Negativas/Mitigaciones**: Requiere disciplina del equipo para evitar patrones antiguos basados en módulos o suscripciones manuales de RxJS cuando Signals es suficiente.
