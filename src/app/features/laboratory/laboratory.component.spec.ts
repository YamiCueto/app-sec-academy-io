import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StorageDriver, STORAGE_DRIVER } from '../../core/services/storage/storage-driver.token';
import { StorageService } from '../../core/services/storage/storage.service';
import { ProgressStore } from '../../core/stores/progress.store';
import { InlineSandboxDriver, SANDBOX_DRIVER } from '../../core/services/sandbox/sandbox-driver.token';
import { SandboxService } from '../../core/services/sandbox/sandbox.service';
import { LabEngineService } from '../../core/services/lab/lab-engine.service';
import { LaboratoryComponent } from './laboratory.component';

class MockStorageDriver implements StorageDriver {
  store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

@Component({
  imports: [LaboratoryComponent],
  template: `
    <app-laboratory [id]="labId()" />
  `
})
class TestLabHostComponent {
  readonly labId = signal<string>('LAB-BAC-01');
}

describe('LaboratoryComponent', () => {
  let fixture: ComponentFixture<TestLabHostComponent>;
  let host: TestLabHostComponent;
  let mockStorage: MockStorageDriver;

  beforeEach(async () => {
    mockStorage = new MockStorageDriver();
    await TestBed.configureTestingModule({
      imports: [TestLabHostComponent, LaboratoryComponent],
      providers: [
        provideRouter([]),
        LabEngineService,
        SandboxService,
        ProgressStore,
        StorageService,
        { provide: STORAGE_DRIVER, useValue: mockStorage },
        { provide: SANDBOX_DRIVER, useClass: InlineSandboxDriver }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestLabHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('1. debe inicializarse y renderizar el encabezado y contexto del laboratorio LAB-BAC-01', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.lab-title')?.textContent).toContain(
      'Control de Acceso y Remediación IDOR en API'
    );
    expect(compiled.querySelector('.badge-primary')?.textContent).toBe('BAC-01');
    expect(compiled.querySelector('.scenario-banner')?.textContent).toContain(
      'Contexto del Escenario:'
    );
  });

  it('2. debe ejecutar una peticion simulada en modo vulnerable y mostrar alerta de explotacion IDOR', async () => {
    const labComp = fixture.debugElement.children[0].componentInstance as LaboratoryComponent;
    await labComp.onExecuteSimulation();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.status-badge')?.textContent).toContain('HTTP 200');
    expect(compiled.querySelector('.exploit-warning')?.textContent).toContain(
      'ALERTA DE SEGURIDAD CRITICA'
    );
  });

  it('3. debe conmutar a politica remediada y reflejar HTTP 403 Forbidden al consultar registro ajeno', async () => {
    const labComp = fixture.debugElement.children[0].componentInstance as LaboratoryComponent;
    labComp.onSelectPolicyMode('remediated_owner_check');
    labComp.onSelectUser('usr-eve');
    labComp.onSelectResource('med-rec-001');

    await labComp.onExecuteSimulation();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.status-badge')?.textContent).toContain('HTTP 403');
    expect(compiled.querySelector('.remediation-success')?.textContent).toContain(
      'DEFENSA EFECTIVA'
    );
  });

  it('4. debe ejecutar la suite de aserciones en modo remediado mostrando las 5 aserciones aprobadas', async () => {
    const labComp = fixture.debugElement.children[0].componentInstance as LaboratoryComponent;
    labComp.onSelectPolicyMode('remediated_owner_check');

    await labComp.onRunTestSuite();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const assertCards = compiled.querySelectorAll('.assertion-card');
    expect(assertCards.length).toBe(5);
    expect(compiled.querySelector('.suite-summary-banner')?.textContent).toContain(
      '100% de Aserciones Superadas'
    );
  });

  it('5. debe renderizar la vista de laboratorio no encontrado si se proporciona un ID inexistente', async () => {
    host.labId.set('lab-inexistente-99');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.not-found-title')?.textContent).toContain(
      'Laboratorio no encontrado'
    );
  });

  it('6. debe incluir enlaces de retorno directo a la leccion 1.2 tanto en la cabecera activa como en no encontrado', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const returnBtn = compiled.querySelector('.back-lesson-btn');
    expect(returnBtn).toBeTruthy();
    expect(returnBtn?.textContent).toContain('Volver a la Lección 1.2');

    host.labId.set('lab-inexistente-99');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const notFoundReturn = fixture.nativeElement.querySelector('.not-found-actions .btn-secondary');
    expect(notFoundReturn).toBeTruthy();
    expect(notFoundReturn?.textContent).toContain('Volver a la Lección 1.2');
  });
});
