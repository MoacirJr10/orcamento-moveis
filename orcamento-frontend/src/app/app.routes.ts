import { Routes } from '@angular/router';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';
import { OrcamentoDetailComponent } from './components/orcamento-detail/orcamento-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

/**
* Configuração de rotas da aplicação Angular
*
* Estrutura:
* - Rotas principais
* - Redirecionamentos
* - Rotas protegidas
* - Rota de fallback (404)
*/
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
title: 'Lista de Orçamentos'
},
{
path: 'novo',
component: OrcamentoFormComponent,
title: 'Novo Orçamento',
canActivate: [authGuard]
},
{
path: ':id',
component: OrcamentoDetailComponent,
title: 'Detalhes do Orçamento'
},
{
path: ':id/editar',
component: OrcamentoFormComponent,
title: 'Editar Orçamento',
canActivate: [authGuard]
}
]
},
{
path: '**',
component: NotFoundComponent,
title: 'Página não encontrada'
}
];

/**
* Boas práticas implementadas:
*
* 1. Redirecionamento da rota vazia para rota principal
* 2. Organização hierárquica com children routes
* 3. Títulos de página para melhor SEO e acessibilidade
* 4. Proteção de rotas com Guards
* 5. Rota 404 para URLs inválidas
* 6. Estrutura CRUD completa (listar, detalhes, criar, editar)
* 7. Nomenclatura consistente de rotas
*/
