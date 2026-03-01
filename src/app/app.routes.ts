import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. GRUPO COM LAYOUT PADRÃO (Header + Footer + WhatsApp)
  {
    path: '',
    // Lógica: Aqui carregamos o seu DefaultLayout como o componente "pai".
    // Todas as rotas dentro de 'children' serão renderizadas no <router-outlet> dele.
    loadComponent: () => import('../app/shared/default-layout/default-layout'),
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

  // 2. ROTAS SEM LAYOUT (Páginas Limpas)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login'),
  },

  // 3. GRUPO ADMINISTRATIVO
  // Futuramente, você pode criar um 'AdminLayout' aqui da mesma forma que o Default
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/dashboard/dashboard'),
      },
      {
        path: 'produtos/novo',
        loadComponent: () => import('./pages/admin/produtos/novo/novo'),
      },
      {
        path: 'produtos/editar/:id',
        loadComponent: () => import('./pages/admin/produtos/editar/editar'),
      },
    ],
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'home',
  },
];
