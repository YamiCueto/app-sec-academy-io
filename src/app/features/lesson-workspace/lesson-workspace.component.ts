import { Component, input } from '@angular/core';
import { PlaceholderViewComponent } from '../../shared/components/placeholder-view/placeholder-view.component';

@Component({
  selector: 'app-lesson-workspace',
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Espacio de Trabajo de Lección"
      code="LESSON_WORKSPACE"
      [entityId]="id()"
      description="Estación de trabajo ergonómica de 9 secciones estructuradas: Metadata, Contexto y Amenaza, Estándar, Código Vulnerable vs Mitigado, Visualizador, Laboratorio Interactivo, Cuestionario Formativo, Recursos y Metas."
      milestone="Sprint 1 / Hito 3 & Hito 4"
    />
  `
})
export class LessonWorkspaceComponent {
  readonly id = input<string>('1.1');
}
