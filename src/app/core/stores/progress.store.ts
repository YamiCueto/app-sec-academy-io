import { Injectable, computed, inject, signal } from '@angular/core';
import { CURRICULUM_MODULES, TOTAL_CURRICULUM_LESSONS } from '../constants/curriculum.constants';
import { LabRecord, LessonRecord, ModuleProgressSummary, UserProgressState } from '../../models/progress.model';
import { StorageService } from '../services/storage/storage.service';

export function calculateCompletionPercentage(completed: number, total: number): number {
  if (total <= 0 || completed <= 0) {
    return 0;
  }
  const rawPercentage = (completed / total) * 100;
  return Math.min(100, Math.round(rawPercentage));
}

export function determineEngineeringRank(totalXP: number): string {
  if (totalXP >= 11001) {
    return 'Principal AppSec Architect';
  }
  if (totalXP >= 7001) {
    return 'Senior AppSec Specialist';
  }
  if (totalXP >= 3501) {
    return 'AppSec Engineer';
  }
  if (totalXP >= 1201) {
    return 'Secure Software Practitioner';
  }
  return 'AppSec Apprentice';
}

@Injectable({
  providedIn: 'root'
})
export class ProgressStore {
  private readonly storage = inject(StorageService);

  private readonly _state = signal<UserProgressState>(this.storage.loadState());

  readonly state = this._state.asReadonly();
  readonly alias = computed(() => this._state().alias);
  readonly totalXP = computed(() => this._state().totalXP);
  readonly completedLessons = computed(() => this._state().completedLessons);
  readonly completedLessonsCount = computed(() => this._state().completedLessons.length);

  readonly completedLabsCount = computed(() => {
    return Object.values(this._state().labRecords).filter((lab) => lab.passed).length;
  });

  readonly completedQuizzesCount = computed(() => {
    return Object.values(this._state().lessonRecords).filter((record) => record.quizPassed).length;
  });

  readonly completionPercentage = computed(() => {
    return calculateCompletionPercentage(
      this.completedLessonsCount(),
      TOTAL_CURRICULUM_LESSONS
    );
  });

  readonly rank = computed(() => determineEngineeringRank(this.totalXP()));

  readonly isEmpty = computed(() => {
    return (
      this.completedLessonsCount() === 0 &&
      this.completedLabsCount() === 0 &&
      this.completedQuizzesCount() === 0 &&
      this.totalXP() === 0
    );
  });

  recordLessonCompletion(lessonId: string, earnedXP: number = 0): void {
    const current = this._state();
    const alreadyCompleted = current.completedLessons.includes(lessonId);
    const updatedLessons = alreadyCompleted
      ? current.completedLessons
      : [...current.completedLessons, lessonId];

    const safeEarnedXP = earnedXP > 0 ? earnedXP : 0;
    const nextXP = alreadyCompleted ? current.totalXP : current.totalXP + safeEarnedXP;
    const now = new Date().toISOString();

    const nextState: UserProgressState = {
      ...current,
      updatedAt: now,
      totalXP: nextXP,
      lastActiveLessonId: lessonId,
      completedLessons: updatedLessons
    };

    this.persistAndSet(nextState);
  }

  recordQuizResult(lessonId: string, score: number, passed: boolean): void {
    const current = this._state();
    const now = new Date().toISOString();
    const previousRecord = current.lessonRecords[lessonId];
    const previousPassed = previousRecord?.quizPassed ?? false;
    const previousAttempts = previousRecord?.quizAttempts ?? 0;
    const previousScore = previousRecord?.quizScore ?? 0;

    const quizScore = Math.max(previousScore, score);
    const quizPassed = previousPassed || passed;
    const quizAttempts = previousAttempts + 1;

    const baseRecord: LessonRecord = previousRecord ?? {
      completedAt: now,
      quizScore: 0,
      quizAttempts: 0,
      quizPassed: false,
      labPassed: false,
      labScore: 0,
      hintsUsed: 0
    };

    const updatedRecord: LessonRecord = {
      ...baseRecord,
      completedAt: quizPassed ? now : baseRecord.completedAt,
      quizScore,
      quizAttempts,
      quizPassed
    };

    const isNewlyPassed = !previousPassed && passed;
    const bonusXP = isNewlyPassed ? 100 : 0;

    const shouldCompleteLesson =
      updatedRecord.quizPassed &&
      (updatedRecord.labPassed || !this.isLabRequiredForLesson(lessonId));

    const alreadyCompleted = current.completedLessons.includes(lessonId);
    const updatedLessons =
      shouldCompleteLesson && !alreadyCompleted
        ? [...current.completedLessons, lessonId]
        : current.completedLessons;

    const nextState: UserProgressState = {
      ...current,
      updatedAt: now,
      totalXP: current.totalXP + bonusXP,
      lastActiveLessonId: lessonId,
      completedLessons: updatedLessons,
      lessonRecords: {
        ...current.lessonRecords,
        [lessonId]: updatedRecord
      }
    };

    this.persistAndSet(nextState);
  }

