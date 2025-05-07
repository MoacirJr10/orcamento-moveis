import { Routes } from '@angular/router';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';
import { OrcamentoDetailComponent } from './components/orcamento-detail/orcamento-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
{
path: '',
redirectTo: 'orcamentos',
pathMatch: 'full'
},
{
path: 'orcamentos',
children: [
{
path: '',
component: OrcamentoListComponent,
title: 'Lista de Orçamentos',
data: {
breadcrumb: 'Orçamentos'
}
},
{
path: 'novo',
component: OrcamentoFormComponent,
title: 'Novo Orçamento',
canActivate: [authGuard],
data: {
breadcrumb: 'Novo',
roles: ['ADMIN', 'EDITOR']
}
},
{
path: 'editar/:id',
component: OrcamentoFormComponent,
title: 'Editar Orçamento',
canActivate: [authGuard],
data: {
breadcrumb: 'Editar',
roles: ['ADMIN', 'EDITOR']
}
},
{
path: ':id',
component: OrcamentoDetailComponent,
title: 'Detalhes do Orçamento',
data: {
breadcrumb: 'Detalhes'
}
}
]
},
{
path: 'auth',
loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    title: 'Autenticação'
  },
  {
    path: 'relatorios',
    loadComponent: () => import('./features/relatorios/relatorios.component'),
    title: 'Relatórios',
    canActivate: [authGuard],
    data: {
      roles: ['ADMIN']
    }
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Página não encontrada'
  }
];
