import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressStore } from '../../core/stores/progress.store';
import { ContentService } from '../../core/services/content/content.service';
import { LESSON_SECTIONS_CATALOG } from '../../models/content.model';
import { AcademicProgressStatus } from '../../models/progress.model';

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
  readonly academicStatus?: AcademicProgressStatus;
  readonly currentSectionTitle?: string;
  readonly readingProgressDetail?: string;
  readonly pendingRequirementNotice?: string;
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
  protected readonly m01Progress = computed(() => this.progressStore.getModuleProgress('m01'));
  protected readonly totalPlannedLessons = 49;

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
        actionRoute: '/curriculum',
        academicStatus: 'completed'
      };
    }

    if (lastActive && this.availableM01Lessons.includes(lastActive) && !completed.includes(lastActive)) {
      const lessonDetail = this.contentService.getLessonSync(lastActive);
      const title = lessonDetail?.title ?? `Lección ${lastActive}`;
      const academicStatus = this.progressStore.getLessonAcademicStatus(lastActive);
      const record = this.progressStore.getLessonRecord(lastActive);
      const lastSection = record?.lastSectionId ?? 'introduccion';
      const sectionMeta = LESSON_SECTIONS_CATALOG.find((s) => s.id === lastSection);
      const sectionName = sectionMeta?.shortTitle ?? 'Introducción';
      const visitedCount = record?.visitedSections?.length ?? 1;
      const readingDetail = `Lectura: ${visitedCount} de 9 secciones consultadas`;

      let badgeText = 'Lección en Curso';
      let heading = `Reanudar Lección ${lastActive}`;
      let description = `Continúa tu avance en "${title}".`;
      let actionLabel = `Reanudar Lección ${lastActive} →`;
      let actionRoute: string | readonly string[] = ['/leccion', lastActive];
      let pendingNotice: string | undefined = undefined;

      if (academicStatus === 'lab_pending') {
        pendingNotice = 'Laboratorio obligatorio LAB-BAC-01 pendiente de aprobación';
        description = `Cuestionario superado. Para completar la Lección ${lastActive} debes superar las aserciones del sandbox de seguridad.`;
        actionLabel = `Ir a Laboratorio LAB-BAC-01 →`;
        actionRoute = ['/laboratorio', 'LAB-BAC-01'];
      } else if (academicStatus === 'quiz_pending' || academicStatus === 'reading_finished') {
        pendingNotice = 'Evaluación formativa pendiente (umbral mínimo: 80%)';
        description = `Has concluido la lectura de las secciones. El siguiente paso pedagógico es aprobar la evaluación formativa.`;
        actionLabel = `Reanudar Lección ${lastActive} →`;
      } else {
        description = `Continúa tu avance en "${title}" (Sección actual: ${sectionMeta?.title ?? sectionName}).`;
        actionLabel = `Reanudar Lección ${lastActive} →`;
      }

      return {
        state: 'in_progress',
        lessonId: lastActive,
        lessonTitle: title,
        moduleCode: 'M01',
        badgeText,
        heading,
        description,
        actionLabel,
        actionRoute,
        academicStatus,
        currentSectionTitle: sectionMeta?.title,
        readingProgressDetail: readingDetail,
        pendingRequirementNotice: pendingNotice
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
          actionRoute: ['/leccion', nextId],
          academicStatus: 'not_started'
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
      actionRoute: ['/leccion', '1.1'],
      academicStatus: 'not_started'
    };
  });

  handleReset(): void {
    this.progressStore.resetProgress();
  }
}
