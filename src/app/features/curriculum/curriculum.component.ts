import { Component } from '@angular/core';
import { PlaceholderViewComponent } from '../../shared/components/placeholder-view/placeholder-view.component';

@Component({
  selector: 'app-curriculum',
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Currículo de Especialización AppSec"
      code="CURRICULUM"
      description="Explorador de los 14 módulos troncales, 49 lecciones y rutas de aprendizaje guiadas (Fundamentos OWASP, DevSecOps, Cloud & Containers, AI Security)."
      milestone="Sprint 1 / Hito 3 (Motor de Contenido)"
    />
  `
})
export class CurriculumComponent {}
