import { Injectable, inject } from '@angular/core';
import { UserProgressState } from '../../../models/progress.model';
import { STORAGE_DRIVER, StorageDriver } from './storage-driver.token';

export const PROGRESS_STORAGE_KEY = 'appsec_academy_progress_v1';
export const CURRENT_SCHEMA_VERSION = '1.0.0';

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

    if (!this.isValidProgressState(parsed)) {
      return this.createInitialState();
    }

    return parsed;
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

    if (!candidate['labRecords'] || typeof candidate['labRecords'] !== 'object' || Array.isArray(candidate['labRecords'])) {
      return false;
    }

    if (!candidate['preferences'] || typeof candidate['preferences'] !== 'object' || Array.isArray(candidate['preferences'])) {
      return false;
    }

    return true;
  }
}
