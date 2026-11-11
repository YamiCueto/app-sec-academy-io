import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/stores/progress.store';
import { ContentService } from '../../core/services/content/content.service';

export interface ContinueLearningStep {
  readonly state: 'not_started' | 'in_progress' | 'next_available' | 'all_completed';
  readonly lessonId: string | null;
  readonly lessonTitle: string;
  readonly moduleCode: string;
  readonly badgeText: string;
  readonly heading: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly actionRoute: string | readonly string[];
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressStore = inject(ProgressStore);

  private readonly availableM01Lessons: readonly string[] = ['1.1', '1.2', '1.3', '1.4'];

  protected readonly continueStep = computed<ContinueLearningStep>(() => {
    const completed = this.progressStore.completedLessons();
    const lastActive = this.progressStore.lastActiveLessonId();

    const allM01Completed = this.availableM01Lessons.every((id) => completed.includes(id));
    if (allM01Completed) {
      return {
        state: 'all_completed',
        lessonId: null,
        lessonTitle: 'Módulo 01 Completo',
        moduleCode: 'M01',
        badgeText: '¡Módulo 01 Completado al 100%!',
        heading: '¡Felicitaciones! Has completado todas las lecciones del Módulo 01',
        description: 'Has superado los cuatro temas y evaluaciones de Fundamentos OWASP. Puedes repasar los laboratorios o explorar el catálogo curricular.',
        actionLabel: 'Explorar Catálogo Curricular →',
        actionRoute: '/curriculum'
      };
    }

    if (lastActive && this.availableM01Lessons.includes(lastActive) && !completed.includes(lastActive)) {
      const lessonDetail = this.contentService.getLessonSync(lastActive);
      const title = lessonDetail?.title ?? `Lección ${lastActive}`;
      return {
        state: 'in_progress',
        lessonId: lastActive,
        lessonTitle: title,
        moduleCode: 'M01',
        badgeText: 'Lección en Curso',
        heading: `Reanudar Lección ${lastActive}`,
        description: `Continúa tu avance en "${title}".`,
        actionLabel: `Reanudar Lección ${lastActive} →`,
        actionRoute: ['/leccion', lastActive]
      };
    }

    if (completed.length > 0) {
      const nextId = this.availableM01Lessons.find((id) => !completed.includes(id));
      if (nextId) {
        const lessonDetail = this.contentService.getLessonSync(nextId);
        const title = lessonDetail?.title ?? `Lección ${nextId}`;
        return {
          state: 'next_available',
          lessonId: nextId,
          lessonTitle: title,
          moduleCode: 'M01',
          badgeText: 'Siguiente Paso Sugerido',
          heading: `Continuar con Lección ${nextId}`,
          description: `Tu siguiente lección recomendada es: "${title}".`,
          actionLabel: `Iniciar Lección ${nextId} →`,
          actionRoute: ['/leccion', nextId]
        };
      }
    }

    const firstLesson = this.contentService.getLessonSync('1.1');
    const firstTitle = firstLesson?.title ?? 'Anatomía de Debilidades y Metodología OWASP';
    return {
      state: 'not_started',
      lessonId: '1.1',
      lessonTitle: firstTitle,
      moduleCode: 'M01',
      badgeText: 'Comienza Aquí',
      heading: 'Iniciar Módulo 01: Fundamentos OWASP',
      description: `Comienza tu especialización técnica con la Lección 1.1: "${firstTitle}".`,
      actionLabel: 'Iniciar Lección 1.1 →',
      actionRoute: ['/leccion', '1.1']
    };
  });

  handleReset(): void {
    this.progressStore.resetProgress();
  }
}
