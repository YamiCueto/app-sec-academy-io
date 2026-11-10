import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('debe inicializarse con el menu movil cerrado', () => {
    expect(service.isMobileMenuOpen()).toBe(false);
  });

  it('debe alternar el estado del menu movil con toggleMobileMenu', () => {
    service.toggleMobileMenu();
    expect(service.isMobileMenuOpen()).toBe(true);

    service.toggleMobileMenu();
    expect(service.isMobileMenuOpen()).toBe(false);
  });

  it('debe cerrar el menu movil explicitamente con closeMobileMenu', () => {
    service.toggleMobileMenu();
    expect(service.isMobileMenuOpen()).toBe(true);

    service.closeMobileMenu();
    expect(service.isMobileMenuOpen()).toBe(false);
  });
});
