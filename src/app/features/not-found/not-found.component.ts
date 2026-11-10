import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="not-found-section" aria-labelledby="error-heading">
      <div class="error-card">
        <span class="error-code">404</span>
        <h1 id="error-heading" class="error-title">Ruta No Encontrada</h1>
        <p class="error-message">
          El recurso o ruta solicitada no existe dentro del mapa de navegación de AppSec Academy.
        </p>
        <div class="error-actions">
          <a routerLink="/inicio" class="btn btn-primary">Volver al Inicio</a>
          <a routerLink="/dashboard" class="btn btn-secondary">Ir al Panel</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found-section {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: var(--space-6) var(--space-4);
    }
    .error-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-8);
      max-width: 520px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .error-code {
      font-family: var(--font-mono);
      font-size: var(--text-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--sec-critical);
      background-color: rgba(244, 63, 94, 0.1);
      padding: 4px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--sec-critical);
    }
    .error-title {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }
    .error-message {
      color: var(--text-secondary);
      font-size: var(--text-base);
      line-height: 1.6;
    }
    .error-actions {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-2);
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
      min-height: 44px;
      text-decoration: none;
      cursor: pointer;
      transition: all 150ms ease-in-out;
    }
    .btn-primary {
      background-color: var(--color-primary);
      color: var(--bg-base);
    }
    .btn-primary:hover {
      background-color: var(--color-primary-hover);
    }
    .btn-secondary {
      background-color: var(--bg-surface-elevated);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
    }
    .btn-secondary:hover {
      background-color: var(--border-subtle);
    }
  `
})
export class NotFoundComponent {}
