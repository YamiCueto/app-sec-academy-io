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
    expect(compiled.querySelector('.stat-lessons-value')?.textContent).toContain('0 / 4');
    expect(compiled.querySelector('.stat-percentage-value')?.textContent).toContain('0%');
    expect(compiled.querySelector('.stat-total-planned-value')?.textContent).toContain('0 / 49');
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
    expect(compiled.querySelector('.stat-lessons-value')?.textContent).toContain('1 / 4');
    expect(compiled.querySelector('.stat-percentage-value')?.textContent).toContain('25%');
    expect(compiled.querySelector('.stat-total-planned-value')?.textContent).toContain('1 / 49');
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
    expect(compiled.querySelector('.stat-lessons-value')?.textContent).toContain('0 / 4');
    expect(compiled.querySelector('.stat-total-planned-value')?.textContent).toContain('0 / 49');
    expect(compiled.querySelector('.empty-state-card')).toBeTruthy();
  });

  it('debe mostrar la advertencia de persistencia de forma accesible cuando storage falla', () => {
    mockDriver.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    progressStore.recordLessonCompletion('1.1', 50);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.storage-warning-banner')).toBeTruthy();
    expect(compiled.querySelector('.warning-message')?.textContent).toContain('no está disponible');
  });

  it('debe sugerir comenzar la Leccion 1.1 en la tarjeta Continuar Aprendizaje para un estudiante nuevo', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.continue-card');
    expect(card).toBeTruthy();
    expect(card?.textContent).toContain('Comienza Aquí');
    expect(card?.textContent).toContain('Iniciar Lección 1.1');
  });

  it('debe sugerir reanudar la leccion en curso cuando lastActiveLessonId no esta completada', () => {
    progressStore.setLastActiveLesson('1.2');
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.continue-card');
    expect(card?.textContent).toContain('Lección en Curso');
    expect(card?.textContent).toContain('Reanudar Lección 1.2');
  });

  it('debe sugerir la siguiente leccion disponible cuando existen lecciones previas completadas', () => {
    progressStore.recordLessonCompletion('1.1', 100);
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.continue-card');
    expect(card?.textContent).toContain('Siguiente Paso Sugerido');
    expect(card?.textContent).toContain('Iniciar Lección 1.2');
  });

  it('debe mostrar estado de felicitacion y modulo 100% completado cuando todas las lecciones estan aprobadas', () => {
    progressStore.recordLessonCompletion('1.1', 100);
    progressStore.recordLessonCompletion('1.2', 100);
    progressStore.recordLessonCompletion('1.3', 100);
    progressStore.recordLessonCompletion('1.4', 100);
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.continue-card');
    expect(card?.textContent).toContain('¡Módulo 01 Completado al 100%!');
    expect(card?.textContent).toContain('Explorar Catálogo Curricular');
  });

  it('18. Continuacion desde Dashboard: debe reflejar el laboratorio pendiente y orientar al estudiante', () => {
    progressStore.recordQuizResult('1.2', 100, true);
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.continue-card');
    expect(card?.textContent).toContain('Laboratorio obligatorio LAB-BAC-01 pendiente de aprobación');
    const labBtn = card?.querySelector('.continue-main-btn') as HTMLAnchorElement;
    expect(labBtn?.textContent).toContain('Ir a Laboratorio LAB-BAC-01');
  });
});
