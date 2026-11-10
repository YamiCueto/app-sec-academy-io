import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-viewer',
  templateUrl: './code-viewer.component.html',
  styleUrl: './code-viewer.component.scss'
})
export class CodeViewerComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('typescript');
  readonly filename = input<string>('');
  readonly variant = input<'default' | 'vulnerable' | 'remediated'>('default');

  protected readonly copied = signal<boolean>(false);

  protected readonly lines = computed(() => {
    const raw = this.code();
    return raw.split('\n');
  });

  async copyCode(): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(this.code());
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      }
    } catch {
      this.copied.set(false);
    }
  }
}
