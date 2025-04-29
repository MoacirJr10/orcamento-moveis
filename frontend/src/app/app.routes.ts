import { Routes } from '@angular/router';
import { OrcamentoListComponent } from './orcamento-list/orcamento-list.component';
import { OrcamentoFromComponent } from './orcamento-from/orcamento-from.component';

export const routes: Routes = [
{
path: '',
redirectTo: 'orcamentos',
pathMatch: 'full'
},
{
path: 'orcamentos',
component: OrcamentoListComponent
},
{
path: 'orcamentos/novo',
component: OrcamentoFromComponent,
data: {
mode: 'new'
}
},
{
path: 'orcamentos/editar/:id',
component: OrcamentoFromComponent,
data: {
mode: 'edit'
}
},
{
path: '**',
redirectTo: 'orcamentos'
}
];
