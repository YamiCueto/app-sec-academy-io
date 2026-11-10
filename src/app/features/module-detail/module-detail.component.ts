import { Component, input } from '@angular/core';
import { PlaceholderViewComponent } from '../../shared/components/placeholder-view/placeholder-view.component';

@Component({
  selector: 'app-module-detail',
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Detalle del Módulo"
      code="MODULE_DETAIL"
      [entityId]="id()"
      description="Vista de presentación del módulo seleccionado con desglose de lecciones, objetivos instruccionales (Bloom), estándares de referencia asociados y laboratorios prácticos."
      milestone="Sprint 1 / Hito 3 (Motor de Contenido)"
    />
  `
})
export class ModuleDetailComponent {
  readonly id = input<string>('m01');
}
