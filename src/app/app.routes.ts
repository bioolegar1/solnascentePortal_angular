import { Routes } from '@angular/router';

export const routes: Routes = [
  // Grupo com layout padrão (Header + Footer + WhatsApp)
  {
    path: '',
    loadComponent: () => import('./shared/default-layout/default-layout'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'produtos',
        loadComponent: () => import('./pages/produtos/produtos'),
      },
      {
        path: 'contato',
        loadComponent: () => import('./pages/contato/contato'),
      },
      {
        path: 'historia',
        loadComponent: () => import('./pages/historia/historia'),
      },
    ],
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'home',
  },
];
