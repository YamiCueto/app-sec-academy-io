import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withHashLocation } from '@angular/router';
import { PlaceholderViewComponent } from './placeholder-view.component';

@Component({
  imports: [PlaceholderViewComponent],
  template: `
    <app-placeholder-view
      title="Titulo de Prueba"
      description="Descripcion de Prueba"
      code="TEST_CODE"
      entityId="param-123"
      milestone="Hito X"
    />
  `
})
class TestHostComponent {}

describe('PlaceholderViewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, PlaceholderViewComponent],
      providers: [provideRouter([], withHashLocation())]
    }).compileComponents();
  });

  it('debe renderizar el titulo, codigo, descripcion, parametro y hito correctamente', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.view-title')?.textContent).toContain('Titulo de Prueba');
    expect(compiled.querySelector('.view-description')?.textContent).toContain('Descripcion de Prueba');
    expect(compiled.querySelector('.code-badge')?.textContent).toContain('TEST_CODE');
    expect(compiled.querySelector('.param-value')?.textContent).toContain('param-123');
    expect(compiled.querySelector('.milestone-value')?.textContent).toContain('Hito X');
  });
});
