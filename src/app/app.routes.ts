import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Inicio — AppSec Academy'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Panel — AppSec Academy'
      },
      {
        path: 'curriculum',
        loadComponent: () =>
          import('./features/curriculum/curriculum.component').then((m) => m.CurriculumComponent),
        title: 'Currículo — AppSec Academy'
      },
      {
        path: 'modulo/:id',
        loadComponent: () =>
          import('./features/module-detail/module-detail.component').then((m) => m.ModuleDetailComponent),
        title: 'Detalle de Módulo — AppSec Academy'
      },
      {
        path: 'leccion/:id',
        loadComponent: () =>
          import('./features/lesson-workspace/lesson-workspace.component').then((m) => m.LessonWorkspaceComponent),
        title: 'Espacio de Lección — AppSec Academy'
      },
      {
        path: 'laboratorio/:id',
        loadComponent: () =>
          import('./features/laboratory/laboratory.component').then((m) => m.LaboratoryComponent),
        title: 'Laboratorio — AppSec Academy'
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
        title: 'Perfil — AppSec Academy'
      },
      {
        path: '404',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
        title: '404 No Encontrado — AppSec Academy'
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  }
];
