import { Component } from '@angular/core';
import { PlaceholderViewComponent } from '../../shared/components/placeholder-view/placeholder-view.component';

@Component({
  selector: 'app-profile',
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Perfil de Ingeniería y Ajustes"
      code="PROFILE"
      description="Gestión local del perfil de ingeniería, configuración de accesibilidad, preferencias visuales, exportación de copias de seguridad criptográficas (SHA-256) y reinicio de progreso."
      milestone="Próximamente"
    />
  `
})
export class ProfileComponent {}
