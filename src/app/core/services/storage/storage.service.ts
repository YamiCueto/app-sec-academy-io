import { Injectable, inject } from '@angular/core';
import { LessonSectionId } from '../../../models/content.model';
import { LessonRecord, UserProgressState } from '../../../models/progress.model';
import { STORAGE_DRIVER, StorageDriver } from './storage-driver.token';

export const PROGRESS_STORAGE_KEY = 'appsec_academy_progress_v1';
export const CURRENT_SCHEMA_VERSION = '2.0.0';

export const VALID_SECTION_IDS: readonly LessonSectionId[] = [
  'introduccion',
  'objetivos',
  'conceptos',
  'ejemplos',
  'escenarios',
  'laboratorio',
  'evaluacion',
  'resumen',
  'referencias'
];

export function isValidSectionId(value: unknown): value is LessonSectionId {
  return typeof value === 'string' && VALID_SECTION_IDS.includes(value as LessonSectionId);
}

export function normalizeSectionId(value: unknown): LessonSectionId {
  if (isValidSectionId(value)) {
    return value;
  }
  return 'introduccion';
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly driver: StorageDriver = inject(STORAGE_DRIVER);

  createInitialState(alias: string = 'Cadete AppSec'): UserProgressState {
    const timestamp = new Date().toISOString();
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      alias,
      createdAt: timestamp,
      updatedAt: timestamp,
      totalXP: 0,
      completedLessons: [],
      lessonRecords: {},
      labRecords: {},
      preferences: {
        theme: 'dark',
        soundEnabled: false,
        highContrast: false
      }
    };
  }

  loadState(): UserProgressState {
    let raw: string | null = null;
    try {
      raw = this.driver.getItem(PROGRESS_STORAGE_KEY);
    } catch {
      return this.createInitialState();
    }

    if (!raw) {
      return this.createInitialState();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return this.createInitialState();
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return this.createInitialState();
    }

    const candidate = parsed as Record<string, unknown>;

    if (candidate['schemaVersion'] === CURRENT_SCHEMA_VERSION) {
      if (this.isValidProgressState(candidate)) {
        return candidate;
      }
      return this.migrateState(candidate);
    }

    if (this.isLegacyCandidate(candidate)) {
      const migrated = this.migrateState(candidate);
      this.saveState(migrated);
      return migrated;
    }

    return this.createInitialState();
  }

  saveState(state: UserProgressState): boolean {
    try {
      const serialized = JSON.stringify(state);
      this.driver.setItem(PROGRESS_STORAGE_KEY, serialized);
      return true;
    } catch {
      return false;
    }
  }

  clearState(): void {
    try {
      this.driver.removeItem(PROGRESS_STORAGE_KEY);
    } catch {}
  }

  migrateState(candidate: Record<string, unknown>): UserProgressState {
    const timestamp = new Date().toISOString();
    const alias = typeof candidate['alias'] === 'string' && candidate['alias'].trim()
      ? candidate['alias'].trim()
      : 'Cadete AppSec';

    const createdAt = typeof candidate['createdAt'] === 'string' && candidate['createdAt'].trim()
      ? candidate['createdAt']
      : timestamp;

    const updatedAt = typeof candidate['updatedAt'] === 'string' && candidate['updatedAt'].trim()
      ? candidate['updatedAt']
      : timestamp;

    const rawXP = Number(candidate['totalXP']);
    const totalXP = !isNaN(rawXP) && rawXP >= 0 ? rawXP : 0;

    const rawCompleted = Array.isArray(candidate['completedLessons']) ? candidate['completedLessons'] : [];
    const completedLessons = rawCompleted.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0
    );

    const rawLessons = (candidate['lessonRecords'] && typeof candidate['lessonRecords'] === 'object' && !Array.isArray(candidate['lessonRecords']))
      ? (candidate['lessonRecords'] as Record<string, unknown>)
      : {};

    const migratedLessonRecords: Record<string, LessonRecord> = {};
    for (const [key, val] of Object.entries(rawLessons)) {
      if (!val || typeof val !== 'object' || Array.isArray(val)) {
        continue;
      }
      const item = val as Record<string, unknown>;
      const isCompleted = completedLessons.includes(key) || Boolean(item['quizPassed']);
      const quizScore = typeof item['quizScore'] === 'number' && !isNaN(item['quizScore']) ? Math.max(0, Math.min(100, item['quizScore'])) : 0;
      const quizAttempts = typeof item['quizAttempts'] === 'number' && !isNaN(item['quizAttempts']) ? Math.max(0, item['quizAttempts']) : 0;
      const quizPassed = Boolean(item['quizPassed']);
      const labPassed = Boolean(item['labPassed']);
      const labScore = typeof item['labScore'] === 'number' && !isNaN(item['labScore']) ? Math.max(0, item['labScore']) : 0;
      const hintsUsed = typeof item['hintsUsed'] === 'number' && !isNaN(item['hintsUsed']) ? Math.max(0, item['hintsUsed']) : 0;
      const completedAt = typeof item['completedAt'] === 'string' ? item['completedAt'] : (quizPassed ? timestamp : undefined);
      const lastAccessedAt = typeof item['lastAccessedAt'] === 'string' ? item['lastAccessedAt'] : (completedAt || updatedAt);

      let lastSectionId: LessonSectionId = 'introduccion';
      if (isValidSectionId(item['lastSectionId'])) {
        lastSectionId = item['lastSectionId'];
      }

      let visitedSections: readonly LessonSectionId[] = ['introduccion'];
      let hadObservedSections = false;
      if (Array.isArray(item['visitedSections'])) {
        const validList = item['visitedSections'].filter(isValidSectionId);
        if (validList.length > 0) {
          visitedSections = Array.from(new Set(validList));
          hadObservedSections = true;
        }
      }

      const isLegacyCompleted = Boolean(isCompleted && !hadObservedSections);
      const readingCompleted = typeof item['readingCompleted'] === 'boolean'
        ? item['readingCompleted']
        : Boolean(isCompleted || visitedSections.length >= VALID_SECTION_IDS.length);

      migratedLessonRecords[key] = {
        completedAt,
        lastAccessedAt,
        lastSectionId,
        visitedSections,
        readingCompleted,
        isLegacyCompleted,
        quizScore,
        quizAttempts,
        quizPassed,
        labPassed,
        labScore,
        hintsUsed
      };
    }

    const rawLabs = (candidate['labRecords'] && typeof candidate['labRecords'] === 'object' && !Array.isArray(candidate['labRecords']))
      ? (candidate['labRecords'] as Record<string, unknown>)
      : {};

    const migratedLabRecords: Record<string, any> = {};
    for (const [key, val] of Object.entries(rawLabs)) {
      if (!val || typeof val !== 'object' || Array.isArray(val)) {
        continue;
      }
      const item = val as Record<string, unknown>;
      migratedLabRecords[key] = {
        labId: typeof item['labId'] === 'string' ? item['labId'] : key,
        passed: Boolean(item['passed']),
        score: typeof item['score'] === 'number' && !isNaN(item['score']) ? Math.max(0, item['score']) : 0,
        hintsUsed: typeof item['hintsUsed'] === 'number' && !isNaN(item['hintsUsed']) ? Math.max(0, item['hintsUsed']) : 0,
        completedAt: typeof item['completedAt'] === 'string' ? item['completedAt'] : timestamp
      };
    }

    const rawPrefs = (candidate['preferences'] && typeof candidate['preferences'] === 'object' && !Array.isArray(candidate['preferences']))
      ? (candidate['preferences'] as Record<string, unknown>)
      : {};

    const preferences = {
      theme: 'dark' as const,
      soundEnabled: Boolean(rawPrefs['soundEnabled']),
      highContrast: Boolean(rawPrefs['highContrast'])
    };

    let lastActiveLessonId: string | undefined = undefined;
    if (typeof candidate['lastActiveLessonId'] === 'string' && candidate['lastActiveLessonId'].trim()) {
      lastActiveLessonId = candidate['lastActiveLessonId'].trim();
    }

    let lastActiveSectionId: LessonSectionId | undefined = undefined;
    if (lastActiveLessonId) {
      if (isValidSectionId(candidate['lastActiveSectionId'])) {
        lastActiveSectionId = candidate['lastActiveSectionId'];
      } else if (migratedLessonRecords[lastActiveLessonId]?.lastSectionId) {
        lastActiveSectionId = migratedLessonRecords[lastActiveLessonId].lastSectionId;
      } else {
        lastActiveSectionId = 'introduccion';
      }
    }

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      alias,
      createdAt,
      updatedAt,
      totalXP,
      lastActiveLessonId,
      lastActiveSectionId,
      completedLessons,
      lessonRecords: migratedLessonRecords,
      labRecords: migratedLabRecords,
      preferences
    };
  }

  isValidProgressState(data: unknown): data is UserProgressState {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return false;
    }

    const candidate = data as Record<string, unknown>;

    if (candidate['schemaVersion'] !== CURRENT_SCHEMA_VERSION) {
      return false;
    }

    if (typeof candidate['alias'] !== 'string') {
      return false;
    }

    if (typeof candidate['totalXP'] !== 'number' || isNaN(candidate['totalXP']) || candidate['totalXP'] < 0) {
      return false;
    }

    if (
      candidate['lastActiveLessonId'] !== undefined &&
      (typeof candidate['lastActiveLessonId'] !== 'string' || !candidate['lastActiveLessonId'].trim())
    ) {
      return false;
    }

    if (
      candidate['lastActiveSectionId'] !== undefined &&
      !isValidSectionId(candidate['lastActiveSectionId'])
    ) {
      return false;
    }

    if (!Array.isArray(candidate['completedLessons'])) {
      return false;
    }

    const areLessonsValid = candidate['completedLessons'].every(
      (item) => typeof item === 'string'
    );
    if (!areLessonsValid) {
      return false;
    }

    if (!candidate['lessonRecords'] || typeof candidate['lessonRecords'] !== 'object' || Array.isArray(candidate['lessonRecords'])) {
      return false;
    }

    const records = candidate['lessonRecords'] as Record<string, unknown>;
    for (const record of Object.values(records)) {
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        return false;
      }
      const rec = record as Record<string, unknown>;
      if (rec['lastSectionId'] !== undefined && !isValidSectionId(rec['lastSectionId'])) {
        return false;
      }
      if (rec['visitedSections'] !== undefined) {
        if (!Array.isArray(rec['visitedSections'])) {
          return false;
        }
        if (!rec['visitedSections'].every(isValidSectionId)) {
          return false;
        }
      }
    }

    if (!candidate['labRecords'] || typeof candidate['labRecords'] !== 'object' || Array.isArray(candidate['labRecords'])) {
      return false;
    }

    if (!candidate['preferences'] || typeof candidate['preferences'] !== 'object' || Array.isArray(candidate['preferences'])) {
      return false;
    }

    return true;
  }

  private isLegacyCandidate(candidate: Record<string, unknown>): boolean {
    const version = candidate['schemaVersion'];
    const hasCore = typeof candidate['alias'] === 'string' &&
      typeof candidate['totalXP'] === 'number' &&
      Array.isArray(candidate['completedLessons']);

    return hasCore && (version === '1.0.0' || version === undefined);
  }
}
