import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly _isMobileMenuOpen = signal<boolean>(false);

  readonly isMobileMenuOpen = this._isMobileMenuOpen.asReadonly();

  toggleMobileMenu(): void {
    this._isMobileMenuOpen.update((state) => !state);
  }

  closeMobileMenu(): void {
    this._isMobileMenuOpen.set(false);
  }
}
