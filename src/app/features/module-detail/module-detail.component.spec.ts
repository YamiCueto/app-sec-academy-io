import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { ModuleDetailComponent } from './module-detail.component';
import { ContentService } from '../../core/services/content/content.service';
import { ProgressStore } from '../../core/stores/progress.store';

describe('ModuleDetailComponent', () => {
  let component: ModuleDetailComponent;
  let componentRef: ComponentRef<ModuleDetailComponent>;
  let fixture: ComponentFixture<ModuleDetailComponent>;
  let progressStore: ProgressStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ModuleDetailComponent],
      providers: [
        provideRouter([]),
        ContentService,
        ProgressStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleDetailComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    progressStore = TestBed.inject(ProgressStore);
    fixture.detectChanges();
  });

  it('debe crearse exitosamente con el modulo m01 por defecto', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.module-main-title')?.textContent).toContain('M01: Fundamentos OWASP Top 10');
  });

  it('debe mostrar los 4 objetivos pedagogicos de Bloom y estandares normativos para M01', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const bloomItems = compiled.querySelectorAll('.bloom-item');
    expect(bloomItems.length).toBe(4);
    expect(bloomItems[0].textContent).toContain('Recordar');
    expect(bloomItems[1].textContent).toContain('Comprender');
    expect(bloomItems[2].textContent).toContain('Aplicar');
    expect(bloomItems[3].textContent).toContain('Analizar');

    const stdItems = compiled.querySelectorAll('.standard-item');
    expect(stdItems.length).toBeGreaterThanOrEqual(2);
  });

  it('debe renderizar las 4 lecciones con boton Iniciar Leccion para el modulo M01', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const lessonCards = compiled.querySelectorAll('.lesson-row-card');
    expect(lessonCards.length).toBe(4);

    const actionBtns = compiled.querySelectorAll('.lesson-action-col .btn-primary-sm');
    expect(actionBtns.length).toBe(4);
  });

  it('debe mostrar estado de no encontrado cuando el ID de modulo no existe', () => {
    componentRef.setInput('id', 'm99-inexistente');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notFoundCard = compiled.querySelector('.module-not-found-card');
    expect(notFoundCard).toBeTruthy();
    expect(notFoundCard?.textContent).toContain('Módulo no encontrado');
    expect(notFoundCard?.textContent).toContain('m99-inexistente');
  });

  it('debe renderizar modulo planificado (M02) con lecciones deshabilitadas sin enlaces rotos', () => {
    componentRef.setInput('id', 'm02');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.module-main-title')?.textContent).toContain('M02: Secure Coding & Defensas');

    const disabledBtns = compiled.querySelectorAll('.btn-disabled-sm');
    expect(disabledBtns.length).toBe(4);
    for (let i = 0; i < disabledBtns.length; i++) {
      expect(disabledBtns[i].getAttribute('disabled')).not.toBeNull();
    }
  });

  it('debe reflejar reactivamente las lecciones completadas y actualizar el porcentaje', () => {
    progressStore.recordLessonCompletion('1.1', 100);
    progressStore.recordLessonCompletion('1.2', 100);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const banner = compiled.querySelector('.module-progress-banner');
    expect(banner?.textContent).toContain('2 de 4 lecciones aprobadas');
    expect(banner?.textContent).toContain('50%');

    const completedChips = compiled.querySelectorAll('.chip-done');
    expect(completedChips.length).toBe(2);
  });

  it('debe incluir enlaces de navegacion de retorno al catalogo curricular', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const returnLinks = compiled.querySelectorAll('a[href="/curriculum"], a[routerLink="/curriculum"]');
    expect(returnLinks.length).toBeGreaterThanOrEqual(1);

    componentRef.setInput('id', 'm99-inexistente');
    fixture.detectChanges();

    const notFoundLinks = compiled.querySelectorAll('a[href="/curriculum"], a[routerLink="/curriculum"]');
    expect(notFoundLinks.length).toBeGreaterThanOrEqual(1);
  });
});
