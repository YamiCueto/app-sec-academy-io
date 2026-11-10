import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_LINKS } from '../../../core/constants/navigation.constants';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly layoutService = inject(LayoutService);
  protected readonly navLinks = NAV_LINKS;
}
