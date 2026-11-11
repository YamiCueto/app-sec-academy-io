import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CurriculumComponent } from './curriculum.component';
import { ContentService } from '../../core/services/content/content.service';
import { ProgressStore } from '../../core/stores/progress.store';

describe('CurriculumComponent', () => {
  let component: CurriculumComponent;
  let fixture: ComponentFixture<CurriculumComponent>;
  let progressStore: ProgressStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CurriculumComponent],
      providers: [
        provideRouter([]),
        ContentService,
        ProgressStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculumComponent);
    component = fixture.componentInstance;
    progressStore = TestBed.inject(ProgressStore);
    fixture.detectChanges();
  });

  it('debe crearse exitosamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar los 3 bloques curriculares principales', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const blockTitles = compiled.querySelectorAll('.block-title');
    expect(blockTitles.length).toBe(3);
    expect(blockTitles[0].textContent).toContain('Nivel Fundacional');
    expect(blockTitles[1].textContent).toContain('Nivel Intermedio');
    expect(blockTitles[2].textContent).toContain('Nivel Avanzado');
  });

  it('debe renderizar las 14 tarjetas de modulo en el catalogo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.module-card');
    expect(cards.length).toBe(14);
  });

  it('debe mostrar el Modulo 01 como disponible con sus 4 lecciones interactivas', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const m01Card = compiled.querySelector('.module-card.available');
    expect(m01Card).toBeTruthy();
    expect(m01Card?.textContent).toContain('M01');
    expect(m01Card?.textContent).toContain('Fundamentos OWASP Top 10');
    expect(m01Card?.textContent).toContain('Disponible');

    const quickLessons = m01Card?.querySelectorAll('.quick-lesson-item');
    expect(quickLessons?.length).toBe(4);
  });

  it('debe marcar los modulos M02 a M14 con la etiqueta Proximamente', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const upcomingCards = compiled.querySelectorAll('.module-card.upcoming');
    expect(upcomingCards.length).toBe(13);

    for (let i = 0; i < upcomingCards.length; i++) {
      expect(upcomingCards[i].textContent).toContain('Próximamente');
    }
  });

  it('debe reflejar reactivamente el progreso de lecciones completadas del Modulo 01', () => {
    progressStore.recordLessonCompletion('1.1', 100);
    progressStore.recordLessonCompletion('1.2', 100);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const m01Card = compiled.querySelector('.module-card.available');
    expect(m01Card?.textContent).toContain('2 de 4 lecciones completadas');
    expect(m01Card?.textContent).toContain('50%');
  });
});