  recordLabResult(
    labId: string,
    passed: boolean,
    score: number,
    hintsUsed: number,
    lessonId?: string
  ): void {
    const current = this._state();
    const now = new Date().toISOString();
    const previousLab = current.labRecords[labId];
    const previousPassed = previousLab?.passed ?? false;
    const previousScore = previousLab?.score ?? 0;

    const effectiveScore = Math.max(previousScore, score);
    const effectivePassed = previousPassed || passed;

    const updatedLab: LabRecord = {
      labId,
      passed: effectivePassed,
      score: effectiveScore,
      hintsUsed,
      completedAt: effectivePassed ? now : previousLab?.completedAt ?? now
    };

    const isNewlyPassed = !previousPassed && passed;
    const bonusXP = isNewlyPassed ? effectiveScore : 0;

    let updatedLessonRecords = current.lessonRecords;
    let updatedLessons = current.completedLessons;

    if (lessonId) {
      const prevLesson = current.lessonRecords[lessonId] ?? {
        completedAt: now,
        quizScore: 0,
        quizAttempts: 0,
        quizPassed: false,
        labPassed: false,
        labScore: 0,
        hintsUsed: 0
      };

      const nextLesson: LessonRecord = {
        ...prevLesson,
        labPassed: effectivePassed,
        labScore: effectiveScore,
        hintsUsed
      };

      updatedLessonRecords = {
        ...current.lessonRecords,
        [lessonId]: nextLesson
      };

      if (nextLesson.quizPassed && nextLesson.labPassed && !current.completedLessons.includes(lessonId)) {
        updatedLessons = [...current.completedLessons, lessonId];
      }
    }

    const nextState: UserProgressState = {
      ...current,
      updatedAt: now,
      totalXP: current.totalXP + bonusXP,
      lastActiveLessonId: lessonId ?? current.lastActiveLessonId,
      completedLessons: updatedLessons,
      lessonRecords: updatedLessonRecords,
      labRecords: {
        ...current.labRecords,
        [labId]: updatedLab
      }
    };

    this.persistAndSet(nextState);
  }

  getModuleProgress(moduleId: string): ModuleProgressSummary {
    const current = this._state();
    const moduleMeta = CURRICULUM_MODULES.find((m) => m.id === moduleId);

    if (!moduleMeta) {
      return {
        moduleId,
        completedLessonsCount: 0,
        totalLessonsCount: 0,
        completionPercentage: 0,
        isCompleted: false
      };
    }

    const totalLessonsCount = moduleMeta.lessonIds.length;
    const completedLessonsCount = moduleMeta.lessonIds.filter((id) =>
      current.completedLessons.includes(id)
    ).length;

    const completionPercentage = calculateCompletionPercentage(
      completedLessonsCount,
      totalLessonsCount
    );

    return {
      moduleId,
      completedLessonsCount,
      totalLessonsCount,
      completionPercentage,
      isCompleted: totalLessonsCount > 0 && completedLessonsCount === totalLessonsCount
    };
  }

  setAlias(newAlias: string): void {
    const trimmed = newAlias.trim();
    if (!trimmed) {
      return;
    }
    const current = this._state();
    const nextState: UserProgressState = {
      ...current,
      alias: trimmed,
      updatedAt: new Date().toISOString()
    };
    this.persistAndSet(nextState);
  }

  resetProgress(): void {
    this.storage.clearState();
    const freshState = this.storage.createInitialState();
    this._state.set(freshState);
  }

  private persistAndSet(nextState: UserProgressState): void {
    this.storage.saveState(nextState);
    this._state.set(nextState);
  }

  private isLabRequiredForLesson(lessonId: string): boolean {
    return lessonId === '1.2';
  }
}
