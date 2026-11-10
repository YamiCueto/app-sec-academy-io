import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withHashLocation } from '@angular/router';
import { StorageDriver, STORAGE_DRIVER } from '../../core/services/storage/storage-driver.token';
import { StorageService } from '../../core/services/storage/storage.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { ContentService } from '../../core/services/content/content.service';
import { LessonWorkspaceComponent } from './lesson-workspace.component';

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

@Component({
  imports: [LessonWorkspaceComponent],
  template: `
    <app-lesson-workspace [id]="lessonId" />
  `
})
class TestWorkspaceHostComponent {
  lessonId = '1.1';
}

describe('LessonWorkspaceComponent', () => {
  let progressStore: ProgressStore;
  let mockDriver: MockStorageDriver;

  beforeEach(async () => {
    mockDriver = new MockStorageDriver();
    await TestBed.configureTestingModule({
      imports: [TestWorkspaceHostComponent, LessonWorkspaceComponent],
      providers: [
        provideRouter([], withHashLocation()),
        ContentService,
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    }).compileComponents();

    progressStore = TestBed.inject(ProgressStore);
  });

  it('debe cargar la leccion de demostracion 1.1 y renderizar el titulo y metadatos', async () => {
    const fixture = TestBed.createComponent(TestWorkspaceHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.lesson-main-title')?.textContent).toContain(
      'Anatomía de Debilidades y Metodología OWASP'
    );
    expect(compiled.querySelector('.meta-chip.difficulty')?.textContent).toContain('basico');
    expect(compiled.querySelector('.meta-chip.duration')?.textContent).toContain('25 min');
  });

  it('no debe marcar la leccion como completada simplemente por abrirla', async () => {
    const fixture = TestBed.createComponent(TestWorkspaceHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(progressStore.completedLessonsCount()).toBe(0);
    expect(progressStore.completedLessons()).toEqual([]);
  });

  it('debe navegar secuencialmente entre las nueve secciones actualizando el progreso de lectura', async () => {
    const fixture = TestBed.createComponent(TestWorkspaceHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const workspace = fixture.debugElement.children[0].componentInstance as LessonWorkspaceComponent;

    expect(workspace['activeSectionId']()).toBe('introduccion');
    expect(workspace['readingProgressPercent']()).toBe(11);

    workspace.goToSection('objetivos');
    fixture.detectChanges();
    expect(workspace['currentSectionMeta']().title).toContain('Objetivos');

    workspace.goToSection('conceptos');
    fixture.detectChanges();
    expect(workspace['currentSectionMeta']().title).toContain('Conceptual');

    workspace.goToSection('ejemplos');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-code-viewer')).toBeTruthy();

    workspace.goToSection('escenarios');
    fixture.detectChanges();
    expect(workspace['currentSectionMeta']().title).toContain('Escenarios');

    workspace.goToSection('laboratorio');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lab-mission-card')).toBeTruthy();

    workspace.goToSection('evaluacion');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-quiz-runner')).toBeTruthy();

    workspace.goToSection('resumen');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.summary-grid')).toBeTruthy();

    workspace.goToSection('referencias');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.references-list')).toBeTruthy();

    expect(workspace['readingProgressPercent']()).toBe(100);
  });

  it('debe registrar la leccion en ProgressStore tras la accion explicita de finalizacion', async () => {
    const fixture = TestBed.createComponent(TestWorkspaceHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const workspace = fixture.debugElement.children[0].componentInstance as LessonWorkspaceComponent;
    workspace.goToSection('referencias');
    fixture.detectChanges();

    const completeBtn = fixture.nativeElement.querySelector('.complete-lesson-btn') as HTMLButtonElement;
    expect(completeBtn).toBeTruthy();

    completeBtn.click();
    fixture.detectChanges();

    expect(progressStore.completedLessons()).toContain('1.1');
    expect(progressStore.totalXP()).toBeGreaterThanOrEqual(100);
  });

  it('debe renderizar el estado de leccion no encontrada si el identificador no existe', async () => {
    const fixture = TestBed.createComponent(TestWorkspaceHostComponent);
    fixture.componentInstance.lessonId = '99.99-inexistente';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.lesson-not-found-card')).toBeTruthy();
    expect(compiled.querySelector('.not-found-title')?.textContent).toContain('Lección no encontrada');
  });
});
