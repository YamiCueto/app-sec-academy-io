import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CodeViewerComponent } from './code-viewer.component';

@Component({
  imports: [CodeViewerComponent],
  template: `
    <app-code-viewer
      [code]="codeSample"
      [filename]="filename"
      [language]="language"
      [variant]="variant"
    />
  `
})
class TestHostComponent {
  codeSample = 'const secret = 42;\nconsole.log(secret);';
  filename = 'auth.ts';
  language = 'typescript';
  variant: 'default' | 'vulnerable' | 'remediated' = 'vulnerable';
}

describe('CodeViewerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CodeViewerComponent]
    }).compileComponents();
  });

  it('debe renderizar el codigo fuente con numeros de linea accesibles', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const lines = compiled.querySelectorAll('.code-line');
    expect(lines.length).toBe(2);
    expect(lines[0].querySelector('.line-number')?.textContent).toBe('1');
    expect(lines[0].querySelector('.line-content')?.textContent).toContain('const secret = 42;');
    expect(lines[1].querySelector('.line-number')?.textContent).toBe('2');
  });

  it('debe mostrar el nombre de archivo y la insignia de variante vulnerable', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.file-name')?.textContent).toContain('auth.ts');
    expect(compiled.querySelector('.pill-vulnerable')?.textContent).toContain('Vulnerable');
    expect(compiled.querySelector('.language-tag')?.textContent).toContain('typescript');
  });

  it('debe cambiar a variante remediada dinamicamente', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.variant = 'remediated';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.pill-remediated')?.textContent).toContain('Remediado');
  });

  it('debe ejecutar el copiado de codigo sin arrojar errores', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const copyBtn = fixture.nativeElement.querySelector('.copy-btn') as HTMLButtonElement;
    expect(copyBtn).toBeTruthy();

    copyBtn.click();
    fixture.detectChanges();
    expect(copyBtn.textContent).toBeTruthy();
  });
});
