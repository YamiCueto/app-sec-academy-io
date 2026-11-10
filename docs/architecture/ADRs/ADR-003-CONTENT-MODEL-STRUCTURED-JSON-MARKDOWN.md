# ADR-003: Modelo de Contenido Estructurado en TypeScript/JSON y Markdown Desacoplado

## Estado
**Aceptado** (Fecha: 2026-11-10)

## Contexto
En plataformas educativas tradicionales, el contenido suele acoplarse directamente a plantillas HTML o guardarse en bases de datos relacionales/NoSQL complejas. AppSec Academy requiere un formato modular, versionable en Git, fácilmente auditable y que se cargue de forma ligera bajo demanda.

## Decisión
Se decide estructurar el contenido educativo en **Esquemas Declarativos Tipados en TypeScript y JSON**, utilizando bloques Markdown seguros únicamente para la explicación conceptual.

### Justificación:
1. **Desacoplamiento Total**: Los componentes de la interfaz de usuario de Angular desconocen el contenido específico de las lecciones; se limitan a renderizar las estructuras que reciben a través de contratos de datos.
2. **Carga Diferida Eficiente**: Cada lección se empaqueta en un chunk estático independiente cargado mediante `import()` dinámico solo cuando el usuario accede a ella.
3. **Control de Versiones y Auditoría**: Todo el contenido se gestiona mediante control de versiones Git, permitiendo Pull Requests, revisiones por pares y trazabilidad total de cambios.

## Consecuencias
- **Positivas**: Cero acoplamiento, facilidad para agregar nuevas lecciones sin tocar el código fuente de los componentes, excelente rendimiento en red.
- **Negativas/Mitigaciones**: Requiere un proceso de validación en tiempo de compilación para verificar que todos los archivos de contenido cumplan con la interfaz `LessonDetail`.
