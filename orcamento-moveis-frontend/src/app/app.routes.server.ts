import { RenderMode, ServerRoute } from '@angular/ssr';
import { Routes } from '@angular/router';
import { OrcamentoListComponent } from './app/components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './app/components/orcamento-form/orcamento-form.component';

// Configuração das rotas do cliente para referência
export const clientRoutes: Routes = [
{ path: '', redirectTo: 'orcamentos', pathMatch: 'full' },
{ path: 'orcamentos', component: OrcamentoListComponent },
{ path: 'orcamentos/novo', component: OrcamentoFormComponent },
{ path: 'orcamentos/editar/:id', component: OrcamentoFormComponent },
{ path: '**', redirectTo: 'orcamentos' }
];

// Configuração das rotas do servidor (SSR)
export const serverRoutes: ServerRoute[] = [
{
path: '',
renderMode: RenderMode.Prerender,
providers: [
// Providers específicos para a rota raiz
]
},
{
path: 'orcamentos',
renderMode: RenderMode.Prerender,
providers: [
// Providers específicos para a lista de orçamentos
],
data: {
// Dados adicionais para SSR
ssr: {
cache: true,
ttl: 3600 // 1 hora de cache
}
}
},
{
path: 'orcamentos/novo',
renderMode: RenderMode.Prerender
},
{
path: 'orcamentos/editar/:id',
renderMode: RenderMode.Prerender,
data: {
ssr: {
cache: false // Não cachear páginas de edição
}
}
},
{
path: '**',
renderMode: RenderMode.Prerender,
providers: [
// Providers para rotas não encontradas
]
}
];
