import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LessonDetail,
  LessonSectionId,
  LESSON_SECTIONS_CATALOG,
  LessonSectionMeta
} from '../../models/content.model';
import { AcademicProgressStatus } from '../../models/progress.model';
import { ContentService } from '../../core/services/content/content.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { getLessonLabRequirement } from '../../core/constants/curriculum.constants';
import { isValidSectionId, normalizeSectionId } from '../../core/services/storage/storage.service';
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

  protected readonly academicStatus = computed<AcademicProgressStatus>(() => {
    const current = this.lesson();
    if (!current) {
      return 'not_started';
    }
    return this.progressStore.getLessonAcademicStatus(current.id);
  });

  protected readonly labRequirement = computed(() => {
    const current = this.lesson();
    if (!current) {
      return null;
    }
    return getLessonLabRequirement(current.id);
  });

  protected readonly isLessonDoneInStore = computed(() => {
    const current = this.lesson();
    if (!current) {
      return false;
    }
    return this.progressStore.completedLessons().includes(current.id);
  });

  protected readonly prevLessonNav = computed(() => {
    const current = this.lesson();
    if (!current) {
      return { prevLessonId: null, prevLessonTitle: null };
    }
    return this.contentService.getPrevLessonNavigation(current.id);
  });

  protected readonly nextLessonNav = computed(() => {
    const current = this.lesson();
    if (!current) {
      return { nextLessonId: null, isAvailable: false, nextLessonTitle: null };
    }
    return this.contentService.getNextLessonNavigation(current.id);
  });

  constructor() {
    effect(() => {
      const lessonId = this.id();
      this.loadLessonData(lessonId);
    });
  }

  goToSection(sectionId: LessonSectionId): void {
    const normalized = normalizeSectionId(sectionId);
    this.activeSectionId.set(normalized);
    this.visitedSections.update((prev) => {
      const next = new Set(prev);
      next.add(normalized);
      return next;
    });

    const currentLesson = this.lesson();
    if (currentLesson) {
      this.progressStore.recordSectionVisit(currentLesson.id, normalized);
    }
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

  resetReadingToBeginning(): void {
    const currentLesson = this.lesson();
    if (!currentLesson) {
      return;
    }
    this.progressStore.resetLessonReading(currentLesson.id);
    this.activeSectionId.set('introduccion');
    this.visitedSections.set(new Set(['introduccion']));
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

      const savedRecord = this.progressStore.getLessonRecord(syncResult.id);
      let initialSection: LessonSectionId = 'introduccion';
      if (savedRecord?.lastSectionId && isValidSectionId(savedRecord.lastSectionId)) {
        initialSection = savedRecord.lastSectionId;
      }

      let initialVisited = new Set<LessonSectionId>(['introduccion']);
      if (savedRecord?.visitedSections && savedRecord.visitedSections.length > 0) {
        const validList = savedRecord.visitedSections.filter(isValidSectionId);
        if (validList.length > 0) {
          initialVisited = new Set(validList);
        }
      }
      initialVisited.add(initialSection);

      this.activeSectionId.set(initialSection);
      this.visitedSections.set(initialVisited);
      this.isExplicitlyCompleted.set(false);

      this.progressStore.recordSectionVisit(syncResult.id, initialSection);
      return;
    }
    this.isLoading.set(false);
    this.lesson.set(null);
  }
}
