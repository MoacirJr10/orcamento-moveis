import { Routes } from '@angular/router';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';

export const routes: Routes = [
{ path: '', component: OrcamentoListComponent },
{ path: 'orcamentos', component: OrcamentoListComponent },
];
