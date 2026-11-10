import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/stores/progress.store';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected readonly progressStore = inject(ProgressStore);

  handleReset(): void {
    this.progressStore.resetProgress();
  }
}
