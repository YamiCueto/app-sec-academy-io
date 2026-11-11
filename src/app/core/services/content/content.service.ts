import { Injectable } from '@angular/core';
import { LessonDetail, isValidLessonDetail, ModuleMetadata } from '../../../models/content.model';
import { CURRICULUM_MODULES } from '../../constants/curriculum.constants';
import { LESSON_1_1_DATA } from './data/lesson-1.1.data';
import { LESSON_1_2_DATA } from './data/lesson-1.2.data';
import { LESSON_1_3_DATA } from './data/lesson-1.3.data';
import { LESSON_1_4_DATA } from './data/lesson-1.4.data';

export interface NextLessonNavInfo {
  readonly nextLessonId: string | null;
  readonly isAvailable: boolean;
  readonly nextLessonTitle: string | null;
}

export interface PrevLessonNavInfo {
  readonly prevLessonId: string | null;
  readonly prevLessonTitle: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly lessonRegistry: Readonly<Record<string, LessonDetail>> = {
    '1.1': LESSON_1_1_DATA,
    '1.1-metodologia-owasp': LESSON_1_1_DATA,
    '1.1-anatomia-de-debilidades-y-metodologia-owasp': LESSON_1_1_DATA,
    '1.2': LESSON_1_2_DATA,
    '1.2-broken-access-control': LESSON_1_2_DATA,
    '1.3': LESSON_1_3_DATA,
    '1.3-fallos-criptograficos': LESSON_1_3_DATA,
    '1.3-fallos-criptograficos-y-de-configuracion': LESSON_1_3_DATA,
    '1.4': LESSON_1_4_DATA,
    '1.4-owasp-asvs': LESSON_1_4_DATA,
    '1.4-marco-de-verificacion-owasp-asvs': LESSON_1_4_DATA
  };

  getLessonSync(lessonId: string): LessonDetail | null {
    const sanitizedId = lessonId.trim();
    const candidate = this.lessonRegistry[sanitizedId];
    if (!candidate || !isValidLessonDetail(candidate)) {
      return null;
    }
    return candidate;
  }

  async getLessonById(lessonId: string): Promise<LessonDetail | null> {
    return this.getLessonSync(lessonId);
  }

  isLessonAvailable(lessonId: string): boolean {
    const sanitizedId = lessonId.trim();
    return Boolean(this.lessonRegistry[sanitizedId]);
  }

  getModules(): readonly ModuleMetadata[] {
    return CURRICULUM_MODULES.map((m) => {
      const lessons = m.lessonIds.map((lId, idx) => {
        const detail = this.lessonRegistry[lId];
        const constantLesson = m.lessons.find((l) => l.id === lId);
        return {
          id: lId,
          title: detail?.title ?? constantLesson?.title ?? `Lección ${lId}`,
          order: detail?.order ?? constantLesson?.order ?? idx + 1,
          estimatedMinutes: detail?.estimatedMinutes ?? constantLesson?.estimatedMinutes ?? 30,
          difficulty: detail?.difficulty ?? constantLesson?.difficulty ?? m.difficulty,
          isAvailable: Boolean(detail)
        };
      });

      return {
        id: m.id,
        code: m.code,
        title: m.title,
        description: m.description,
        difficulty: m.difficulty,
        estimatedMinutes: m.estimatedMinutes,
        lessonCount: m.lessonIds.length,
        block: m.block,
        blockTitle: m.blockTitle,
        isAvailable: m.isAvailable,
        bloomObjectives: m.bloomObjectives,
        standards: m.standards,
        lessons
      };
    });
  }

  getModuleById(moduleId: string): ModuleMetadata | null {
    if (!moduleId) {
      return null;
    }
    const clean = moduleId.trim().toLowerCase();
    const modules = this.getModules();
    const exact = modules.find(
      (m) =>
        m.id.toLowerCase() === clean ||
        m.code.toLowerCase() === clean ||
        clean.startsWith(m.id.toLowerCase())
    );
    return exact ?? null;
  }

  getOfficialSequence(): readonly string[] {
    return CURRICULUM_MODULES.flatMap((m) => m.lessonIds);
  }

  getNextLessonNavigation(currentLessonId: string): NextLessonNavInfo {
    const sequence = this.getOfficialSequence();
    const cleanId = currentLessonId.trim().split('-')[0];
    const currentIndex = sequence.indexOf(cleanId);

    if (currentIndex === -1 || currentIndex >= sequence.length - 1) {
      return {
        nextLessonId: null,
        isAvailable: false,
        nextLessonTitle: null
      };
    }

    const nextId = sequence[currentIndex + 1];
    const isAvail = this.isLessonAvailable(nextId);
    const detail = this.lessonRegistry[nextId];

    let title: string | null = null;
    if (detail) {
      title = detail.title;
    } else {
      for (const mod of CURRICULUM_MODULES) {
        const found = mod.lessons.find((l) => l.id === nextId);
        if (found) {
          title = found.title;
          break;
        }
      }
    }

    return {
      nextLessonId: nextId,
      isAvailable: isAvail,
      nextLessonTitle: title
    };
  }

  getPrevLessonNavigation(currentLessonId: string): PrevLessonNavInfo {
    const sequence = this.getOfficialSequence();
    const cleanId = currentLessonId.trim().split('-')[0];
    const currentIndex = sequence.indexOf(cleanId);

    if (currentIndex <= 0) {
      return {
        prevLessonId: null,
        prevLessonTitle: null
      };
    }

    const prevId = sequence[currentIndex - 1];
    const detail = this.lessonRegistry[prevId];

    let title: string | null = null;
    if (detail) {
      title = detail.title;
    } else {
      for (const mod of CURRICULUM_MODULES) {
        const found = mod.lessons.find((l) => l.id === prevId);
        if (found) {
          title = found.title;
          break;
        }
      }
    }

    return {
      prevLessonId: prevId,
      prevLessonTitle: title
    };
  }
}
