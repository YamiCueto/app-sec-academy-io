import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { QuizOption, QuizQuestion } from '../../../models/content.model';
import { ProgressStore } from '../../../core/stores/progress.store';

function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

@Component({
  selector: 'app-quiz-runner',
  templateUrl: './quiz-runner.component.html',
  styleUrl: './quiz-runner.component.scss'
})
export class QuizRunnerComponent implements OnInit {
  private readonly progressStore = inject(ProgressStore);

  readonly questions = input.required<readonly QuizQuestion[]>();
  readonly lessonId = input.required<string>();

  protected readonly displayQuestions = signal<readonly QuizQuestion[]>([]);
  protected readonly selectedAnswers = signal<Record<string, string>>({});
  protected readonly isSubmitted = signal<boolean>(false);

  protected readonly allAnswered = computed(() => {
    const questions = this.displayQuestions();
    const answers = this.selectedAnswers();
    if (questions.length === 0) {
      return false;
    }
    return questions.every((q) => !!answers[q.id]);
  });

  protected readonly score = computed(() => {
    if (!this.isSubmitted()) {
      return 0;
    }
    const questions = this.displayQuestions();
    if (questions.length === 0) {
      return 0;
    }
    const answers = this.selectedAnswers();
    let correct = 0;
    for (const q of questions) {
      const selectedId = answers[q.id];
      const option = q.options.find((opt) => opt.id === selectedId);
      if (option?.isCorrect) {
        correct++;
      }
    }
    return Math.round((correct / questions.length) * 100);
  });

  protected readonly isPassed = computed(() => this.score() >= 80);

  protected readonly bestScore = computed(() => {
    const record = this.progressStore.getLessonRecord(this.lessonId());
    return record?.quizScore ?? 0;
  });

  protected readonly previousAttempts = computed(() => {
    const record = this.progressStore.getLessonRecord(this.lessonId());
    return record?.quizAttempts ?? 0;
  });

  ngOnInit(): void {
    this.initializeQuestions();
  }

  selectOption(questionId: string, optionId: string): void {
    if (this.isSubmitted()) {
      return;
    }
    this.selectedAnswers.update((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  }

  submitQuiz(): void {
    if (!this.allAnswered() || this.isSubmitted()) {
      return;
    }
    this.isSubmitted.set(true);
    const calculatedScore = this.score();
    const passed = calculatedScore >= 80;
    this.progressStore.recordQuizResult(this.lessonId(), calculatedScore, passed);
  }

  retryQuiz(): void {
    this.selectedAnswers.set({});
    this.isSubmitted.set(false);
    this.shuffleOptions();
  }

  protected getSelectedOption(question: QuizQuestion): QuizOption | undefined {
    const selectedId = this.selectedAnswers()[question.id];
    return question.options.find((opt) => opt.id === selectedId);
  }

  private initializeQuestions(): void {
    this.displayQuestions.set(this.questions());
  }

  private shuffleOptions(): void {
    const randomized = this.questions().map((q) => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    this.displayQuestions.set(randomized);
  }
}
