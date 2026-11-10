import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder-view',
  imports: [RouterLink],
  templateUrl: './placeholder-view.component.html',
  styleUrl: './placeholder-view.component.scss'
})
export class PlaceholderViewComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly code = input<string>('');
  readonly entityId = input<string | null>(null);
  readonly milestone = input<string>('Hito posterior (Planificado)');
}
