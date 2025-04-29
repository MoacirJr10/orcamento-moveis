import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';

const routes: Routes = [
{ path: 'novo', component: OrcamentoFormComponent },
{ path: '', component: OrcamentoListComponent },
{ path: '**', redirectTo: '' }
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
