import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content/content.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { CURRICULUM_BLOCKS, CurriculumBlockMeta } from '../../core/constants/curriculum.constants';
import { ModuleMetadata } from '../../models/content.model';

@Component({
  selector: 'app-curriculum',
  imports: [RouterLink],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})
export class CurriculumComponent {
  private readonly contentService = inject(ContentService);
  protected readonly progressStore = inject(ProgressStore);

  protected readonly blocks: readonly CurriculumBlockMeta[] = CURRICULUM_BLOCKS;
  protected readonly allModules = computed(() => this.contentService.getModules());

  protected readonly availableModulesCount = computed(() => {
    return this.allModules().filter((m) => m.isAvailable).length;
  });

  protected readonly totalLessonsCount = computed(() => {
    return this.allModules().reduce((acc, m) => acc + m.lessonCount, 0);
  });

  protected getModulesForBlock(blockId: string): readonly ModuleMetadata[] {
    const modules = this.allModules();
    return modules.filter((m) => (m.block ?? 'fundacional') === blockId);
  }

  protected getCompletedCountForModule(module: ModuleMetadata): number {
    const completed = this.progressStore.completedLessons();
    return module.lessons.filter((l) => completed.includes(l.id)).length;
  }

  protected getModuleProgressPercent(module: ModuleMetadata): number {
    if (module.lessons.length === 0) {
      return 0;
    }
    const count = this.getCompletedCountForModule(module);
    return Math.min(100, Math.round((count / module.lessons.length) * 100));
  }

  protected isLessonCompleted(lessonId: string): boolean {
    return this.progressStore.completedLessons().includes(lessonId);
  }
}
