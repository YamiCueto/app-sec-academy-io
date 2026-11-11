import { LessonSectionId } from './content.model';

export type AcademicProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'reading_finished'
  | 'quiz_pending'
  | 'lab_pending'
  | 'completed';

export interface LessonRecord {
  readonly completedAt?: string;
  readonly lastAccessedAt?: string;
  readonly lastSectionId?: LessonSectionId;
  readonly visitedSections?: readonly LessonSectionId[];
  readonly readingCompleted?: boolean;
  readonly isLegacyCompleted?: boolean;
  readonly quizScore: number;
  readonly quizAttempts: number;
  readonly quizPassed: boolean;
  readonly labPassed: boolean;
  readonly labScore: number;
  readonly hintsUsed: number;
}

export interface LabRecord {
  readonly labId: string;
  readonly passed: boolean;
  readonly score: number;
  readonly hintsUsed: number;
  readonly completedAt: string;
}

export interface UserPreferences {
  readonly theme: 'dark';
  readonly soundEnabled: boolean;
  readonly highContrast: boolean;
}

export interface UserProgressState {
  readonly schemaVersion: '2.0.0';
  readonly alias: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly totalXP: number;
  readonly lastActiveLessonId?: string;
  readonly lastActiveSectionId?: LessonSectionId;
  readonly completedLessons: readonly string[];
  readonly lessonRecords: Readonly<Record<string, LessonRecord>>;
  readonly labRecords: Readonly<Record<string, LabRecord>>;
  readonly preferences: UserPreferences;
}

export interface ModuleProgressSummary {
  readonly moduleId: string;
  readonly completedLessonsCount: number;
  readonly totalLessonsCount: number;
  readonly completionPercentage: number;
  readonly isCompleted: boolean;
}
