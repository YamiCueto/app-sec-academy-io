import { Component } from '@angular/core';
import { PlaceholderViewComponent } from '../../shared/components/placeholder-view/placeholder-view.component';

@Component({
  selector: 'app-dashboard',
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Panel de Aprendizaje"
      code="DASHBOARD"
      description="Visualización centralizada de métricas de progreso de ingeniería, total de XP acumulado, insignias técnicas desbloqueadas y lección recomendada según tu ruta de especialización."
      milestone="Sprint 1 / Hito 2 (Persistencia y Estado Reactivo)"
    />
  `
})
export class DashboardComponent {}
