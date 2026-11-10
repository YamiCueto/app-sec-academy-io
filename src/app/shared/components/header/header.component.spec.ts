import { TestBed } from '@angular/core/testing';
import { provideRouter, withHashLocation } from '@angular/router';
import { HeaderComponent } from './header.component';
import { LayoutService } from '../../../core/services/layout.service';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([], withHashLocation()), LayoutService]
    }).compileComponents();
  });

  it('debe crear el componente de encabezado', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debe renderizar el identificador y titulo de marca de AppSec Academy', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-badge')?.textContent).toContain('APPSEC');
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('Academy');
  });

  it('debe alternar el menu movil al presionar el boton toggle', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();

    const toggleButton = fixture.nativeElement.querySelector('.mobile-menu-toggle') as HTMLButtonElement;
    expect(layoutService.isMobileMenuOpen()).toBe(false);

    toggleButton.click();
    fixture.detectChanges();
    expect(layoutService.isMobileMenuOpen()).toBe(true);

    toggleButton.click();
    fixture.detectChanges();
    expect(layoutService.isMobileMenuOpen()).toBe(false);
  });
});
