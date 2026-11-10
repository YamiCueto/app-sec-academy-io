import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AuthenticatedUserPayload,
  LabDefinition,
  LabExecutionRequest,
  LabExecutionResult,
  LabPolicyMode
} from '../../models/lab.model';
import { LabEngineService } from '../../core/services/lab/lab-engine.service';
import { ProgressStore } from '../../core/stores/progress.store';

@Component({
  selector: 'app-laboratory',
  imports: [CommonModule, RouterLink],
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.scss']
})
export class LaboratoryComponent {
  readonly id = input<string>('LAB-BAC-01');

  private readonly labEngine = inject(LabEngineService);
  readonly progressStore = inject(ProgressStore);

  readonly definition = computed(() => this.labEngine.getLabDefinition(this.id()));

  readonly selectedUserId = signal<string>('usr-eve');
  readonly selectedResourceId = signal<string>('med-rec-001');
  readonly selectedPolicyMode = signal<LabPolicyMode>('vulnerable_no_check');

  readonly isExecuting = signal<boolean>(false);
  readonly singleExecutionResult = signal<LabExecutionResult | null>(null);
  readonly suiteExecutionResult = signal<LabExecutionResult | null>(null);
  readonly activeTab = signal<'simulation' | 'suite' | 'theory'>('simulation');

  readonly isLabCompletedInStore = computed(() => {
    const def = this.definition();
    if (!def) {
      return false;
    }
    const record = this.progressStore.labRecords()[def.id];
    return record?.passed === true;
  });

  readonly selectedUser = computed<AuthenticatedUserPayload | null>(() => {
    const def = this.definition();
    if (!def) {
      return null;
    }
    const found = def.simulatedEntities.users.find(
      (u) => u.id === this.selectedUserId()
    );
    if (!found) {
      return null;
    }
    return {
      id: found.id,
      username: found.name.toLowerCase().replace(/\s+/g, '.'),
      role: found.role
    };
  });

  readonly selectedResource = computed(() => {
    const def = this.definition();
    if (!def) {
      return null;
    }
    return (
      def.simulatedEntities.resources.find(
        (r) => r.id === this.selectedResourceId()
      ) ?? null
    );
  });


  onSelectUser(userId: string): void {
    this.selectedUserId.set(userId);
  }

  onSelectResource(resourceId: string): void {
    this.selectedResourceId.set(resourceId);
  }

  onSelectPolicyMode(mode: LabPolicyMode): void {
    this.selectedPolicyMode.set(mode);
  }

  onSelectTab(tab: 'simulation' | 'suite' | 'theory'): void {
    this.activeTab.set(tab);
  }

  async onExecuteSimulation(): Promise<void> {
    const def = this.definition();
    const user = this.selectedUser();
    if (!def || !user) {
      return;
    }

    this.isExecuting.set(true);
    const request: LabExecutionRequest = {
      labId: def.id,
      authenticatedUser: user,
      requestedResourceId: this.selectedResourceId(),
      policyConfig: {
        mode: this.selectedPolicyMode()
      }
    };

    try {
      const result = await this.labEngine.executeSingleRequest(request);
      this.singleExecutionResult.set(result);
    } finally {
      this.isExecuting.set(false);
    }
  }

  async onRunTestSuite(): Promise<void> {
    const def = this.definition();
    if (!def) {
      return;
    }

    this.isExecuting.set(true);
    try {
      const result = await this.labEngine.runTestSuite(
        def.id,
        this.selectedPolicyMode()
      );
      this.suiteExecutionResult.set(result);
      this.activeTab.set('suite');
    } finally {
      this.isExecuting.set(false);
    }
  }

  onReset(): void {
    this.selectedUserId.set('usr-eve');
    this.selectedResourceId.set('med-rec-001');
    this.selectedPolicyMode.set('vulnerable_no_check');
    this.singleExecutionResult.set(null);
    this.suiteExecutionResult.set(null);
    this.activeTab.set('simulation');
    this.labEngine.resetLab();
  }
}
