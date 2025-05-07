import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding, withDebugTracing, withRouterConfig } from '@angular/router';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';
import { OrcamentoDetailComponent } from './components/orcamento-detail/orcamento-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { loadingResolver } from './core/resolvers/loading.resolver';

const routes: Routes = [
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
resolve: { loading: loadingResolver }
},
{
path: 'novo',
component: OrcamentoFormComponent,
title: 'Novo Orçamento',
canActivate: [authGuard],
data: {
breadcrumb: 'Novo Orçamento',
roles: ['EDITOR', 'ADMIN']
}
},
{
path: 'editar/:id',
component: OrcamentoFormComponent,
title: 'Editar Orçamento',
canActivate: [authGuard],
data: {
breadcrumb: 'Editar Orçamento',
roles: ['EDITOR', 'ADMIN']
}
},
{
path: ':id',
component: OrcamentoDetailComponent,
title: 'Detalhes do Orçamento'
}
]
},
{
path: '**',
redirectTo: 'orcamentos'
}
];

@NgModule({
imports: [
RouterModule.forRoot(routes, {
      bindToComponentInputs: true, // Habilita binding de inputs via rota
      enableTracing: false, // Ativar apenas para debug
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), // Alternativa moderna para binding de inputs
      withDebugTracing(), // Para desenvolvimento
      withRouterConfig({
        paramsInheritanceStrategy: 'always' // Herança de parâmetros
      })
)
]
})
export class AppRoutingModule { }
