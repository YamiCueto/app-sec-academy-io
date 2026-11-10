import { TestBed } from '@angular/core/testing';
import { provideRouter, withHashLocation } from '@angular/router';
import { StorageDriver, STORAGE_DRIVER } from '../../core/services/storage/storage-driver.token';
import { StorageService } from '../../core/services/storage/storage.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { DashboardComponent } from './dashboard.component';

class MockStorageDriver implements StorageDriver {
  store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

describe('DashboardComponent (Integración Reactiva)', () => {
  let mockDriver: MockStorageDriver;
  let progressStore: ProgressStore;

  beforeEach(async () => {
    mockDriver = new MockStorageDriver();
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([], withHashLocation()),
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    }).compileComponents();

    progressStore = TestBed.inject(ProgressStore);
  });

  it('debe renderizar el estado inicial vacio con mensajes claros de orientacion', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-xp-value')?.textContent).toContain('0 XP');
    expect(compiled.querySelector('.stat-lessons-value')?.textContent).toContain('0 / 49');
    expect(compiled.querySelector('.stat-percentage-value')?.textContent).toContain('0%');
    expect(compiled.querySelector('.empty-state-card')).toBeTruthy();
    expect(compiled.querySelector('.empty-state-message')?.textContent).toContain(
      'No se han registrado lecciones, evaluaciones ni laboratorios'
    );
  });

  it('debe actualizar reactivamente el DOM al registrar progreso en el store', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    progressStore.recordLessonCompletion('1.1', 150);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-xp-value')?.textContent).toContain('150 XP');
    expect(compiled.querySelector('.stat-lessons-value')?.textContent).toContain('1 / 49');
    expect(compiled.querySelector('.empty-state-card')).toBeNull();
    expect(compiled.querySelector('.active-progress-card')).toBeTruthy();
    expect(compiled.querySelector('.lesson-tag')?.textContent).toContain('Lección 1.1');
  });

  it('debe restablecer el estado al accionar el boton de restablecimiento', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    progressStore.recordLessonCompletion('1.1', 200);
    fixture.detectChanges();

    const resetButton = fixture.nativeElement.querySelector('.reset-progress-btn') as HTMLButtonElement;
    resetButton.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-xp-value')?.textContent).toContain('0 XP');
    expect(compiled.querySelector('.stat-lessons-value')?.textContent).toContain('0 / 49');
    expect(compiled.querySelector('.empty-state-card')).toBeTruthy();
  });
});
