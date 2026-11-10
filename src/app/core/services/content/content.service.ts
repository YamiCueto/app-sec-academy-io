import { Injectable } from '@angular/core';
import { LessonDetail, isValidLessonDetail, ModuleMetadata } from '../../../models/content.model';
import { CURRICULUM_MODULES } from '../../constants/curriculum.constants';
import { LESSON_1_1_DATA } from './data/lesson-1.1.data';
import { LESSON_1_2_DATA } from './data/lesson-1.2.data';
import { LESSON_1_3_DATA } from './data/lesson-1.3.data';
import { LESSON_1_4_DATA } from './data/lesson-1.4.data';

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

  getModules(): readonly ModuleMetadata[] {
    return CURRICULUM_MODULES.map((m) => ({
      id: m.id,
      code: m.code,
      title: m.title,
      description: 'Módulo de especialización técnica con laboratorios prácticos y evaluaciones.',
      difficulty: 'basico',
      estimatedMinutes: m.lessonIds.length * 30,
      lessonCount: m.lessonIds.length,
      standards: [
        {
          name: 'OWASP / MITRE',
          version: '2021+',
          specUrl: 'https://owasp.org'
        }
      ],
      lessons: m.lessonIds.map((lId, idx) => {
        const detail = this.lessonRegistry[lId];
        return {
          id: lId,
          title: detail?.title ?? `Lección ${lId}`,
          order: detail?.order ?? idx + 1,
          estimatedMinutes: detail?.estimatedMinutes ?? 30,
          difficulty: detail?.difficulty ?? 'basico'
        };
      })
    }));
  }
}
