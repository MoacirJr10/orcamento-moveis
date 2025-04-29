import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { OrcamentoFormComponent } from './components/orcamento-form/orcamento-form.component';
import { OrcamentoListComponent } from './components/orcamento-list/orcamento-list.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
declarations: [
AppComponent,
OrcamentoFormComponent,
OrcamentoListComponent
],
imports: [
BrowserModule,
HttpClientModule,
ReactiveFormsModule,
RouterModule,
AppRoutingModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
