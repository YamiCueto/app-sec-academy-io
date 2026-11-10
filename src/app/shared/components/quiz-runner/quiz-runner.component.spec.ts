import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { QuizQuestion } from '../../../models/content.model';
import { StorageDriver, STORAGE_DRIVER } from '../../../core/services/storage/storage-driver.token';
import { StorageService } from '../../../core/services/storage/storage.service';
import { ProgressStore } from '../../../core/stores/progress.store';
import { QuizRunnerComponent } from './quiz-runner.component';

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
  imports: [QuizRunnerComponent],
  template: `
    <app-quiz-runner [questions]="questions" [lessonId]="'1.1'" />
  `
})
class TestQuizHostComponent {
  questions: readonly QuizQuestion[] = [
    {
      id: 'q1',
      prompt: '¿Pregunta 1 de prueba?',
      options: [
        { id: 'opt1_a', text: 'Respuesta Correcta', isCorrect: true, feedback: 'Excelente respuesta' },
        { id: 'opt1_b', text: 'Respuesta Incorrecta', isCorrect: false, feedback: 'Falla conceptual' }
      ]
    },
    {
      id: 'q2',
      prompt: '¿Pregunta 2 de prueba?',
      options: [
        { id: 'opt2_a', text: 'Opción Correcta 2', isCorrect: true, feedback: 'Muy bien' },
        { id: 'opt2_b', text: 'Opción Incorrecta 2', isCorrect: false, feedback: 'Revisa el estándar' }
      ]
    }
  ];
}

describe('QuizRunnerComponent', () => {
  let progressStore: ProgressStore;
  let mockDriver: MockStorageDriver;

  beforeEach(async () => {
    mockDriver = new MockStorageDriver();
    await TestBed.configureTestingModule({
      imports: [TestQuizHostComponent, QuizRunnerComponent],
      providers: [
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockDriver }
      ]
    }).compileComponents();

    progressStore = TestBed.inject(ProgressStore);
  });

  it('debe deshabilitar el boton de evaluacion mientras existan preguntas sin responder', () => {
    const fixture = TestBed.createComponent(TestQuizHostComponent);
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('.submit-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it('debe evaluar las respuestas, calcular la puntuacion y registrar el resultado en ProgressStore', () => {
    const fixture = TestBed.createComponent(TestQuizHostComponent);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('.option-radio') as NodeListOf<HTMLInputElement>;
    radios[0].click();
    radios[2].click();
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('.submit-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);

    submitBtn.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('100%');
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('Aprobada');
    expect(compiled.querySelector('.passed-alert')).toBeTruthy();
    expect(progressStore.completedQuizzesCount()).toBe(1);
    expect(progressStore.totalXP()).toBeGreaterThanOrEqual(100);
  });

  it('debe permitir reintentar barajando opciones cuando no se alcanza el umbral de 80%', () => {
    const fixture = TestBed.createComponent(TestQuizHostComponent);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('.option-radio') as NodeListOf<HTMLInputElement>;
    radios[1].click();
    radios[3].click();
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('.submit-btn') as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('0%');
    expect(compiled.querySelector('.retry-btn')).toBeTruthy();

    const retryBtn = compiled.querySelector('.retry-btn') as HTMLButtonElement;
    retryBtn.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.submit-btn')).toBeTruthy();
  });
});
