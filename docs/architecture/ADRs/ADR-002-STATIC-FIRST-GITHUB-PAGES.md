# ADR-002: Despliegue Estático en GitHub Pages y Estrategia de Enrutamiento Hash

## Estado
**Aceptado** (Fecha: 2026-11-10)

## Contexto
El objetivo de despliegue definido por el proyecto es GitHub Pages (`https://<usuario>.github.io/app-sec-academy-io/`). GitHub Pages es un host de archivos estáticos que carece de capacidades de reescritura de URLs en el lado del servidor, lo que provoca errores 404 al recargar rutas profundas en SPAs tradicionales basadas en HTML5 History API.

## Decisión
Se adopta una **Arquitectura Static-First** desplegada vía GitHub Actions en GitHub Pages, implementando **Hash Routing (`withHashLocation()`)** para la gestión de rutas internas.

### Justificación:
1. **Confiabilidad Absoluta**: El hash routing (`/#/ruta`) asegura que cualquier refresco de página o acceso directo cargue siempre el archivo `index.html` sin depender de scripts frágiles de redirección en `404.html`.
2. **Cero Costo Operativo**: Hospedaje gratuito, alta disponibilidad respaldada por la infraestructura global de GitHub y sin servidores que mantener o parchar.
3. **Soporte de Subdirectorio**: Funciona de manera transparente tanto en la raíz de dominios personalizados como en subdirectorios de proyectos (`/app-sec-academy-io/`).

## Consecuencias
- **Positivas**: Cero errores 404 de recarga, compatibilidad inmediata en cualquier servidor estático (GitHub Pages, GitLab Pages, S3, Netlify).
- **Negativas/Mitigaciones**: Las URLs contienen el símbolo `#`. Para una plataforma de aprendizaje interactivo de ingeniería esto es plenamente aceptable y comprensible.
