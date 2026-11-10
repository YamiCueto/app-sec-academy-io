import { Component, input } from '@angular/core';
import { PlaceholderViewComponent } from '../../shared/components/placeholder-view/placeholder-view.component';

@Component({
  selector: 'app-laboratory',
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Laboratorio Interactivo de Seguridad"
      code="LABORATORY"
      [entityId]="id()"
      description="Entorno de experimentación práctica confinado en Web Worker con temporizador Watchdog de 2 segundos. Permite inspeccionar vectores de ataque y verificar mitigaciones en tiempo real."
      milestone="Sprint 1 / Hito 4 (Sandbox Web Worker)"
    />
  `
})
export class LaboratoryComponent {
  readonly id = input<string>('lab-bac-01');
}
