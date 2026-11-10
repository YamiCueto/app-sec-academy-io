import { InjectionToken } from '@angular/core';

export interface StorageDriver {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export class LocalStorageDriver implements StorageDriver {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

export class MemoryStorageDriver implements StorageDriver {
  private readonly memory = new Map<string, string>();

  getItem(key: string): string | null {
    return this.memory.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.memory.set(key, value);
  }

  removeItem(key: string): void {
    this.memory.delete(key);
  }

  clear(): void {
    this.memory.clear();
  }
}

export const STORAGE_DRIVER = new InjectionToken<StorageDriver>('STORAGE_DRIVER', {
  providedIn: 'root',
  factory: () => {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const testKey = '__appsec_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return new LocalStorageDriver();
      }
    } catch {
      return new MemoryStorageDriver();
    }
    return new MemoryStorageDriver();
  }
});
