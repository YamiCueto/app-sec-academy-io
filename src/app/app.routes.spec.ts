import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('Enrutamiento y Navegacion Inicial', () => {
  let harness: RouterTestingHarness;
  let location: Location;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withHashLocation(), withComponentInputBinding())
      ]
    });
    location = TestBed.inject(Location);
    harness = await RouterTestingHarness.create();
  });

  it('debe redirigir la ruta raiz a /inicio', async () => {
    await harness.navigateByUrl('/');
    expect(location.path()).toBe('/inicio');
    const heading = harness.routeNativeElement?.querySelector('.hero-title');
    expect(heading?.textContent).toContain('Aprende Seguridad de Aplicaciones');
  });

  it('debe navegar hacia /dashboard cargando la vista provisional del panel', async () => {
    await harness.navigateByUrl('/dashboard');
    expect(location.path()).toBe('/dashboard');
    const title = harness.routeNativeElement?.querySelector('.view-title');
    expect(title?.textContent).toContain('Panel de Aprendizaje');
  });

  it('debe navegar hacia /curriculum cargando la vista provisional del curriculo', async () => {
    await harness.navigateByUrl('/curriculum');
    expect(location.path()).toBe('/curriculum');
    const title = harness.routeNativeElement?.querySelector('.view-title');
    expect(title?.textContent).toContain('Currículo de Especialización AppSec');
  });

  it('debe navegar hacia /modulo/:id y reflejar el identificador del modulo', async () => {
    await harness.navigateByUrl('/modulo/m01');
    expect(location.path()).toBe('/modulo/m01');
    const title = harness.routeNativeElement?.querySelector('.view-title');
    const param = harness.routeNativeElement?.querySelector('.param-value');
    expect(title?.textContent).toContain('Detalle del Módulo');
    expect(param?.textContent).toContain('m01');
  });

  it('debe navegar hacia /leccion/:id y reflejar el identificador de la leccion', async () => {
    await harness.navigateByUrl('/leccion/1.2');
    expect(location.path()).toBe('/leccion/1.2');
    const title = harness.routeNativeElement?.querySelector('.view-title');
    const param = harness.routeNativeElement?.querySelector('.param-value');
    expect(title?.textContent).toContain('Espacio de Trabajo de Lección');
    expect(param?.textContent).toContain('1.2');
  });

  it('debe navegar hacia /laboratorio/:id y reflejar el identificador del laboratorio', async () => {
    await harness.navigateByUrl('/laboratorio/lab-bac-01');
    expect(location.path()).toBe('/laboratorio/lab-bac-01');
    const title = harness.routeNativeElement?.querySelector('.view-title');
    const param = harness.routeNativeElement?.querySelector('.param-value');
    expect(title?.textContent).toContain('Laboratorio Interactivo de Seguridad');
    expect(param?.textContent).toContain('lab-bac-01');
  });

  it('debe navegar hacia /perfil cargando la vista provisional de perfil', async () => {
    await harness.navigateByUrl('/perfil');
    expect(location.path()).toBe('/perfil');
    const title = harness.routeNativeElement?.querySelector('.view-title');
    expect(title?.textContent).toContain('Perfil de Ingeniería y Ajustes');
  });

  it('debe navegar directamente hacia /404 cargando NotFoundComponent', async () => {
    await harness.navigateByUrl('/404');
    expect(location.path()).toBe('/404');
    const title = harness.routeNativeElement?.querySelector('.error-title');
    expect(title?.textContent).toContain('Ruta No Encontrada');
  });

  it('debe redirigir rutas no configuradas hacia /404', async () => {
    await harness.navigateByUrl('/ruta-inexistente-xyz');
    expect(location.path()).toBe('/404');
    const title = harness.routeNativeElement?.querySelector('.error-title');
    expect(title?.textContent).toContain('Ruta No Encontrada');
  });
});
