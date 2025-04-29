import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';

@NgModule({
declarations: [
AppComponent,
OrcamentoListComponent,
OrcamentoFormComponent
],
imports: [
BrowserModule,
HttpClientModule,
RouterModule,
AppRoutingModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
