import { NavLink } from '../../models/navigation.model';

export const NAV_LINKS: readonly NavLink[] = [
  {
    path: '/inicio',
    label: 'Inicio',
    exact: true
  },
  {
    path: '/dashboard',
    label: 'Panel'
  },
  {
    path: '/curriculum',
    label: 'Currículo'
  },
  {
    path: '/perfil',
    label: 'Perfil'
  }
];
