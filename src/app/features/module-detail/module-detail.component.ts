import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content/content.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { ModuleMetadata } from '../../models/content.model';

@Component({
  selector: 'app-module-detail',
  imports: [RouterLink],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.scss'
})
export class ModuleDetailComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressStore = inject(ProgressStore);

  readonly id = input<string>('m01');

  protected readonly module = computed<ModuleMetadata | null>(() => {
    return this.contentService.getModuleById(this.id());
  });

  protected readonly completedLessonsInModule = computed(() => {
    const mod = this.module();
    if (!mod) {
      return 0;
    }
    const completed = this.progressStore.completedLessons();
    return mod.lessons.filter((l) => completed.includes(l.id)).length;
  });

  protected readonly moduleProgressPercent = computed(() => {
    const mod = this.module();
    if (!mod || mod.lessons.length === 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.completedLessonsInModule() / mod.lessons.length) * 100));
  });

  protected isLessonDone(lessonId: string): boolean {
    return this.progressStore.completedLessons().includes(lessonId);
  }
}
