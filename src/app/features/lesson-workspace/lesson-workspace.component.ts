import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LessonDetail,
  LessonSectionId,
  LESSON_SECTIONS_CATALOG,
  LessonSectionMeta
} from '../../models/content.model';
import { ContentService } from '../../core/services/content/content.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { CodeViewerComponent } from '../../shared/components/code-viewer/code-viewer.component';
import { QuizRunnerComponent } from '../../shared/components/quiz-runner/quiz-runner.component';

@Component({
  selector: 'app-lesson-workspace',
  imports: [RouterLink, CodeViewerComponent, QuizRunnerComponent],
  templateUrl: './lesson-workspace.component.html',
  styleUrl: './lesson-workspace.component.scss'
})
export class LessonWorkspaceComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressStore = inject(ProgressStore);

  readonly id = input<string>('1.1');

  protected readonly lesson = signal<LessonDetail | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly activeSectionId = signal<LessonSectionId>('introduccion');
  protected readonly visitedSections = signal<Set<LessonSectionId>>(new Set(['introduccion']));
  protected readonly isExplicitlyCompleted = signal<boolean>(false);
  protected readonly sectionsCatalog = LESSON_SECTIONS_CATALOG;

  protected readonly currentSectionIndex = computed(() => {
    return this.sectionsCatalog.findIndex((s) => s.id === this.activeSectionId());
  });

  protected readonly currentSectionMeta = computed<LessonSectionMeta>(() => {
    return this.sectionsCatalog[this.currentSectionIndex()] ?? this.sectionsCatalog[0];
  });

  protected readonly readingProgressPercent = computed(() => {
    const visitedCount = this.visitedSections().size;
    return Math.min(100, Math.round((visitedCount / this.sectionsCatalog.length) * 100));
  });

  protected readonly isLessonDoneInStore = computed(() => {
    const currentLesson = this.lesson();
    if (!currentLesson) {
      return false;
    }
    return this.progressStore.completedLessons().includes(currentLesson.id);
  });

  constructor() {
    effect(() => {
      const lessonId = this.id();
      this.loadLessonData(lessonId);
    });
  }

  goToSection(sectionId: LessonSectionId): void {
    this.activeSectionId.set(sectionId);
    this.visitedSections.update((prev) => {
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }

  nextSection(): void {
    const nextIdx = this.currentSectionIndex() + 1;
    if (nextIdx < this.sectionsCatalog.length) {
      this.goToSection(this.sectionsCatalog[nextIdx].id);
    }
  }

  prevSection(): void {
    const prevIdx = this.currentSectionIndex() - 1;
    if (prevIdx >= 0) {
      this.goToSection(this.sectionsCatalog[prevIdx].id);
    }
  }

  markLessonAsCompleted(): void {
    const currentLesson = this.lesson();
    if (!currentLesson) {
      return;
    }
    this.progressStore.recordLessonCompletion(currentLesson.id, 100);
    this.isExplicitlyCompleted.set(true);
  }

  private loadLessonData(lessonId: string): void {
    const syncResult = this.contentService.getLessonSync(lessonId);
    if (syncResult) {
      this.lesson.set(syncResult);
      this.isLoading.set(false);
      this.activeSectionId.set('introduccion');
      this.visitedSections.set(new Set(['introduccion']));
      this.isExplicitlyCompleted.set(false);
      return;
    }
    this.isLoading.set(false);
    this.lesson.set(null);
  }
}
