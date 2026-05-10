import { Routes } from '@angular/router';
import { redirectAuthenticatedGuard, requireAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectAuthenticatedGuard],
    loadComponent: () => import('./core/auth/auth').then((m) => m.Auth),
  },
  {
    path: 'account',
    canActivate: [requireAuthGuard],
    loadComponent: () => import('./features/account/account').then((m) => m.Account),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
