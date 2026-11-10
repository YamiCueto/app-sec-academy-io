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
    },
    {
      id: 'q3',
      prompt: '¿Pregunta 3 de prueba?',
      options: [
        { id: 'opt3_a', text: 'Opción Correcta 3', isCorrect: true, feedback: 'Muy bien' },
        { id: 'opt3_b', text: 'Opción Incorrecta 3', isCorrect: false, feedback: 'Revisa el estándar' }
      ]
    },
    {
      id: 'q4',
      prompt: '¿Pregunta 4 de prueba?',
      options: [
        { id: 'opt4_a', text: 'Opción Correcta 4', isCorrect: true, feedback: 'Muy bien' },
        { id: 'opt4_b', text: 'Opción Incorrecta 4', isCorrect: false, feedback: 'Revisa el estándar' }
      ]
    },
    {
      id: 'q5',
      prompt: '¿Pregunta 5 de prueba?',
      options: [
        { id: 'opt5_a', text: 'Opción Correcta 5', isCorrect: true, feedback: 'Muy bien' },
        { id: 'opt5_b', text: 'Opción Incorrecta 5', isCorrect: false, feedback: 'Revisa el estándar' }
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

  it('debe aprobar con 4 de 5 aciertos alcanzando exactamente el umbral del 80%', () => {
    const fixture = TestBed.createComponent(TestQuizHostComponent);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('.option-radio') as NodeListOf<HTMLInputElement>;
    radios[0].click();
    radios[2].click();
    radios[4].click();
    radios[6].click();
    radios[9].click();
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('.submit-btn') as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('80%');
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('Aprobada');
    expect(compiled.querySelector('.passed-alert')).toBeTruthy();
    expect(progressStore.completedQuizzesCount()).toBe(1);
    expect(progressStore.totalXP()).toBe(100);
  });

  it('debe reprobar con 3 de 5 aciertos al quedar en 60% por debajo del umbral del 80%', () => {
    const fixture = TestBed.createComponent(TestQuizHostComponent);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('.option-radio') as NodeListOf<HTMLInputElement>;
    radios[0].click();
    radios[2].click();
    radios[4].click();
    radios[7].click();
    radios[9].click();
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('.submit-btn') as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('60%');
    expect(compiled.querySelector('.score-pill')?.textContent).toContain('No superada');
    expect(compiled.querySelector('.retry-btn')).toBeTruthy();

    const retryBtn = compiled.querySelector('.retry-btn') as HTMLButtonElement;
    retryBtn.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.submit-btn')).toBeTruthy();
  });

  it('no debe duplicar XP al reintentar y aprobar nuevamente un quiz ya aprobado', () => {
    const fixture = TestBed.createComponent(TestQuizHostComponent);
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('.option-radio') as NodeListOf<HTMLInputElement>;
    radios[0].click();
    radios[2].click();
    radios[4].click();
    radios[6].click();
    radios[8].click();
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('.submit-btn') as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    expect(progressStore.totalXP()).toBe(100);

    progressStore.recordQuizResult('1.1', 100, true);
    expect(progressStore.totalXP()).toBe(100);
  });
});
